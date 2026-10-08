import type { HeritagePlace } from "@/lib/types";

/**
 * Heritage sites plotted at true WGS84 coordinates. Community voices are illustrative
 * seed entries and are labelled as such in the UI; the historical content is real.
 */
export const PLACES: HeritagePlace[] = [
  {
    slug: "mapungubwe",
    name: "Mapungubwe",
    alsoKnown: "Place of the jackals",
    province: "LP",
    lat: -22.193,
    lng: 29.389,
    era: "c. 1075 – 1290",
    kind: "ancient",
    whatHappened:
      "A sophisticated African kingdom with long-distance trade links to China, India and Persia — flourishing on this hill five hundred years before Europeans reached this part of the interior.",
    detail: [
      "Mapungubwe sat at the confluence of the Limpopo and Shashe rivers and controlled trade in gold and ivory out to the Indian Ocean coast. Chinese celadon, Persian glass and glass beads from across the ocean have been excavated here.",
      "It is widely regarded as the first state in southern Africa with clear social stratification, with the elite living on top of the hill and the general population below — a physical expression of class that archaeologists can read directly from the site.",
      "The golden rhinoceros of Mapungubwe — a small wooden core covered in gold foil, excavated in 1933 — has become one of South Africa's most recognisable objects and a national symbol.",
      "Under apartheid the site was deliberately downplayed, because an advanced precolonial African state contradicted the official story being taught in schools. Full public recognition came only after 1994.",
      "It was inscribed as a UNESCO World Heritage Site in 2003, and the Order of Mapungubwe is now South Africa's highest honour.",
    ],
    people: [
      { name: "The golden rhinoceros", note: "Excavated 1933; now a national symbol and part of the Order of Mapungubwe" },
      { name: "Leo Fouché and the 1930s excavations", note: "University of Pretoria team that first documented the site" },
    ],
    nameMeaning: "Often translated as 'place of the jackals' or 'hill of jackals'.",
    status: "UNESCO World Heritage Site (2003)",
    communityVoices: [
      { who: "Student, Musina", text: "We were taught about European castles before we were taught that this was here, four hours from my school." },
    ],
  },
  {
    slug: "robben-island",
    name: "Robben Island",
    province: "WC",
    lat: -33.8067,
    lng: 18.3669,
    era: "1600s – 1996",
    kind: "liberation",
    whatHappened:
      "A political prison where Nelson Mandela spent 18 of his 27 years in jail — and, long before that, a place of banishment, a leper colony and a military base.",
    detail: [
      "The island was used as a place of banishment from the seventeenth century, including for Khoi leaders and for political prisoners from the Dutch East Indies — among them Sheikh Yusuf's contemporaries and other exiled Muslim leaders who shaped Islam at the Cape.",
      "In the nineteenth century it was used as a leper colony and an asylum.",
      "From 1961 it became the maximum security prison for Black male political prisoners. Nelson Mandela, Walter Sisulu, Govan Mbeki, Ahmed Kathrada, Robert Sobukwe and Jacob Zuma were all held here.",
      "Prisoners ran what became known as 'the University of Robben Island' — teaching each other politics, history, law and languages in the lime quarry and the cells.",
      "The glare off the white lime in the quarry permanently damaged Mandela's eyesight. He later asked photographers not to use flash.",
      "The prison closed in 1991 for political prisoners and in 1996 entirely. It became a museum in 1997 and a UNESCO World Heritage Site in 1999. Many of the guides are former prisoners.",
    ],
    people: [
      { name: "Nelson Mandela", note: "Held here 1964–1982, in cell number 5, B Section" },
      { name: "Robert Sobukwe", note: "Held in isolation under a clause written specifically for him" },
      { name: "Walter Sisulu and Ahmed Kathrada", note: "Rivonia trialists imprisoned alongside Mandela" },
    ],
    status: "UNESCO World Heritage Site (1999); museum",
    communityVoices: [
      { who: "Former political prisoner, guide", text: "People expect me to be bitter. I bring them here so that they can see what it cost, and then I let them decide what to do with that." },
    ],
  },
  {
    slug: "hector-pieterson",
    name: "Hector Pieterson Memorial",
    province: "GP",
    lat: -26.237,
    lng: 27.9065,
    era: "16 June 1976",
    kind: "liberation",
    whatHappened:
      "Police opened fire on schoolchildren marching against being taught in Afrikaans. Hector Pieterson, 12, was among the first killed. The photograph went around the world.",
    detail: [
      "On 16 June 1976 thousands of Soweto students marched in protest against a decree that Afrikaans be used as a medium of instruction alongside English in Black schools.",
      "Police opened fire. Hector Pieterson was shot and carried by Mbuyisa Makhubo, with Hector's sister Antoinette Sithole running alongside. Sam Nzima's photograph of that moment was published around the world and became one of the defining images of apartheid.",
      "The uprising spread nationally and continued for months. Official figures put the death toll at several hundred; other estimates are considerably higher.",
      "Mbuyisa Makhubo, the young man in the photograph, was harassed by security police and left the country. His family searched for him for decades.",
      "16 June is now Youth Day, a public holiday. The memorial and museum stand two blocks from where Hector was shot.",
    ],
    people: [
      { name: "Hector Pieterson", note: "12 years old; among the first killed on 16 June 1976" },
      { name: "Sam Nzima", note: "Took the photograph that made the massacre undeniable" },
      { name: "Antoinette Sithole", note: "Hector's sister, running beside him in the photograph" },
      { name: "Mbuyisa Makhubo", note: "Carried Hector; forced into exile and never confirmed found" },
    ],
    status: "National heritage site; museum",
    communityVoices: [
      { who: "Soweto resident", text: "Every June the TV crews come. The rest of the year this street is just a street where people live. Both of those are true." },
    ],
  },
  {
    slug: "vilakazi-street",
    name: "Vilakazi Street, Orlando West",
    province: "GP",
    lat: -26.2375,
    lng: 27.908,
    era: "1930s – present",
    kind: "living",
    whatHappened:
      "The only street in the world to have housed two Nobel Peace Prize laureates — Nelson Mandela and Desmond Tutu.",
    detail: [
      "Mandela's house at 8115 Vilakazi Street was built in 1945 and is now a museum. He described it as the place where he felt he had a home, and he returned to it briefly after his release in 1990 before moving.",
      "Desmond Tutu's family home is on the same street, a few hundred metres away.",
      "The street is also where the 1976 march passed, and the Hector Pieterson Memorial is a short walk from it.",
      "Today it is one of Soweto's most visited places, lined with restaurants and vendors, and it carries the ordinary tension of a residential street that became a destination — tourism income on one side, residents' daily life on the other.",
    ],
    people: [
      { name: "Nelson Mandela", note: "8115 Vilakazi Street — now Mandela House museum" },
      { name: "Desmond Tutu", note: "Family home on the same street" },
      { name: "Winnie Madikizela-Mandela", note: "Lived at 8115 and held the house through years of harassment and banishment" },
    ],
    status: "Mandela House is a national heritage site",
    communityVoices: [
      { who: "Vendor, Vilakazi Street", text: "The tourists come for two houses. I tell them the whole street has houses, and every one of them has a story." },
    ],
  },
  {
    slug: "district-six",
    name: "District Six",
    province: "WC",
    lat: -33.929,
    lng: 18.427,
    era: "Declared white, 11 February 1966",
    kind: "removal",
    whatHappened:
      "A mixed, dense, working-class inner-city neighbourhood declared a white group area. Around 60,000 people were removed and the buildings were bulldozed.",
    detail: [
      "District Six was home to a cosmopolitan community — descendants of enslaved people, Malay, Xhosa, Indian, Jewish, and immigrant families — within walking distance of Cape Town's centre and docks.",
      "It was declared a white group area on 11 February 1966 under the Group Areas Act. Demolitions ran through the 1970s and into the 1980s.",
      "Residents were moved out to the Cape Flats — Mitchells Plain, Hanover Park, Manenberg, Lavender Hill — far from work, with families and neighbours deliberately separated.",
      "Most of the cleared land was never developed. The churches and mosques were largely left standing, and for decades the site was open ground inside the city.",
      "The District Six Museum opened in 1994 in the old Methodist Mission church, holding street signs rescued at the time of demolition and a large floor map on which former residents mark their own houses.",
      "A land restitution process has been running since the 1990s. Some former residents have returned to new homes on the site; many died waiting.",
    ],
    people: [
      { name: "Richard Rive", note: "Writer whose novel Buckingham Palace, District Six documents the community" },
      { name: "The District Six Museum", note: "Founded 1994; built around the testimony of former residents" },
    ],
    nameMeaning: "Named simply as the sixth municipal district of Cape Town in 1867.",
    status: "Museum and ongoing land restitution",
    communityVoices: [
      { who: "Former resident", text: "I wrote my address onto the map on the museum floor. That is the only address I ever really had." },
    ],
  },
  {
    slug: "constitution-hill",
    name: "Constitution Hill",
    province: "GP",
    lat: -26.19,
    lng: 28.0417,
    era: "1892 – present",
    kind: "liberation",
    whatHappened:
      "South Africa's Constitutional Court was built inside the walls of the prison where Mandela, Gandhi and tens of thousands of ordinary people were held.",
    detail: [
      "The Old Fort prison complex held both political prisoners and people jailed under pass laws. Mahatma Gandhi was held here in 1906 and 1913; Nelson Mandela was held in 1962.",
      "Number Four was the section for Black male prisoners and was notorious for overcrowding, violence and degrading treatment. The Women's Jail held Winnie Madikizela-Mandela, Albertina Sisulu and Fatima Meer.",
      "Most people imprisoned here were not political activists. They were ordinary people arrested for pass offences — being in the wrong place without the right document.",
      "In 1996 the site was chosen for the new Constitutional Court. The court chamber was built partly from bricks taken from the demolished awaiting-trial block, so the building is literally made out of the prison.",
      "The court's chamber has windows at pavement level, so judges see the feet of people walking past — a deliberate design decision about who the court serves.",
    ],
    people: [
      { name: "Mahatma Gandhi", note: "Imprisoned here in 1906 and 1913" },
      { name: "Nelson Mandela", note: "Held in the Old Fort hospital section in 1962" },
      { name: "Winnie Madikizela-Mandela", note: "Held in the Women's Jail" },
      { name: "Albertina Sisulu and Fatima Meer", note: "Also imprisoned in the Women's Jail" },
    ],
    status: "National heritage site; seat of the Constitutional Court",
    communityVoices: [
      { who: "Law student, Johannesburg", text: "They built the court out of the prison bricks. You cannot walk in there and pretend the past is finished." },
    ],
  },
  {
    slug: "sterkfontein",
    name: "Sterkfontein and the Cradle of Humankind",
    province: "GP",
    lat: -26.0167,
    lng: 27.7333,
    era: "Millions of years",
    kind: "ancient",
    whatHappened:
      "One of the richest hominin fossil sites on earth. A very large share of what is known about early human ancestors was dug out of these caves.",
    detail: [
      "In 1947 Robert Broom and John Robinson found the skull of an adult Australopithecus africanus at Sterkfontein, nicknamed 'Mrs Ples'.",
      "In 1994 and the years following, the nearly complete Australopithecus skeleton nicknamed 'Little Foot' was identified and excavated over two decades by Ron Clarke and the team, including Stephen Motsumi and Nkwane Molefe, who located the matching bones in the cave by hand.",
      "Nearby at Rising Star cave, Homo naledi was announced in 2015 after an excavation that required very small-framed scientists to reach the chamber — the team recruited for the role became known as the 'underground astronauts'.",
      "The broader Cradle of Humankind area was declared a UNESCO World Heritage Site in 1999 and covers a group of fossil-bearing cave systems.",
      "Dating of the deposits has been repeatedly revised and is actively debated, which is part of why the site remains scientifically central rather than settled.",
    ],
    people: [
      { name: "Robert Broom", note: "Found 'Mrs Ples' in 1947" },
      { name: "Ron Clarke, Stephen Motsumi, Nkwane Molefe", note: "Identified and excavated 'Little Foot'" },
      { name: "Lee Berger and the Rising Star team", note: "Announced Homo naledi in 2015" },
    ],
    status: "UNESCO World Heritage Site (1999)",
    communityVoices: [
      { who: "Guide, Maropeng", text: "Visitors come looking for the origin of humans. I tell them: you are standing in your own family's address." },
    ],
  },
  {
    slug: "fundudzi",
    name: "Lake Fundudzi",
    province: "LP",
    lat: -22.85,
    lng: 30.2833,
    era: "Sacred site, ongoing",
    kind: "sacred",
    whatHappened:
      "A sacred lake held by the Netshiavha clan, where visitors greet the water upside down and access is controlled by custodians, not by a ticket office.",
    detail: [
      "Fundudzi lies below the Thathe Vondo forest in Venda. It was formed by a landslide that dammed the Mutale River, giving it an inflow with no obvious outflow — part of why it has long been regarded as extraordinary.",
      "It is one of very few sacred natural sites in South Africa where traditional protocol is still actively enforced. Permission to visit is obtained from the custodian clan.",
      "The greeting, ukodola, requires a visitor to turn their back to the lake, bend forward and view the water from between their legs — approaching as a subordinate rather than an equal.",
      "The lake is associated with the python and with the annual domba cycle. Detailed ritual knowledge is not shared publicly, and elders are explicit that anyone selling that detail to tourists is selling something that is not theirs.",
      "The surrounding Thathe Vondo forest contains a sacred grove that is likewise not open to casual visitors.",
    ],
    people: [
      { name: "The Netshiavha clan", note: "Custodians of the lake and its protocols" },
      { name: "The Vhatavhatsindi", note: "'People of the pool' — associated with the lake in Venda tradition" },
    ],
    nameMeaning: "Associated in local accounts with the sound or nature of the water.",
    status: "Sacred site under traditional custodianship",
    communityVoices: [
      { who: "Elder, Venda", text: "Ask the custodians. Do not arrive with a camera and a tour operator and expect the lake to perform." },
    ],
  },
  {
    slug: "mandela-capture-site",
    name: "Nelson Mandela Capture Site",
    province: "KZN",
    lat: -29.4692,
    lng: 30.2447,
    era: "5 August 1962",
    kind: "liberation",
    whatHappened:
      "Mandela was arrested here, disguised as a chauffeur, after 17 months underground. He would not be free again for 27 years.",
    detail: [
      "On 5 August 1962, police stopped a car on the R103 near Howick. Mandela, travelling as 'David Motsamayi', a chauffeur, was arrested along with Cecil Williams.",
      "He had spent seventeen months underground, earning the nickname 'the Black Pimpernel' in the press for repeatedly evading capture.",
      "He was convicted of leaving the country without a passport and inciting a strike, and was serving that sentence when the Rivonia Trial began. He was sentenced to life imprisonment in 1964.",
      "The site is marked by Marco Cianfanelli's 2012 sculpture: fifty steel columns which, from exactly one viewing point at thirty-five metres, resolve into Mandela's face. From anywhere else they are an abstract thicket of poles.",
      "The sculpture was unveiled on the fiftieth anniversary of the arrest.",
    ],
    people: [
      { name: "Nelson Mandela", note: "Arrested here on 5 August 1962" },
      { name: "Cecil Williams", note: "Theatre director and activist, driving with Mandela" },
      { name: "Marco Cianfanelli", note: "Sculptor of the 50-column memorial, unveiled 2012" },
    ],
    status: "Museum and monument",
    communityVoices: [
      { who: "Visitor, Howick", text: "You walk until the poles suddenly become a face, and then you cannot unsee it. That is the whole point of the thing." },
    ],
  },
  {
    slug: "isandlwana",
    name: "Isandlwana",
    province: "KZN",
    lat: -28.3581,
    lng: 30.6519,
    era: "22 January 1879",
    kind: "conflict",
    whatHappened:
      "A Zulu army destroyed a British invading force in the heaviest defeat the British Army suffered against an African state.",
    detail: [
      "On 22 January 1879 a Zulu army of around 20,000 attacked the British encampment at the foot of the Isandlwana hill, overwhelming a force of roughly 1,800 British and colonial troops.",
      "The Zulu used the classic 'horns of the buffalo' formation — a central body with two flanking horns to encircle — a tactic associated with Shaka's military reforms.",
      "British losses were catastrophic and the defeat shocked Victorian Britain. The battle at Rorke's Drift later the same day received far more attention in British accounts, with eleven Victoria Crosses awarded, which had the effect of overshadowing the defeat.",
      "A partial solar eclipse occurred during the battle in the early afternoon and features in accounts from both sides.",
      "The battlefield today is marked with white cairns where British dead were buried, and with a memorial to the Zulu dead — an iziqu necklace in bronze, added much later.",
    ],
    people: [
      { name: "King Cetshwayo kaMpande", note: "Zulu king during the Anglo-Zulu War" },
      { name: "Ntshingwayo kaMahole", note: "Commanded the Zulu army at Isandlwana" },
      { name: "Lord Chelmsford", note: "British commander, absent from the camp when it was attacked" },
    ],
    nameMeaning: "The distinctive hill gives the battlefield its name.",
    status: "National heritage site",
    communityVoices: [
      { who: "Local guide", text: "For a hundred years the story was told as a British tragedy. We are still correcting whose battlefield this is." },
    ],
  },
  {
    slug: "qunu",
    name: "Qunu",
    province: "EC",
    lat: -31.7667,
    lng: 28.6333,
    era: "1920s – 2013",
    kind: "living",
    whatHappened:
      "The village where Nelson Mandela grew up, where he chose to build his home after prison, and where he is buried.",
    detail: [
      "Mandela moved to Qunu as a small child and described it in Long Walk to Freedom as the place where he was happiest — herding cattle, playing stick fighting, and sliding down a flat rock the children used as a slide.",
      "After his release he built a house in Qunu based on the layout of the warder's house at Victor Verster prison, because it was the floor plan he had become used to.",
      "He was buried in Qunu on 15 December 2013, on the family land, after a state funeral.",
      "The Nelson Mandela Museum has a site at Qunu as well as at Mthatha, and the surrounding area remains a working rural community rather than a preserved monument.",
    ],
    people: [
      { name: "Nelson Mandela", note: "Grew up here; buried here in 2013" },
      { name: "Nosekeni Fanny", note: "His mother, who raised him in Qunu" },
    ],
    nameMeaning: "A Thembu village name in the Mthatha district.",
    status: "Museum site and living village",
    communityVoices: [
      { who: "Qunu resident", text: "He is buried on that hill. We still have to drive to Mthatha for most things. Both of those facts belong in your archive." },
    ],
  },
  {
    slug: "bo-kaap",
    name: "Bo-Kaap",
    province: "WC",
    lat: -33.92,
    lng: 18.414,
    era: "1760s – present",
    kind: "living",
    whatHappened:
      "The historic Cape Malay quarter — the oldest mosque in the country, and houses painted in colours that have become a global image of Cape Town.",
    detail: [
      "Bo-Kaap developed from the 1760s as an area of rental housing, and became home to freed and enslaved people from Southeast Asia, India, Madagascar and East Africa, and their descendants.",
      "The Auwal Mosque, established in 1794, is the oldest mosque in South Africa. It is closely linked to Tuan Guru, a prince from Tidore exiled to Robben Island, who wrote out the Qur'an from memory while imprisoned.",
      "Some of the earliest surviving written Afrikaans was produced here in Arabic script, in religious teaching texts used in Cape Muslim madrasas in the 1800s.",
      "The bright paint is relatively recent. The commonly told account is that houses were required to be white while rented, and were painted in strong colours by owners after they were able to buy them.",
      "Bo-Kaap was declared under the Group Areas Act but, unlike District Six, much of the community resisted removal and stayed. It now faces a different pressure: gentrification and rapidly rising property prices. Parts of the area were granted heritage protection in 2019 after sustained community campaigning.",
    ],
    people: [
      { name: "Tuan Guru", note: "Exiled prince of Tidore; wrote out the Qur'an from memory on Robben Island" },
      { name: "The Auwal Mosque", note: "Established 1794 — the oldest in South Africa" },
    ],
    nameMeaning: "Afrikaans for 'above the Cape' — the slopes above the city centre.",
    status: "Heritage protection granted to parts of the area in 2019",
    communityVoices: [
      { who: "Bo-Kaap resident", text: "They photograph the houses. They do not photograph the families who are being priced out of them." },
    ],
  },
  {
    slug: "kliptown",
    name: "Walter Sisulu Square, Kliptown",
    province: "GP",
    lat: -26.2756,
    lng: 27.8878,
    era: "25–26 June 1955",
    kind: "liberation",
    whatHappened:
      "About 3,000 delegates adopted the Freedom Charter here, declaring that South Africa belongs to all who live in it. Police broke up the meeting on the second day.",
    detail: [
      "The Congress of the People met on open ground at Kliptown on 25 and 26 June 1955, drawing delegates from across the country in defiance of heavy policing.",
      "The Freedom Charter was adopted clause by clause, read aloud in English, isiXhosa and Sesotho. Its opening line — 'South Africa belongs to all who live in it, black and white' — became the founding statement of the non-racial position in South African politics.",
      "Police surrounded and broke up the gathering on the second day, recording names and seizing documents. The Charter was later used as evidence in the 1956 Treason Trial, in which 156 people were charged.",
      "Much of the Charter's language flows directly into the 1996 Constitution.",
      "Walter Sisulu Square was built on the site and opened in 2005, fifty years on. Kliptown itself remains one of the poorest parts of Soweto, with large informal settlements and limited services — a contrast residents point out constantly.",
    ],
    people: [
      { name: "Walter Sisulu", note: "The square is named for him" },
      { name: "Lilian Ngoyi and Helen Joseph", note: "Among the women leaders central to the Congress Alliance" },
      { name: "The 156 Treason Trial accused", note: "Charged in 1956; all were eventually acquitted" },
    ],
    status: "National heritage site",
    communityVoices: [
      { who: "Kliptown resident", text: "The Charter was signed on this ground. Walk two hundred metres that way and tell me what you see." },
    ],
  },
  {
    slug: "ncome-blood-river",
    name: "Ncome / Blood River",
    province: "KZN",
    lat: -28.1053,
    lng: 30.5422,
    era: "16 December 1838",
    kind: "conflict",
    whatHappened:
      "A battle between Voortrekkers and the Zulu army that was turned into a founding myth of Afrikaner nationalism — and now has two museums facing each other across the river.",
    detail: [
      "On 16 December 1838 a Voortrekker laager of roughly 470 men repelled a Zulu attack. Voortrekker casualties were minimal; Zulu losses were very heavy.",
      "The Voortrekkers had taken a vow before the battle, pledging to commemorate the day if they won. This became the Day of the Vow, a sacred date in Afrikaner nationalist tradition, and it was central to the ideology of apartheid.",
      "After 1994 the date was retained as a public holiday but renamed the Day of Reconciliation, deliberately keeping the day while changing its meaning.",
      "The Ncome Museum was opened in 1998 on the Zulu side of the river, facing the existing Blood River monument on the other bank. For years the two sites operated separately, with no crossing.",
      "A pedestrian bridge linking the two museums was later built, so that visitors can now cross between the two accounts of the same day. It is one of the most literal pieces of heritage design in the country.",
    ],
    people: [
      { name: "King Dingane kaSenzangakhona", note: "Zulu king at the time of the battle" },
      { name: "Andries Pretorius", note: "Commanded the Voortrekker laager" },
    ],
    nameMeaning: "Ncome is the Zulu name of the river; 'Blood River' comes from the colour of the water after the battle.",
    status: "Two national museums, linked by a bridge",
    communityVoices: [
      { who: "Museum guide, Ncome", text: "Two museums, one river. You are meant to walk across. Most people only visit the side they already agree with." },
    ],
  },
  {
    slug: "drakensberg-rock-art",
    name: "uKhahlamba-Drakensberg rock art",
    province: "KZN",
    lat: -29.3833,
    lng: 29.65,
    era: "Up to around 3,000 years of painting",
    kind: "ancient",
    whatHappened:
      "The largest concentration of rock art in sub-Saharan Africa — tens of thousands of San paintings in shelters across the escarpment.",
    detail: [
      "The uKhahlamba-Drakensberg Park holds many thousands of individual San rock paintings across hundreds of sites, and is considered the densest and most varied body of rock art in the region.",
      "Interpretation shifted fundamentally in the twentieth century. Rather than being read as simple hunting scenes, much of the art is now understood by researchers as connected to trance and healing practice, with the eland as a central spiritual animal.",
      "A major source for this interpretation is the Bleek and Lloyd archive — thousands of pages of /Xam San testimony recorded in the 1870s in Cape Town from San prisoners, which preserved language, stories and beliefs that were otherwise destroyed.",
      "Game Pass Shelter at Kamberg contains the well-known 'Rosetta panel', which was central to developing that interpretation.",
      "The paintings are fragile. Touching, wetting or tracing them destroys them, and many sites are accessible only with a guide for that reason.",
      "It was inscribed as a UNESCO World Heritage Site in 2000, and extended as the Maloti-Drakensberg Park across the border with Lesotho in 2013.",
    ],
    people: [
      { name: "The San", note: "Painters of the art, over thousands of years" },
      { name: "Wilhelm Bleek and Lucy Lloyd", note: "Recorded the /Xam testimony that made interpretation possible" },
      { name: "//Kabbo and /Han≠kass'o", note: "Among the /Xam narrators whose accounts form the archive" },
    ],
    status: "UNESCO World Heritage Site (2000), extended 2013",
    communityVoices: [
      { who: "Guide, Kamberg", text: "People reach out to touch it. One touch and the oil from a hand starts work that will finish the painting off." },
    ],
  },
  {
    slug: "khomani-san",
    name: "ǂKhomani San Cultural Landscape",
    province: "NC",
    lat: -26.95,
    lng: 20.6333,
    era: "Deep past to the present",
    kind: "living",
    whatHappened:
      "A Kalahari landscape returned to the ǂKhomani San after a land claim — and where an almost-extinct language was found still being spoken.",
    detail: [
      "The ǂKhomani San were removed from the Kalahari Gemsbok Park area in the twentieth century and dispersed, and were widely assumed to have been culturally dissolved.",
      "A land claim lodged in the 1990s was settled in 1999, restoring land and park rights. It is one of the most significant restitution outcomes in the country.",
      "During the claim process, researchers established that N|uu — a language from the Tuu family thought to be extinct — was still spoken by a small number of elderly people, including Elsie Vaalbooi and later Katrina Esau.",
      "Katrina Esau, known as Ouma Katrina, ran a school from her home in Upington teaching N|uu to children, and was awarded the Order of the Baobab for the work.",
      "The ǂKhomani Cultural Landscape was inscribed as a UNESCO World Heritage Site in 2017, recognising both the ecological knowledge and the living cultural practice of the community.",
    ],
    people: [
      { name: "Katrina Esau (Ouma Katrina)", note: "One of the last fluent N|uu speakers; taught the language to children" },
      { name: "Elsie Vaalbooi", note: "Whose fluency helped establish that N|uu had survived" },
      { name: "Dawid Kruiper", note: "Traditional leader central to the land claim" },
    ],
    status: "UNESCO World Heritage Site (2017)",
    communityVoices: [
      { who: "Andriesvale resident", text: "They told the world we were finished. We were here the whole time, and we were still speaking." },
    ],
  },
  {
    slug: "modjadji",
    name: "Modjadji — the Rain Queen",
    province: "LP",
    lat: -23.6167,
    lng: 30.35,
    era: "c. 1800 – present",
    kind: "living",
    whatHappened:
      "A hereditary line of queens of the Balobedu, holding rainmaking authority — one of very few female hereditary rulers on the continent.",
    detail: [
      "The Modjadji is the hereditary queen of the Balobedu people in Limpopo, and the office is held by women in a matrilineal succession — unusual in the region and a subject of lasting fascination.",
      "The queen's standing is tied to rainmaking. Her authority historically extended well beyond her own territory, with neighbouring leaders, including Zulu kings, seeking her favour.",
      "Modjadji VI, Makobo Modjadji, died in 2005, and the succession has been contested and unresolved for long periods since.",
      "The area contains the Modjadji Cycad Reserve, a large protected stand of the Modjadji cycad, Encephalartos transvenosus, which is associated with the royal line and has been protected by it.",
      "Rider Haggard's novel She is widely said to have been influenced by accounts of the Rain Queen — an example of how an African institution entered European fiction in distorted form.",
    ],
    people: [
      { name: "Modjadji VI, Makobo Modjadji", note: "Reigned 2003–2005" },
      { name: "The Balobedu", note: "The people over whom the Modjadji presides" },
    ],
    status: "Living traditional authority; cycad reserve protected",
    communityVoices: [
      { who: "Balobedu resident", text: "People come asking about rain. The real story is that a woman has held this office for two hundred years." },
    ],
  },
  {
    slug: "sarah-baartman-grave",
    name: "Sarah Baartman's grave, Hankey",
    province: "EC",
    lat: -33.8333,
    lng: 24.8833,
    era: "Buried 9 August 2002",
    kind: "removal",
    whatHappened:
      "A Khoi woman displayed as a spectacle in Europe and dissected after her death. Her remains were returned to South Africa in 2002 and buried here.",
    detail: [
      "Sarah Baartman was taken from the Eastern Cape to Europe in 1810 and exhibited in London and Paris as a spectacle, under the name given to her by her exhibitors.",
      "She died in Paris in 1815. Georges Cuvier dissected her body, and her remains and a cast were displayed at the Musée de l'Homme in Paris into the twentieth century.",
      "Campaigns for the return of her remains ran for years. Following a request from the South African government, French legislation was passed and her remains were repatriated in 2002.",
      "She was buried at Hankey in the Gamtoos Valley on 9 August 2002 — Women's Day. The grave was later fenced after vandalism.",
      "Her name is now attached to institutions across the country, and she has become a central reference point in South African discussion of race, gender, scientific racism and bodily dignity.",
    ],
    people: [
      { name: "Sarah Baartman", note: "Khoi woman exhibited in Europe from 1810; died 1815" },
      { name: "Diana Ferrus", note: "Poet whose 1998 poem for Baartman is credited with helping drive the repatriation campaign" },
    ],
    status: "National heritage site",
    communityVoices: [
      { who: "Hankey resident", text: "It took one hundred and eighty-seven years to bring her home. We should say that number out loud every time." },
    ],
  },
  {
    slug: "thulamela",
    name: "Thulamela",
    province: "LP",
    lat: -22.4167,
    lng: 31.1667,
    era: "c. 1240 – 1700",
    kind: "ancient",
    whatHappened:
      "A stone-walled settlement inside the Kruger National Park, where gold burials were excavated and then reburied according to community protocol.",
    detail: [
      "Thulamela is a stone-walled hilltop site in the far north of the Kruger National Park, occupied between roughly the thirteenth and eighteenth centuries, and connected to the same Zimbabwe-culture building tradition as Great Zimbabwe and Mapungubwe.",
      "Excavations in the 1990s uncovered two burials, named Queen Losha and King Ingwe by the team, accompanied by gold objects and glass trade beads.",
      "What happened next is as significant as the find: the remains were reburied at the site in 1997 in a ceremony conducted with local communities and traditional leaders, following consultation about protocol.",
      "That decision marked a real shift in South African archaeological practice — from treating ancestral remains as specimens to treating them as people with living descendants.",
      "The stone walling is built without mortar, in the same dry-stone technique found across the wider region.",
    ],
    people: [
      { name: "'Queen Losha'", note: "Name given to one of the excavated burials, reburied in 1997" },
      { name: "Sidney Miller", note: "Archaeologist who led the excavation and reconstruction" },
    ],
    nameMeaning: "Often rendered as 'place of giving birth'.",
    status: "Heritage site inside Kruger National Park; guided access only",
    communityVoices: [
      { who: "Community representative", text: "They asked us first, and then they put her back. That is what should have happened everywhere." },
    ],
  },
  {
    slug: "sophiatown",
    name: "Sophiatown",
    province: "GP",
    lat: -26.1792,
    lng: 27.995,
    era: "Removals from 9 February 1955",
    kind: "removal",
    whatHappened:
      "One of the few places Black South Africans could own freehold land in Johannesburg. It was demolished and replaced with a white suburb named Triomf.",
    detail: [
      "Sophiatown was a dense, mixed, culturally extraordinary suburb where some Black residents held freehold title — a legal status the government found intolerable.",
      "It was the centre of a jazz and writing scene that produced Hugh Masekela, Miriam Makeba, Dolly Rathebe, Can Themba, Bloke Modisane and the Drum magazine generation.",
      "Father Trevor Huddleston, based at the Church of Christ the King, was a central figure in resisting the removals and is credited with giving Hugh Masekela his first trumpet.",
      "Removals began on 9 February 1955, earlier than expected, undercutting the resistance campaign whose slogan was 'Ons dak nie, ons phola hier' — we are not moving, we are staying here. Residents were moved to Meadowlands.",
      "The suburb built on the cleared land was named Triomf — 'triumph'. The name was officially changed back to Sophiatown in 2006.",
    ],
    people: [
      { name: "Trevor Huddleston", note: "Anti-apartheid priest based in Sophiatown" },
      { name: "Hugh Masekela and Miriam Makeba", note: "Both shaped by the Sophiatown music scene" },
      { name: "Can Themba and the Drum writers", note: "Documented the place as it was being destroyed" },
    ],
    nameMeaning: "Named after Sophia, the wife of the original landowner.",
    status: "Name restored 2006; Trevor Huddleston Memorial Centre on site",
    communityVoices: [
      { who: "Community historian", text: "A name coming back is not the same as a place coming back." },
    ],
  },
  {
    slug: "wonderwerk",
    name: "Wonderwerk Cave",
    province: "NC",
    lat: -27.845,
    lng: 23.555,
    era: "Up to around 2 million years of deposits",
    kind: "ancient",
    whatHappened:
      "A cave in the Northern Cape holding some of the earliest widely cited evidence for the controlled use of fire inside a shelter.",
    detail: [
      "Wonderwerk is a long horizontal cave with an exceptionally deep and continuous sequence of deposits, giving archaeologists an unusually complete record.",
      "Analysis published in 2012 reported burnt bone and ashed plant material deep inside the cave in layers around a million years old, which is among the earliest evidence cited for fire use in an enclosed habitation space.",
      "The cave also contains later San rock engravings and paintings, and was occupied across an enormous span of time.",
      "The name means 'miracle' in Afrikaans.",
      "Its significance is sometimes overshadowed by the Cradle of Humankind, but the depth of the sequence here makes it internationally important in its own right.",
    ],
    people: [
      { name: "Peter Beaumont", note: "Archaeologist associated with decades of excavation at the site" },
      { name: "The McGregor Museum", note: "Kimberley institution that has long managed research at the cave" },
    ],
    nameMeaning: "Afrikaans for 'miracle'.",
    status: "National heritage site",
    communityVoices: [
      { who: "Kuruman visitor", text: "A million years of people keeping warm in the same room. You go quiet in there." },
    ],
  },
  {
    slug: "freedom-park",
    name: "Freedom Park, Tshwane",
    province: "GP",
    lat: -25.7667,
    lng: 28.1833,
    era: "Opened 2007",
    kind: "liberation",
    whatHappened:
      "A memorial built to name the dead of every conflict that shaped South Africa — including people the country's older monuments deliberately left out.",
    detail: [
      "Freedom Park sits on Salvokop hill in Tshwane, across the valley from the Voortrekker Monument. The siting is deliberate and the relationship between the two is the subject of ongoing public conversation.",
      "Isivivane is a space of rest and symbolic burial, built around boulders brought from all nine provinces.",
      "S'khumbuto includes the Wall of Names, which lists the names of those who died in the conflicts that shaped the country — the pre-colonial wars, slavery, the South African War, the two World Wars and the liberation struggle.",
      "The Wall of Names was and remains contested, particularly over which names are included, and it continues to be added to as research and submissions come in.",
      "//hapo, the museum, takes its name from a Khoi saying about a dream that is dreamed collectively becoming reality.",
    ],
    people: [
      { name: "Mongane Wally Serote", note: "Poet who served as chief executive of Freedom Park" },
      { name: "The Wall of Names", note: "An open and still-growing record of the dead" },
    ],
    status: "National heritage site and museum",
    communityVoices: [
      { who: "Tshwane student", text: "You can see the Voortrekker Monument from here. They made sure of that." },
    ],
  },
];

export const PLACE_BY_SLUG = Object.fromEntries(PLACES.map((p) => [p.slug, p]));

export const PLACE_KINDS: { id: HeritagePlace["kind"]; label: string; color: string }[] = [
  { id: "liberation", label: "Liberation history", color: "#f5a623" },
  { id: "ancient", label: "Ancient & archaeological", color: "#2fc4d6" },
  { id: "sacred", label: "Sacred sites", color: "#45c07a" },
  { id: "removal", label: "Forced removals", color: "#e04524" },
  { id: "conflict", label: "Battlefields", color: "#ec3b80" },
  { id: "living", label: "Living heritage", color: "#6d7cf0" },
];
