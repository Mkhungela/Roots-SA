# Landscape: who else is doing this

Research done 7 October 2025. Two separate markets collide in ROOTS SA — **African language
learning apps** (commercial, consumer, crowded) and **oral-history / heritage archives**
(institutional, grant-funded, not crowded but not consumer-facing either). Almost nobody is in
the overlap, which is both the opportunity and the warning.

---

## 1. Language learning — crowded, and some of it is good

| Product | Coverage | Model | What they do better than us |
|---|---|---|---|
| **[Angula](https://angula.app/)** | 10 Southern African languages — isiNdebele, isiXhosa, isiZulu, Khoikhoi, Sepedi, Sesotho, Setswana, siSwati, Tshivenḓa, Xitsonga | Freemium, iOS/Android/web, SA company (Angula Languages Pty Ltd) | **Narrated by native speakers, not AI.** 4.7★ over 616 ratings. Bite-sized expert-designed lessons, AI dictation and free-form translation. Enterprise tier for schools and libraries; "Mahlahle" for ages 2–8 |
| **[NKENNE](https://nkenne.com/)** | 15 African languages incl. isiZulu | Subscription | AI translation tuned for tonal nuance; **NKENNE LiiVE** gives 1:1 sessions with native tutors |
| **Duolingo isiZulu** | isiZulu + Swahili only | Free | Launched Aug 2022 with Nal'ibali; Vodacom bundled a free year. Distribution at a scale nobody else gets near — ~50M MAU |
| **Dialogue Africa** | Twi, Ga, Yoruba, Swahili, Igbo, Somali, Shona | Subscription | Deliberately teaches culture and proverbs alongside the language — closest in *philosophy* to us |
| **[Ambani Africa](https://www.ambaniafrica.com/)** | 15+ languages, ages 2–8 | SA EdTech, B2B + B2C | Gamified, augmented-reality physical books, public-sector contracts |
| **Mzanzi Kids** | 6 SA languages, ages 2–6 | App | Early pre-literacy niche |
| Ling / Memrise / Mondly / uTalk | Afrikaans, Swahili, scattered | Subscription | Scale and polish |

**Read:** language-learning-as-a-product is taken, and Angula owns the Southern African niche with
real native-speaker audio. Competing with them head-on on lesson quality would be foolish.

Our language section should **not** try to be a course. Its job is to be the *reference and
pronunciation layer attached to cultural context* — the proverb with the story behind it, the slang
with the township it came from. That is a different thing from a graded curriculum, and it is
the thing Angula and Duolingo structurally cannot do, because their unit is the lesson and ours
is the artefact.

**Direct consequence for us:** the synthesized speech in the language section is our weakest
point and the competition's strongest. `src/lib/speak.ts` already falls back to a browser voice
and tells the user when there is no native voice. The honest long game is community-recorded
pronunciation — which is exactly what `/contribute?kind=language` is for.

---

## 2. Heritage and oral-history archives — serious, and almost all institutional

| Project | What it is | Relevance |
|---|---|---|
| **[South African History Online](https://www.sahistory.org.za/)** | Founded 2000 by Omar Badsha. Non-profit. Claims to be the largest online SA/African history site; grew from a database into a teaching platform with an online classroom | The incumbent for SA history on the web. Strong on written history, weak on *recorded voice* and contribution |
| **[AODL / African Online Digital Library](https://aodl.org/)** (Michigan State MATRIX) | Open-access library of African cultural heritage. "African Oral Narratives" holds oral and life histories, folklore, songs from Ethiopia, Ghana, SA. "'Forgotten' Voices in the Present" = 55 oral interviews + 18 photographs from three poor SA communities post-1994 | Closest thing to our *content*. Built for researchers, not for a sixteen-year-old |
| **Ulwazi Programme** (eThekwini Municipality, 2008) | MediaWiki "community memory" wiki. Local volunteers trained as oral-history fieldworkers. 800+ articles in Zulu and English; 35–44k visits/month by 2014; **74% of traffic mobile** | **The most direct precedent that exists.** Municipal library infrastructure + trained community fieldworkers. Proof the contribution model works in SA |
| **Centre for Popular Memory** (UCT) | 1,600 hours audio, 200 hours video, fully transcribed | The gold standard for archival rigour — and the source of our cost reality check |
| **FHYA / EMANDULO** (UCT) | Precolonial southern African sources; multi-language; creative multimedia interpretation | Shows what ambitious, non-colonial archive *representation* looks like |
| **DISA** (UKZN) | Digitised liberation-struggle materials across southern Africa | Conservation-first model |
| **[Mukurtu CMS](https://mukurtu.org/)** | Open-source (Drupal) archive platform built with and for Indigenous communities. 600+ groups | **The most important reference for us.** See below |
| **[The African Archives](https://theafricanarchives.org/)** | Pan-African portal, welcomes contributors | Same ambition, thin on audio so far |
| **FamilySearch oral genealogies** | Recording elders' genealogical knowledge since 2004 | Precedent for "interview the elder" at scale |

### Mukurtu is the one to learn from

Mukurtu is the Warumungu word for a *safe keeping place*. It was built with the Warumungu
Aboriginal community and is now used by 600+ Indigenous groups. Its design assumptions are the
opposite of a normal CMS, and they are the right ones for this project:

- **Cultural protocols** — access is defined by the community, at a granular level, anywhere on
  the scale from fully open to restricted to one named person. Protocols can change as community
  norms change.
- **Traditional Knowledge (TK) Labels** — community-authored labels stating how an item may be
  accessed, used and attributed, *even when a third party legally owns the material*.
- **Community Records** — multiple parallel narratives per item, so an object can carry several
  people's accounts without one being promoted to "the" description.
- **Data integrity** — file hashes, so material cannot be silently altered.
- A dictionary with audio, and curriculum tools.

Kimberly Christen's framing of the problem it solves: the colonial collecting mission left
materials "displaced from their home communities and often-times contain wrong, misleading,
derogatory, or offensive metadata, that gets continually and endlessly circulated once those
collections are digitized, put online, and then scraped up by aggregators."

### The Ulwazi critique we should take personally

An SIT field study of Ulwazi found the community was discussed surprisingly little in the
programme's own literature — contributors read as "secondary to the final product of the website,
a means to an e-library end". Authorship and source citation were not a priority. The programme
director's line, *"How many times do you have to tell a story before it becomes common property?"*,
is a real question, but used carelessly it erases the person who told it.

**That is the exact failure mode ROOTS SA is most likely to repeat**, because our feed format
rewards the artefact over the teller.

---

## 3. What this means for the build

**Where we are genuinely differentiated**

1. **Nobody else puts all eight domains in one place.** Language apps do language. SAHO does
   written history. AODL does interviews. Nobody connects a game, a proverb, a recipe, a
   ceremony and a place on a map as one archive with cross-links.
2. **Nobody is consumer-native.** Every archive above is a website for people who already
   decided to care. The vertical feed, XP and a playable Morabaraba are a distribution strategy,
   not decoration.
3. **Playable heritage.** No competitor has a working Morabaraba engine. That is a genuine moat
   and a reason to share the app.
4. **Contribution is the product, not a form.** Ulwazi proved SA communities will contribute, but
   needed trained fieldworkers and library PCs. Everyone now has the recorder in their pocket.

**Where we are weakest**

1. **Audio authenticity.** Angula's native-speaker narration beats our synthesized speech
   outright, and we should never pretend otherwise. Our labelling is honest; the fix is real
   recordings.
2. **No cultural-protocol layer.** We have a single consent checkbox. Mukurtu has a whole
   permission model. A binary public/not-public switch is not adequate for initiation material,
   clan knowledge or anything a family wants shared only within the family.
3. **No attribution infrastructure.** Right now a contribution carries a free-text name. No
   verified identity, no way for a teller to withdraw consent later, no credit that follows the
   recording if it is re-shared.
4. **Cost of doing this properly is real.** UCT's Centre for Popular Memory benchmarks roughly
   **R5,000 to archive 24 hours** of interview material to archival standard, plus about
   **R4,000 per TB** of digital storage; fast-access derivative storage around **R220/GB**,
   master preservation around **R40/GB**. A feed of phone recordings is not an archive until
   somebody pays for transcription and preservation.

---

## 4. Does ROOTS SA need a login?

**Yes — and not for the usual reasons.** Engagement metrics are the worst argument for auth. The
real ones, all visible in the landscape above:

1. **Attribution.** The Ulwazi critique is that contributors became invisible. An anonymous
   upload cannot be credited to a person, and "Anonymous contributor, Limpopo" is precisely the
   erasure this project exists to reverse.
2. **Consent has to be revocable.** Our contribute form asks the uploader to confirm the speaker
   agreed. That promise is worthless if, a year later, the family cannot find the record or ask
   for it to come down. Revocation requires an account that owns the record.
3. **Cultural protocols need identity.** Mukurtu's entire model — who may see what, under which
   community's rules — is impossible without knowing who is asking. Any future "visible to my
   family only" or "visible to initiated members only" tier requires auth as a precondition.
4. **Moderation and abuse.** A public upload endpoint with no identity is a liability the moment
   it is real.

**What it must not become:** a wall in front of the archive. Reading must stay anonymous and
frictionless forever — that is the whole distribution thesis. Login should be required only at
the moment of *contributing*, and should be passwordless.

**Current state in this repo:** email magic-link sign-in via Supabase is implemented
(`signIn` / `signOut` / `account` in `src/lib/store.tsx`, UI in
`src/components/sections/DataControls.tsx`, status dot in the sidebar). Because no Supabase
credentials are configured, the app runs in **archive mode**: there is no account server, nothing
leaves the browser, and the UI says so plainly rather than showing a sign-in box that cannot work.
Reading has never required an account and should not start to.

**Not yet built, and the honest next step:** graduated cultural protocols in the Mukurtu sense —
per-item visibility (public / community / family / restricted), a withdraw-consent action for the
person recorded rather than only the uploader, and TK-style labels. The database schema in
`supabase/migrations/0001_init.sql` has row-level security but only a binary `is_published`.

---

## 5. Sources

- Angula — https://angula.app/ and the App Store listing (616 ratings, 4.7★)
- Kabod Group, "8 Mobile Apps for Learning African Languages" (Jul 2025)
- TechCartel, "Best Language Learning Apps for African Languages" (2026)
- Sunday Times, "Want to learn isiZulu? Now's your chance to do so free" (Sep 2022) — Duolingo × Nal'ibali × Vodacom
- Ambani Africa — https://www.ambaniafrica.com/ ; Mzanzi Kids — https://www.mzanzikids.co.za/
- AODL — https://aodl.org/ ; MSU MATRIX African Oral Narratives
- "History Uploaded: Digital Archives After Thirty Years of Democracy", *South African Historical Journal* (2024) — SAHO, DISA, Ulwazi, FHYA/EMANDULO
- UCT Archive and Public Culture, "Oral histories and archiving memories in South Africa" — CPM costs
- Niall McNulty, "The Ulwazi Programme: Local Users, Local Language, Local Content" (IAMCR 2012)
- SIT Digital Collections field study of the Ulwazi Programme — the authorship critique
- Mukurtu CMS — https://mukurtu.org/ ; Humanities for All project profile; Kanopi Studios; UCLA California Native Hub
