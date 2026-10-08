export type ProvinceCode = "EC" | "FS" | "GP" | "KZN" | "LP" | "MP" | "NC" | "NW" | "WC" | "NAT";

export type LanguageCode =
  | "zul" | "xho" | "afr" | "nso" | "tsn" | "eng"
  | "sot" | "tso" | "ssw" | "ven" | "nbl" | "sasl";

export type SectionId =
  | "games" | "languages" | "stories" | "poetry"
  | "food" | "culture" | "map" | "feed";

/** Shared shape so every section can flow into the feed, search and saves. */
export interface ArchiveRef {
  section: SectionId;
  slug: string;
  title: string;
  subtitle?: string;
}

/* ------------------------------- games -------------------------------- */

export interface GameVariation { place: string; text: string }

export interface Game {
  slug: string;
  name: string;
  /** What the game is called in other South African languages. */
  aka: { lang: string; name: string }[];
  tagline: string;
  players: string;
  ages: string;
  kit: string[];
  provinces: ProvinceCode[];
  about: string;
  how: string[];
  rules: string[];
  variations: GameVariation[];
  challenge: { title: string; brief: string; xp: number };
  /** Slug of a built-in digital version, if one exists. */
  playable?: "diketo" | "morabaraba";
  demo: string;
  tags: string[];
}

/* ------------------------------ languages ------------------------------ */

export interface Entry { term: string; meaning: string; note?: string }
export interface Proverb { text: string; literal: string; meaning: string }

export interface Language {
  code: LanguageCode;
  name: string;
  endonym: string;
  /** Home-language share, Census 2022 (Stats SA). */
  share: number;
  speakersNote: string;
  regions: ProvinceCode[];
  family: string;
  blurb: string;
  sound: string;
  greetings: Entry[];
  words: Entry[];
  phrases: Entry[];
  proverbs: Proverb[];
  idioms: Proverb[];
  slang: Entry[];
  /** Workspace path to a narrated clip, when one has been recorded. */
  audio?: string[];
}

/* ------------------------------- stories ------------------------------- */

export type StoryKind =
  | "gogo" | "mkhulu" | "childhood" | "village" | "township" | "howwelived";

export interface Story {
  slug: string;
  title: string;
  kind: StoryKind;
  teller: string;
  tellerRole: string;
  place: string;
  province: ProvinceCode;
  year: string;
  minutes: number;
  summary: string;
  body: string[];
  pullQuote: string;
  language: string;
  tags: string[];
  audio?: string[];
  /** Seeded illustrative entries are labelled so they are never mistaken for
      a real recorded testimony. */
  seeded: true;
}

/* -------------------------------- poetry ------------------------------- */

export type PoemKind = "izibongo" | "spoken" | "traditional" | "user" | "challenge";

export interface Poem {
  slug: string;
  title: string;
  kind: PoemKind;
  poet: string;
  poetRole: string;
  language: string;
  about: string;
  lines?: { text: string; translation?: string }[];
  notes?: string[];
  prompt?: string;
  entries?: number;
  closes?: string;
  tags: string[];
  /** One or more audio parts, played back to back. */
  audio?: string[];
  seeded?: boolean;
}

/* --------------------------------- food -------------------------------- */

export interface Recipe {
  slug: string;
  name: string;
  aka: string[];
  region: string;
  province: ProvinceCode;
  kind: "staple" | "feast" | "street" | "drink" | "sweet" | "wild";
  time: string;
  serves: string;
  heat: string;
  story: string;
  ingredients: { group?: string; items: string[] }[];
  method: string[];
  serveWith: string[];
  tip: string;
  tags: string[];
}

/* ------------------------------- culture ------------------------------- */

export type CultureKind =
  | "clothing" | "ceremony" | "marriage" | "music" | "dance" | "craft" | "home";

export interface CultureItem {
  slug: string;
  name: string;
  kind: CultureKind;
  people: string;
  province: ProvinceCode;
  oneLine: string;
  body: string[];
  facts: { label: string; value: string }[];
  tags: string[];
}

/* ------------------------------- heritage ------------------------------ */

export interface HeritagePlace {
  slug: string;
  name: string;
  alsoKnown?: string;
  province: ProvinceCode;
  lat: number;
  lng: number;
  era: string;
  kind: "liberation" | "ancient" | "sacred" | "removal" | "conflict" | "living";
  whatHappened: string;
  detail: string[];
  people: { name: string; note: string }[];
  nameMeaning?: string;
  status?: string;
  communityVoices: { who: string; text: string }[];
}

/* --------------------------------- feed -------------------------------- */

export interface Post {
  id: string;
  handle: string;
  name: string;
  avatarSeed: string;
  place: string;
  province: ProvinceCode;
  caption: string;
  body?: string;
  kind: "game" | "language" | "story" | "poetry" | "food" | "culture" | "place";
  mediaKind: "video" | "audio" | "photo";
  duration: string;
  likes: number;
  comments: { who: string; text: string }[];
  tags: string[];
  /** Playable media for seeded posts that have a recording. */
  mediaUrl?: string;
  /** Links the post back into the archive. */
  link?: { section: SectionId; slug: string; label: string };
  elder?: boolean;
  seeded: true;
}
