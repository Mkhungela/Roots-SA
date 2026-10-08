import type { Poem } from "@/lib/types";

/**
 * Traditional izibongo are part of a centuries-old oral tradition and are quoted here in
 * short, widely published excerpts. Work by living and recently published poets is
 * described and credited rather than reproduced.
 */
export const POEMS: Poem[] = [
  {
    slug: "what-is-izibongo",
    title: "What izibongo actually is",
    kind: "traditional",
    poet: "The imbongi tradition",
    poetRole: "Nguni praise poetry",
    language: "isiZulu / isiXhosa",
    about:
      "Izibongo (isiZulu) or iimbongi poetry (isiXhosa) is praise poetry — but 'praise' is a bad translation. The imbongi is a court poet with licence to criticise. Performed at speed, from memory, with a stick and a leopard-skin cloak, izibongo is simultaneously a genealogy, a history, a news bulletin and the only speech in the room that can tell a king he is wrong.",
    notes: [
      "A person's izibongo is built from their deeds. You do not write your own — others compose it about you, line by line, over a lifetime.",
      "Names in izibongo are compressed metaphors. A single phrase can encode an entire battle, a feud or a famine.",
      "The imbongi traditionally had immunity. Criticism delivered in praise poetry was permitted where ordinary speech would not be — which is why it survived as a political form.",
      "It is performed, not read. Delivery is rapid, loud, breath-driven, and the crowd responds. On the page it is only half the thing.",
      "The tradition is alive: iimbongi still perform at state occasions, funerals, weddings and in maskandi music.",
    ],
    tags: ["izibongo", "oral tradition", "performance"],
    audio: ["/audio/izibongo-explainer.mp3"],
  },
  {
    slug: "izibongo-zikashaka",
    title: "Izibongo zikaShaka",
    kind: "izibongo",
    poet: "Traditional, attributed to Shaka's iimbongi",
    poetRole: "Praise poem of Shaka kaSenzangakhona",
    language: "isiZulu",
    about:
      "The praise poem of Shaka kaSenzangakhona is the most widely published izibongo in South Africa, recorded from oral performance by collectors including James Stuart in the early twentieth century and later translated by Trevor Cope and others. These are the opening lines — in performance the full poem runs for many minutes.",
    lines: [
      { text: "UDlungwane kaNdaba!", translation: "He who rages, son of Ndaba!" },
      { text: "UDlungwane woMbelebele,", translation: "The rager of the Mbelebele regiment," },
      { text: "Odlung' emanxulumeni,", translation: "Who raged among the great kraals," },
      { text: "Kwaze kwas' amanxulum' esibikelana.", translation: "So that until dawn the kraals called out to one another." },
      { text: "UNodumehlezi kaMenzi,", translation: "He who is famous without effort, son of Menzi," },
      { text: "USishaka kasishayeki,", translation: "The unbeatable one, who cannot be struck," },
      { text: "Inkos' yasemaShobeni.", translation: "The king of the Shobeni people." },
    ],
    notes: [
      "'UNodumehlezi' is usually glossed as 'the one who is famous while simply sitting' — fame that arrives without having to be chased.",
      "'USishaka kasishayeki' is a pun on Shaka's own name: the one who strikes and cannot be struck.",
      "Listen for the repetition and the escalating line length. That is the engine of the performance.",
    ],
    tags: ["izibongo", "isiZulu", "Shaka", "classic"],
    seeded: false,
  },
  {
    slug: "dithoko-tsa-marena",
    title: "Dithoko tsa marena — Sotho praise poems",
    kind: "traditional",
    poet: "Sotho oral tradition",
    poetRole: "Praise poetry of chiefs and of ordinary people",
    language: "Sesotho",
    about:
      "The Sotho praise tradition, dithoko, covers both royal praises (dithoko tsa marena) and the personal praises that an ordinary man composed for himself — including the lifela, the travelling songs composed by Basotho migrant workers on their way to and from the mines. Lifela is one of the few oral poetry traditions in the world created specifically by migrant labourers about migrant labour.",
    notes: [
      "Lifela tsa litsamaea-naha le liparola-thota — 'songs of the travellers and crossers of the plains' — were composed and performed by Basotho men walking to the Witwatersrand mines.",
      "The poems are self-praises: the traveller names himself, boasts, complains about the mine, the pass laws, the cold and the recruiters.",
      "Because they were composed on foot over long distances, the rhythm follows walking pace.",
      "Thomas Mofolo's 1925 Sesotho novel Chaka drew on the same praise-poetry register and became one of the most translated African novels of the century.",
    ],
    tags: ["dithoko", "lifela", "Sesotho", "migrant labour"],
  },
  {
    slug: "spoken-word-now",
    title: "Spoken word now: the line from imbongi to the mic",
    kind: "spoken",
    poet: "Contemporary South African poets",
    poetRole: "Stage and page",
    language: "Multilingual",
    about:
      "South African spoken word did not arrive from America. It walked directly out of the izibongo tradition, through the Black Consciousness poetry of the 1970s, into the open mics of the 1990s and the stages and timelines of today. The through-line is the same: performance, political licence, and a poet who speaks on behalf of a room.",
    notes: [
      "Mzwakhe Mbuli — 'the People's Poet' — performed at mass funerals and rallies in the 1980s when political speech was banned, and read at Nelson Mandela's 1994 inauguration. His delivery is straight imbongi cadence over a band.",
      "Keorapetse Kgositsile, a founder of the Black Consciousness poetry movement and a major influence on American jazz poetry, became South Africa's National Poet Laureate.",
      "Mongane Wally Serote and Don Mattera wrote the township into South African poetry during the hardest years of censorship.",
      "Ingrid Jonker's Afrikaans poem 'Die Kind', written after the Sharpeville era, was read by Nelson Mandela when he opened the first democratic Parliament on 24 May 1994.",
      "Lebo Mashile brought poetry to national television with L'Atitude; Koleka Putuma's Collective Amnesia became one of the best-selling South African poetry books of recent years.",
      "Find them in a library, a bookshop or at a live open mic. We link to poets rather than reprinting work that is still in copyright.",
    ],
    tags: ["spoken word", "contemporary", "performance"],
  },
  {
    slug: "izaga-nezisho",
    title: "Izaga nezisho — proverbs as compressed poems",
    kind: "traditional",
    poet: "Everyday speech",
    poetRole: "The poetry people actually use",
    language: "All South African languages",
    about:
      "The densest poetry in South Africa is not on a stage. It is in the proverbs (izaga) and idioms (izisho) that elders drop into ordinary conversation to end an argument. Each one is a complete image carrying a complete argument — the shortest possible poem that still wins.",
    lines: [
      { text: "Umuntu ngumuntu ngabantu", translation: "isiZulu — A person is a person through other people." },
      { text: "Intaka yakha ngoboya benye", translation: "isiXhosa — A bird builds its nest with another bird's feathers." },
      { text: "Tau tša hloka seboka di šitwa ke nare e hlotša", translation: "Sepedi — Lions without teamwork are defeated by a limping buffalo." },
      { text: "Kgetsi ya tsie e kgonwa ke go tshwaraganelwa", translation: "Setswana — A bag of locusts is only carried if carried together." },
      { text: "Mphe-mphe e a lapisa", translation: "Sesotho — Constant borrowing makes you hungry." },
      { text: "N'wana wa mfenhe a nga tsandzeki hi rhavi", translation: "Xitsonga — A baboon's child does not fail to grasp a branch." },
      { text: "'n Boer maak 'n plan", translation: "Afrikaans — A farmer makes a plan." },
    ],
    notes: [
      "Notice how many are about collective effort. That is not a coincidence — it is the central argument of southern African moral philosophy.",
      "Proverbs are deployed strategically. An elder using one is usually closing a discussion, not opening it.",
    ],
    tags: ["proverbs", "izaga", "language"],
  },
  {
    slug: "iziphicaphicwano",
    title: "Riddles and rhymes for children",
    kind: "traditional",
    poet: "Children and grandmothers",
    poetRole: "iziphicaphicwano / dinyewe",
    language: "isiZulu, isiXhosa, Sesotho and more",
    about:
      "Before bed, and around the fire, children were set riddles — iziphicaphicwano in isiZulu, dinyewe in Sesotho. The form is fixed: the asker says 'I have a riddle', the children answer 'bring it', and then the image is given. They are small poems designed to teach observation.",
    lines: [
      { text: "A house with no door.", translation: "An egg." },
      { text: "It goes to the river every day and never drinks.", translation: "A path." },
      { text: "My father's cattle are white and they all lie in one kraal.", translation: "Teeth." },
      { text: "It follows you everywhere but dies in the dark.", translation: "Your shadow." },
      { text: "A long road with no dust.", translation: "A river." },
    ],
    notes: [
      "The ritual opening matters: in isiZulu the asker says 'Ngiyakuphicela' and the children reply before the riddle is given.",
      "Riddles were told at night, never during the day — in several traditions daytime riddling was said to bring bad luck.",
      "Collect these from your own grandmother. Regional riddles vary enormously and very few have been written down.",
    ],
    tags: ["riddles", "children", "oral tradition"],
  },
  {
    slug: "praise-your-gogo",
    title: "Challenge: praise your gogo",
    kind: "challenge",
    poet: "ROOTS SA community",
    poetRole: "Open challenge",
    language: "Any South African language",
    about:
      "Izibongo were composed for kings. Compose one for the person who actually raised you.",
    prompt:
      "Write and perform six to twelve lines of izibongo for your grandmother, grandfather or whoever raised you. Build it from their deeds, not from adjectives. Name a place. Name a thing they carried. Name something they survived. Perform it out loud and record it — izibongo is not izibongo until it is spoken.",
    notes: [
      "Start with a naming line: who they are, whose child they are.",
      "Use at least one metaphor drawn from an animal, the weather or the land.",
      "Repeat one phrase at least twice. Repetition is the engine.",
      "Say it faster than feels comfortable. That is the register.",
    ],
    entries: 0,
    closes: "Open",
    tags: ["challenge", "izibongo", "community"],
  },
  {
    slug: "praise-your-street",
    title: "Challenge: praise your street",
    kind: "challenge",
    poet: "ROOTS SA community",
    poetRole: "Open challenge",
    language: "Any South African language",
    about:
      "The imbongi praised a place as readily as a person. Do the same for the road you grew up on.",
    prompt:
      "Eight lines about your street, your block or your village. The rule: no generic praise. Every line must contain something only somebody who lives there would know — a shop, a pothole, a dog, a sound at a specific time of day, the name people actually use for the corner.",
    notes: [
      "Specificity is the whole technique. 'My street is beautiful' is not a line. 'The corner where the Nissan has been parked since 2009' is a line.",
      "Try it in the language the street is actually spoken in — including the mix.",
    ],
    entries: 0,
    closes: "Open",
    tags: ["challenge", "place", "community"],
  },
];

export const POEM_BY_SLUG = Object.fromEntries(POEMS.map((p) => [p.slug, p]));

export const POEM_KINDS: { id: Poem["kind"]; label: string }[] = [
  { id: "izibongo", label: "Izibongo" },
  { id: "traditional", label: "Traditional" },
  { id: "spoken", label: "Spoken word" },
  { id: "user", label: "Performances" },
  { id: "challenge", label: "Challenges" },
];
