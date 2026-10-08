-- ROOTS SA — initial schema
-- Run with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
--
-- Design notes
--  * The editorial archive (games, languages, stories, poetry, food, culture, heritage
--    places) ships bundled with the app and is mirrored into `archive_entries` so it can
--    be searched, referenced and extended from the database.
--  * Everything a user creates — posts, comments, likes, saves, challenge entries and
--    community voices on heritage places — lives in its own table behind row level
--    security.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums --

do $$ begin
  create type province_code as enum ('EC','FS','GP','KZN','LP','MP','NC','NW','WC','NAT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type section_id as enum ('games','languages','stories','poetry','food','culture','map','feed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_kind as enum ('video','audio','photo','text');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------- profiles --

create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  handle       text unique not null,
  display_name text not null,
  avatar_seed  text not null default 'roots',
  place        text,
  province     province_code,
  bio          text,
  -- Elders get a badge and their contributions are prioritised in the archive.
  is_elder     boolean not null default false,
  created_at   timestamptz not null default now()
);

comment on column public.profiles.is_elder is
  'Marks a contributor as an elder. Used for the badge and for elder-first ordering.';

-- ------------------------------------------------------- archive mirror --

create table if not exists public.archive_entries (
  section    section_id not null,
  slug       text not null,
  title      text not null,
  subtitle   text,
  province   province_code,
  tags       text[] not null default '{}',
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (section, slug)
);

create index if not exists archive_entries_tags_idx on public.archive_entries using gin (tags);
create index if not exists archive_entries_search_idx
  on public.archive_entries using gin (to_tsvector('simple', title || ' ' || coalesce(subtitle, '')));

-- ---------------------------------------------------------------- posts --

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  kind          section_id not null default 'feed',
  media_kind    media_kind not null default 'video',
  -- Storage object path inside the `media` bucket.
  media_path    text,
  duration      text,
  caption       text not null,
  body          text,
  place         text,
  province      province_code,
  language      text,
  tags          text[] not null default '{}',
  -- Optional link back into the editorial archive.
  link_section  section_id,
  link_slug     text,
  -- Set when the post is an entry into a poetry or game challenge.
  challenge_slug text,
  is_published  boolean not null default true,
  like_count    integer not null default 0,
  comment_count integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists posts_kind_idx on public.posts (kind, created_at desc);
create index if not exists posts_link_idx on public.posts (link_section, link_slug);
create index if not exists posts_challenge_idx on public.posts (challenge_slug) where challenge_slug is not null;
create index if not exists posts_tags_idx on public.posts using gin (tags);

-- ------------------------------------------------------------- comments --

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_id, created_at);

-- ---------------------------------------------------------------- likes --

create table if not exists public.likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ---------------------------------------------------------------- saves --
-- A save can point either at a post or at an archive entry.

create table if not exists public.saves (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid references public.posts(id) on delete cascade,
  section    section_id,
  slug       text,
  created_at timestamptz not null default now(),
  constraint saves_target_check check (
    (post_id is not null and section is null and slug is null) or
    (post_id is null and section is not null and slug is not null)
  )
);

create unique index if not exists saves_post_unique on public.saves (user_id, post_id) where post_id is not null;
create unique index if not exists saves_entry_unique on public.saves (user_id, section, slug) where slug is not null;

-- ----------------------------------------------------- heritage voices --

create table if not exists public.place_voices (
  id         uuid primary key default gen_random_uuid(),
  place_slug text not null,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null,
  media_path text,
  created_at timestamptz not null default now()
);

create index if not exists place_voices_place_idx on public.place_voices (place_slug, created_at desc);

-- --------------------------------------------------- counter maintenance --

create or replace function public.bump_like_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;

drop trigger if exists likes_count_trigger on public.likes;
create trigger likes_count_trigger
  after insert or delete on public.likes
  for each row execute function public.bump_like_count();

create or replace function public.bump_comment_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;

drop trigger if exists comments_count_trigger on public.comments;
create trigger comments_count_trigger
  after insert or delete on public.comments
  for each row execute function public.bump_comment_count();

-- Create a profile row automatically on sign-up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, handle, display_name, avatar_seed)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'New contributor'),
    coalesce(new.raw_user_meta_data->>'avatar_seed', substr(new.id::text, 1, 8))
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------- row level security --

alter table public.profiles       enable row level security;
alter table public.archive_entries enable row level security;
alter table public.posts          enable row level security;
alter table public.comments       enable row level security;
alter table public.likes          enable row level security;
alter table public.saves          enable row level security;
alter table public.place_voices   enable row level security;

-- Profiles: world-readable, self-writable.
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles for select using (true);

drop policy if exists "users manage own profile" on public.profiles;
create policy "users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Archive: world-readable, writable only by the service role (seed script).
drop policy if exists "archive is public" on public.archive_entries;
create policy "archive is public" on public.archive_entries for select using (true);

-- Posts: published posts are public; authors manage their own.
drop policy if exists "published posts are public" on public.posts;
create policy "published posts are public" on public.posts
  for select using (is_published or auth.uid() = author_id);

drop policy if exists "users create own posts" on public.posts;
create policy "users create own posts" on public.posts
  for insert with check (auth.uid() = author_id);

drop policy if exists "users update own posts" on public.posts;
create policy "users update own posts" on public.posts
  for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

drop policy if exists "users delete own posts" on public.posts;
create policy "users delete own posts" on public.posts
  for delete using (auth.uid() = author_id);

-- Comments.
drop policy if exists "comments are public" on public.comments;
create policy "comments are public" on public.comments for select using (true);

drop policy if exists "users create own comments" on public.comments;
create policy "users create own comments" on public.comments
  for insert with check (auth.uid() = author_id);

drop policy if exists "users delete own comments" on public.comments;
create policy "users delete own comments" on public.comments
  for delete using (auth.uid() = author_id);

-- Likes.
drop policy if exists "likes are public" on public.likes;
create policy "likes are public" on public.likes for select using (true);

drop policy if exists "users manage own likes" on public.likes;
create policy "users manage own likes" on public.likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Saves are private to the user.
drop policy if exists "users read own saves" on public.saves;
create policy "users read own saves" on public.saves
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Heritage community voices.
drop policy if exists "place voices are public" on public.place_voices;
create policy "place voices are public" on public.place_voices for select using (true);

drop policy if exists "users create own place voices" on public.place_voices;
create policy "users create own place voices" on public.place_voices
  for insert with check (auth.uid() = author_id);

drop policy if exists "users delete own place voices" on public.place_voices;
create policy "users delete own place voices" on public.place_voices
  for delete using (auth.uid() = author_id);

-- -------------------------------------------------------------- storage --

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "media is public" on storage.objects;
create policy "media is public" on storage.objects
  for select using (bucket_id in ('media', 'avatars'));

drop policy if exists "users upload own media" on storage.objects;
create policy "users upload own media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('media', 'avatars')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own media" on storage.objects;
create policy "users delete own media" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('media', 'avatars')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ------------------------------------------------------------- feed view --

create or replace view public.feed_posts
with (security_invoker = true) as
select
  p.*,
  pr.handle,
  pr.display_name,
  pr.avatar_seed,
  pr.is_elder
from public.posts p
join public.profiles pr on pr.id = p.author_id
where p.is_published;
