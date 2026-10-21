export type VoiceLocale =
  | "en-us"
  | "en-gb"
  | "characters"
  | "fr-fr"
  | "de-de"
  | "es-es"
  | "es-mx"
  | "pt-br";

export interface Voice {
  id: string;
  name: string;
  locale: VoiceLocale;
  gender: "female" | "male" | null;
  description: string;
}

// From https://huggingface.co/gradium/phonon-voices/blob/main/voices.jsonl
export const VOICES: Array<Voice> = [
  {
    id: "NbpkqMVS3CJeq2j8",
    name: "Zoey",
    locale: "en-us",
    gender: "female",
    description:
      "Playful, upbeat and Gen Z energy voice with a standard American accent. Perfect for engaging conversations!",
  },
  {
    id: "NIWIOv5vTi5eRMj8",
    name: "Juniper",
    locale: "en-us",
    gender: "female",
    description:
      "Cheerful presence with real resonance under it, personable when the copy turns intimate and decisive on the final line.",
  },
  {
    id: "vjFyp2BcCyTlUmYb",
    name: "Everly",
    locale: "en-us",
    gender: "female",
    description:
      "Rounded, soft-edged tone with gentle lift at the end of phrases and an easy, relaxed delivery.",
  },
  {
    id: "4SZHfMpw-p46Ywgs",
    name: "Harper",
    locale: "en-us",
    gender: "female",
    description:
      "Modern, confident and friendly voice with a standard American accent.",
  },
  {
    id: "bXwrkHhURL1VFJdG",
    name: "Hadley",
    locale: "en-us",
    gender: "female",
    description:
      "Settled, even-toned and genuinely kind, with crisp consonants that hold up over a handset.",
  },
  {
    id: "nGzMHMPAWGaJFHOo",
    name: "Delia",
    locale: "en-us",
    gender: "female",
    description:
      "Low, grounded and quick to the point, with a sincerity that keeps an apology honest.",
  },
  {
    id: "LMDIYE0Oa377Qh6Z",
    name: "Easton",
    locale: "en-us",
    gender: "male",
    description:
      "Punchy and close in, with crisp consonant attack that cuts through a music bed and pitch that lifts across each line.",
  },
  {
    id: "40QrMVgAxFiUnP9f",
    name: "Micah",
    locale: "en-us",
    gender: "male",
    description:
      "Buoyant and high in energy, with a playful lift at the ends of phrases and clean attack that survives a loud mix.",
  },
  {
    id: "0zLApsZfVLLNaEGl",
    name: "Trevor",
    locale: "en-us",
    gender: "male",
    description:
      "Buoyant energy over a resonant mid-low core, phrases landing softly and consonants cutting through a handset.",
  },
  {
    id: "_6Aslh2DxfmnRLmP",
    name: "Russell",
    locale: "en-us",
    gender: "male",
    description:
      "A high-energy American adult voice that pushes and encourages with the intensity of someone who genuinely believes in you.",
  },
  {
    id: "qIxlZ7Ei8KvWlyQH",
    name: "Preston",
    locale: "en-us",
    gender: "male",
    description:
      "Trim, focused delivery with clean edges on every consonant and a steady, low-set core that carries through phone bandwidth.",
  },
  {
    id: "d9XCyhjo4JhkHF1d",
    name: "Miles",
    locale: "en-us",
    gender: "male",
    description:
      "Resonant and decisive, with genuine dynamic range, dropping right down for one clause then driving back up.",
  },
  {
    id: "6PWnV0Nq4wu7RVBT",
    name: "Maeve",
    locale: "en-gb",
    gender: "female",
    description:
      "A sparky, attentive British English adult voice that gets to the point with a smile. Ideal for fast, efficient customer support and helpful voice assistants.",
  },
  {
    id: "GgfEkEJtxZR7gnpy",
    name: "Freya",
    locale: "en-gb",
    gender: "female",
    description:
      "A young British voice, glossy and confident with fast, girly chatter and bubbly sparkle, perfect for a friendly receptionist or assistant.",
  },
  {
    id: "uem82D50GRv2Dwma",
    name: "Pippa",
    locale: "en-gb",
    gender: "female",
    description:
      "A confident, upbeat British English adult voice with infectious energy. Perfect for proactive assistants and motivating customer success calls.",
  },
  {
    id: "y9bQqIDnyxwqK01t",
    name: "Elodie-Rose",
    locale: "en-gb",
    gender: "female",
    description:
      "A young British voice with sharp, enthusiastic energy and crisp articulation, sparky and to the point for customer support and care.",
  },
  {
    id: "gDT1nz7Ie36ZhL-C",
    name: "Imogen",
    locale: "en-gb",
    gender: "female",
    description:
      "A bubbly, friendly British English adult voice that puts callers instantly at ease. Great for onboarding assistants and warm concierge interactions.",
  },
  {
    id: "m9MxpY6IUGXtWp76",
    name: "Lottie",
    locale: "en-gb",
    gender: "female",
    description:
      "Sparky and to the point, high forward energy with clean edges on the consonants and the range to drop low for one line then climb back.",
  },
  {
    id: "gfP44RlHwr2kEwk7",
    name: "Bryony",
    locale: "en-gb",
    gender: "female",
    description:
      "Full, rich mid-range tones, softly relaxed and spoken close to the mic, moving briskly with light pitch play.",
  },
  {
    id: "X6NceqF285Gr04gb",
    name: "Alfie",
    locale: "en-gb",
    gender: "male",
    description:
      "Punchy and forward, with crisp consonant attack and a pitch that lifts across a line, sitting high over a music bed.",
  },
  {
    id: "YyKcxPG7iIgS3jsK",
    name: "Hugh",
    locale: "en-gb",
    gender: "male",
    description:
      "Soft and close, airy in texture, with lively pitch movement and an attentive, sincere delivery.",
  },
  {
    id: "zUCxzrOrugTSis03",
    name: "Edwin",
    locale: "en-gb",
    gender: "male",
    description:
      "Efficient and firm, sincere in attention, with tidy articulation that holds up at phone bandwidth.",
  },
  {
    id: "JOW0vchyswkQUMDS",
    name: "Spencer",
    locale: "en-gb",
    gender: "male",
    description:
      "Light and airy, sitting a touch higher, with crisp consonants and a slow, patient delivery.",
  },
  {
    id: "dME3IWyZBvmh1n1q",
    name: "Toby",
    locale: "en-gb",
    gender: "male",
    description:
      "A sparky, attentive British English adult voice that gets to the point with a smile. Ideal for fast, efficient customer support and helpful voice assistants.",
  },
  {
    id: "Zn7g6NxLqXlJb7Qi",
    name: "Teddy",
    locale: "en-gb",
    gender: "male",
    description:
      "Sparky and close in, quick off the mark, with firm consonants and the range to drop right down for a clause then come back up.",
  },
  {
    id: "xPDpsV3F592srkjA",
    name: "Captain Silas Blackwater",
    locale: "characters",
    gender: null,
    description:
      "An old British pirate captain from the West Country, around sixty. Deep, gravelly and booming, rolling his Rs, salt-cracked from decades of shouting over gales. Roguish and hearty, with a wicked chuckle under every boast.",
  },
  {
    id: "nOykTmcH9ydsGGIc",
    name: "Morwenna of the Deep",
    locale: "characters",
    gender: null,
    description:
      "A sultry, seductive woman in her thirties. Low, husky alto, close to the microphone and almost whispered, slow and languid, purring, with a warm knowing smile in every word. Intimate, flirtatious and teasing, like a late-night torch singer luring someone closer, with a hint of danger underneath.",
  },
  {
    id: "lX3LavMNdlIbgEHH",
    name: "Old Mortlake",
    locale: "characters",
    gender: null,
    description:
      "An elderly gravedigger in a Victorian churchyard. Low, raspy and half whispered, melancholic, with heavy pauses that let every word settle like dirt on a coffin lid.",
  },
  {
    id: "dGyGDKo2osj7h3s7",
    name: "Azgorath",
    locale: "characters",
    gender: null,
    description:
      "An enormous ancient demon. A cavernous, impossibly deep bass voice that rumbles like stone grinding in a crypt, with a dry rasping edge and a faint hiss on every s. Calm, slow and amused, never shouting, every syllable set down deliberately, menace held under perfect control.",
  },
  {
    id: "cXoIXJ2llS8S0WOW",
    name: "Fennick the Young Elf",
    locale: "characters",
    gender: null,
    description:
      "A curious, kind-hearted elf boy of about ten. A natural child's voice in a warm, soft middle range, never squeaky or shrill, earnest and wide-eyed, a little breathless with excitement, speaking quickly when amazed. Clean, close studio recording with no background noise or hiss.",
  },
  {
    id: "GXaSqMEmOg12OIYb",
    name: "The Thing Under the Stairs",
    locale: "characters",
    gender: null,
    description:
      "A monstrous creature lurking in the dark. Gravelly, breathy and pitched near the floor, a threatening growl that stays quiet to stay frightening, with a slow mocking sneer.",
  },
  {
    id: "xO8xQo3BrB8FuI6J",
    name: "Vyrmathrax the Ancient",
    locale: "characters",
    gender: null,
    description:
      "An ancient dragon, thousands of years old. Very low and resonant, deep chest weight with gravel at the bottom of the register, slow and controlled with long pauses, dry and offhand, with the flat calm of something far too old to be impressed.",
  },
  {
    id: "cYtsRSxV5q9IMehn",
    name: "Grub the Ogre",
    locale: "characters",
    gender: null,
    description:
      "A big, good-natured ogre who lives under a bridge. Gruff and grainy, rumbling low end, heavy chest resonance, slow lumbering rhythm with loose rounded words, and warm humour sitting just under the grumble.",
  },
  {
    id: "gSgG5Tor0GPEnqzC",
    name: "Master Aldric",
    locale: "characters",
    gender: null,
    description:
      "A wise old British wizard, around eighty. Rich and resonant with an aged grain, warm and kindly, deliberate pace with weighted pauses before the words that matter, able to rise into a ringing incantation.",
  },
  {
    id: "NIWoEurJHMJjyUTe",
    name: "The Snow Queen",
    locale: "characters",
    gender: null,
    description:
      "A regal, cold-hearted queen of ice. A cool, crystalline mezzo voice, poised and elegant, precise articulation, unhurried and quietly commanding, with an enigmatic chill and a faint smile that never warms.",
  },
  {
    id: "y2eiKxtQo2B67deU",
    name: "Sir Bramwell",
    locale: "characters",
    gender: null,
    description:
      "A brave but pompous English knight, middle-aged. Booming, plummy and theatrical, full of puffed-up self-importance, rolling grand phrases, with a comic wobble of nerves showing through the bravado.",
  },
  {
    id: "QXNr0SvkukLB4wPq",
    name: "Fairy Godmother",
    locale: "characters",
    gender: null,
    description:
      "A kind fairy godmother, an older woman in her sixties. A low, warm, velvety alto voice, cosy and grandmotherly, unhurried and soothing, with a soft rich chuckle and a twinkle in every word. Gentle and reassuring, never high, never thin.",
  },
  {
    id: "FXxJ9mANRq6BCTX5",
    name: "No\u00e9mie",
    locale: "fr-fr",
    gender: "female",
    description:
      "A young Parisian voice, warm and expressive with a quick playful pace and delicate high notes, a care specialist who stays bright and witty.",
  },
  {
    id: "ZeSg853xFACESHHI",
    name: "Coralie",
    locale: "fr-fr",
    gender: "female",
    description:
      "A young Parisian voice, sweet and airy with fast, giggly girly charm, a bubbly assistant who makes every interaction feel light.",
  },
  {
    id: "0fvH6XAKvA748v2v",
    name: "Tiphaine",
    locale: "fr-fr",
    gender: "female",
    description:
      "Rounded, low-set tone with even phrasing and consonants that stay crisp through a handset.",
  },
  {
    id: "s048cR1l2Jmu4k3B",
    name: "Ma\u00eblys",
    locale: "fr-fr",
    gender: "female",
    description:
      "A young French voice, energetic and enthusiastic with a welcoming, upbeat delivery, sparky and to the point for responsive support.",
  },
  {
    id: "TUk4X11S6UytB3G6",
    name: "Orianne",
    locale: "fr-fr",
    gender: "female",
    description:
      "Airy and higher-set, gently buoyant, with sincerity that holds through an apology.",
  },
  {
    id: "YhIHaAfQ0cQPDV9R",
    name: "Sol\u00e8ne",
    locale: "fr-fr",
    gender: "female",
    description:
      "A young French voice, bright and high-pitched, warm and enthusiastic at a lively pace, a receptionist who greets everyone with delight.",
  },
  {
    id: "qtPlUYAZ4EJDuWMm",
    name: "Ninon",
    locale: "fr-fr",
    gender: "female",
    description:
      "Pitch that moves across a sentence, a rounded mid tone and a sense of humour kept well in check.",
  },
  {
    id: "4iKxBtHBRzr1YOph",
    name: "Lilou",
    locale: "fr-fr",
    gender: "female",
    description:
      "A young Parisian voice, buoyant and tender with rippling laughter, a light-hearted support voice that smiles while it helps.",
  },
  {
    id: "Vvakv7iWZCUrBooR",
    name: "H\u00e9l\u00e8ne",
    locale: "fr-fr",
    gender: "female",
    description:
      "Deep and resonant, carrying authority through steadiness rather than volume, with diction that survives raised playback speed.",
  },
  {
    id: "Tek4tJXiX6_yvXq7",
    name: "Augustin",
    locale: "fr-fr",
    gender: "male",
    description:
      "A curious, animated French adult voice that lights up when sharing an unexpected fact. Perfect for geeky explainers and trivia-driven dialogue.",
  },
  {
    id: "aXMVwiUhITMrwPzd",
    name: "Arnaud",
    locale: "fr-fr",
    gender: "male",
    description:
      "Low and firm, quick to the point, consonants holding their shape at phone bandwidth.",
  },
  {
    id: "YKeBw3OV1RgpdhLh",
    name: "Jules",
    locale: "fr-fr",
    gender: "male",
    description:
      "A lively, expressive French adult voice that lights up around topics it loves. Great for animated recommendations and high-energy dialogue.",
  },
  {
    id: "rqqeErpASHVQXHDd",
    name: "Baptiste",
    locale: "fr-fr",
    gender: "male",
    description:
      "Lively and expressive, with pitch that lifts and dips across a phrase and a playful edge to every line.",
  },
  {
    id: "LIv4NaG8ay4Mhqtd",
    name: "Lucien",
    locale: "fr-fr",
    gender: "male",
    description:
      "Rounded and settled, phrases landing softly, with an apology that sounds genuinely meant and good news that sounds like good news.",
  },
  {
    id: "biuhvu17TxVKOcyy",
    name: "Marius",
    locale: "fr-fr",
    gender: "male",
    description:
      "An energetic, well-poised French adult voice with the confident assurance of a natural closer. Ideal for sales pitches and high-conviction content.",
  },
  {
    id: "2A2fFf8SkDEJ8nzx",
    name: "Nele",
    locale: "de-de",
    gender: "female",
    description:
      "Rounded, open tone with gentle lift at the ends of phrases and an easy, flowing rhythm.",
  },
  {
    id: "4Mn9VfG2wsLLEzi5",
    name: "Jette",
    locale: "de-de",
    gender: "female",
    description:
      "An upbeat young German voice with a light girlish tone and warm bounce, a chipper assistant who keeps things moving with a smile.",
  },
  {
    id: "p6Uutkyi3j2iNAUu",
    name: "Annika",
    locale: "de-de",
    gender: "female",
    description:
      "A sparky, attentive German adult voice that gets to the point with a smile. Ideal for fast, efficient customer support and helpful voice assistants.",
  },
  {
    id: "MxhgvuHuUER7qjmL",
    name: "Jule",
    locale: "de-de",
    gender: "female",
    description:
      "Open and cheerful, sitting high and close over music, with an airy lift that softens where the copy turns personal.",
  },
  {
    id: "MOrDPn052KUlnKXk",
    name: "Lotta",
    locale: "de-de",
    gender: "female",
    description:
      "High forward energy with a close, present tone and crisp consonant attack that cuts through a music bed, plus real lift on the punchline.",
  },
  {
    id: "yadpmqsHVrYC0NJp",
    name: "Josefine",
    locale: "de-de",
    gender: "female",
    description:
      "Rounded and even in tone, sincere at the phrase ends, with consonants that hold up over a handset.",
  },
  {
    id: "Adoh4wA9tp5QXJi9",
    name: "Svea",
    locale: "de-de",
    gender: "female",
    description:
      "Sparky and to the point, with clean consonant edges, brisk rhythm and a decisive drop on the final line.",
  },
  {
    id: "3ZKKapPOvuWFcw9f",
    name: "Anton",
    locale: "de-de",
    gender: "male",
    description:
      "A vibrant, engaging German adult voice that makes every explanation feel personal. Built for product guides and walk-through assistants.",
  },
  {
    id: "Xn9xDzqSSr4xGTNg",
    name: "Mirko",
    locale: "de-de",
    gender: "male",
    description:
      "Punchy and close-miked in feel, with hard edges on the consonants and a decisive drop on the final line.",
  },
  {
    id: "Kf5m22mROozoMWj3",
    name: "Mats",
    locale: "de-de",
    gender: "male",
    description:
      "A sparky, attentive German adult voice that gets to the point with a smile. Ideal for fast, efficient customer support and helpful voice assistants.",
  },
  {
    id: "yyS1KYWs6mXoEw7D",
    name: "Henrik",
    locale: "de-de",
    gender: "male",
    description:
      "An easy-going, friendly German adult voice that puts callers instantly at ease. Great for onboarding assistants and warm concierge interactions.",
  },
  {
    id: "20zdyYrQPzKlCwkk",
    name: "Leon",
    locale: "de-de",
    gender: "male",
    description:
      "A bright, welcoming German adult voice with the warmth of a great receptionist. Perfect for greeting customers and friendly front-line support.",
  },
  {
    id: "R3uU1GTAZJotUhUs",
    name: "Mika",
    locale: "de-de",
    gender: "male",
    description:
      "Punchy and to the point, with a firm, resonant core, clean word endings and real snap between loud and quiet.",
  },
  {
    id: "b6FvJAiokjdqIti4",
    name: "Noa",
    locale: "es-es",
    gender: "female",
    description:
      "A glossy, confident young Castilian Spanish voice with fast, girly charm and warmth, a bubbly assistant that makes every chat sparkle.",
  },
  {
    id: "3p0eIGbkmny71GlA",
    name: "Luc\u00eda-Sol",
    locale: "es-es",
    gender: "female",
    description:
      "A bouncy, chipper young Castilian Spanish voice with a cute upward lilt, bringing playful energy to friendly reception and support.",
  },
  {
    id: "c9wqBDmQiBie5q6Y",
    name: "Candela",
    locale: "es-es",
    gender: "female",
    description:
      "An enthusiastic, bubbly young Castilian Spanish voice, animated like a beauty guru mid-tutorial, adding fun energy to customer care.",
  },
  {
    id: "rmLBOdHrfkFym9MM",
    name: "Celia",
    locale: "es-es",
    gender: "female",
    description:
      "Sparky and forward, light on the air but firm on every consonant, landing the final line without pushing.",
  },
  {
    id: "u2UscyAnHilpiwmf",
    name: "Alba",
    locale: "es-es",
    gender: "female",
    description:
      "A sweet, expressive young Castilian Spanish voice, soft and girly with lively emphasis, sparky and to the point for efficient support.",
  },
  {
    id: "4701YgRXjkBcg6sL",
    name: "Alicia",
    locale: "es-es",
    gender: "female",
    description:
      "Rounded and softly resonant, settling low in the range, with phrases that land gently and an apology that sounds genuinely meant.",
  },
  {
    id: "EQcQFGkYfMn5YJgx",
    name: "Nerea",
    locale: "es-es",
    gender: "female",
    description:
      "Rounded, lightly resonant tone with gentle lift at the end of phrases and an even, relaxed delivery.",
  },
  {
    id: "jvPx8j8zLGQ3utZz",
    name: "Marcos",
    locale: "es-es",
    gender: "male",
    description:
      "A confident, upbeat Peninsular Spanish adult voice with infectious energy. Perfect for proactive assistants and motivating customer success calls.",
  },
  {
    id: "tIjCgP8v3RY8UpgM",
    name: "Borja",
    locale: "es-es",
    gender: "male",
    description:
      "Resonant and punchy, driving a rhythmic read that cuts over a loud music bed and lands squarely on the brand name.",
  },
  {
    id: "t-_TS1e-0GzDAX02",
    name: "Iker",
    locale: "es-es",
    gender: "male",
    description:
      "An easy-going, friendly Peninsular Spanish adult voice that puts callers instantly at ease. Great for onboarding assistants and warm concierge interactions.",
  },
  {
    id: "fghJGlv90qu8OJ36",
    name: "Nuno",
    locale: "es-es",
    gender: "male",
    description:
      "Resonant and easy-going, with a relaxed mid-range delivery and a hint of playful lift at the end of phrases.",
  },
  {
    id: "Ejb29qHnSOK0cIHY",
    name: "Izan",
    locale: "es-es",
    gender: "male",
    description:
      "Crisp consonant attack, forward energy and a punchy delivery that sits on top of a music bed.",
  },
  {
    id: "FaLVVqpFQcDOtq45",
    name: "Guillermo",
    locale: "es-es",
    gender: "male",
    description:
      "Low and resonant, settled in tone, with phrases that land softly and an apology that sounds genuinely meant.",
  },
  {
    id: "Sx8m6WdXBG06zwZT",
    name: "Rebeca",
    locale: "es-mx",
    gender: "female",
    description:
      "Fuller and grounded in the low end, with hard consonant edges and a decisive punch saved for the brand name.",
  },
  {
    id: "s58clrg2fe0MO7Y-",
    name: "Regina",
    locale: "es-mx",
    gender: "female",
    description:
      "A confident, upbeat Mexican Spanish adult voice with the natural assurance of a closer. Ideal for proactive assistants and sales-led customer interactions.",
  },
  {
    id: "evfxKSxpDIhmsNoq",
    name: "Danae",
    locale: "es-mx",
    gender: "female",
    description:
      "Sparky and punchy, with a light, airy top end, clean attack on every word and a brisk rhythm that lands the brand name.",
  },
  {
    id: "KJpIQlbYrZPA4aLq",
    name: "Azucena",
    locale: "es-mx",
    gender: "female",
    description:
      "Weighted lower register with steady authority that comes from calm rather than volume, and diction that survives raised playback speed.",
  },
  {
    id: "qG5BXOJYrKEnXLIX",
    name: "Jimena",
    locale: "es-mx",
    gender: "female",
    description:
      "Crisp consonant attack and a forward, sparky delivery that sits over a music bed, with pitch that lifts and drops inside a single line.",
  },
  {
    id: "VDwnGxAo68C8U8vC",
    name: "Ximena",
    locale: "es-mx",
    gender: "female",
    description:
      "A playful, expressive Mexican Spanish adult voice that turns everyday moments into stories. Great for engaging assistants and personable conversational AI.",
  },
  {
    id: "F05gqkzX7WhKVpSL",
    name: "Lalo",
    locale: "es-mx",
    gender: "male",
    description:
      "Fuller and rounder low end, concise phrasing and a decisive drop on the last line, with range to pull back for one clause and push again.",
  },
  {
    id: "ax7dW1XB0eiMfHgO",
    name: "Aldo",
    locale: "es-mx",
    gender: "male",
    description:
      "Forward, close-miked energy with crisp consonant attack and pitch that climbs and drops across a line.",
  },
  {
    id: "ALczEazoF4n6PmGl",
    name: "Yael",
    locale: "es-mx",
    gender: "male",
    description:
      "Close, ringing tone with a grin in it, dropping right down for one clause then climbing into the payoff.",
  },
  {
    id: "G5HLUsQd659UtRe7",
    name: "Ulises",
    locale: "es-mx",
    gender: "male",
    description:
      "Low and resonant, with a settled delivery and consonants that survive a handset.",
  },
  {
    id: "BkuASiOJRrJEB5qA",
    name: "Leonel",
    locale: "es-mx",
    gender: "male",
    description:
      "Velvety and even tempered, sincere when an apology is due and genuinely pleased when the news is good.",
  },
  {
    id: "PwgPEaweQILZdGc4",
    name: "Nico",
    locale: "es-mx",
    gender: "male",
    description:
      "Sparky and to the point, with clean articulation that cuts through a loud music bed and a brisk rhythm that follows the copy's beats.",
  },
  {
    id: "KgC2Nqnjj48NUiyV",
    name: "Manuela-Lu",
    locale: "pt-br",
    gender: "female",
    description:
      "A bright, sweet, chirpy young voice with breathless excitement and a constant smile, a warm receptionist who greets everyone like a friend.",
  },
  {
    id: "CtNvKUUMrx1h56ih",
    name: "Isadora",
    locale: "pt-br",
    gender: "female",
    description:
      "An upbeat young voice with a light girlish tone and warm bounce, quick and to the point, ideal for efficient, caring customer service.",
  },
  {
    id: "K8mj96kYHMy8q3Hb",
    name: "D\u00e9bora",
    locale: "pt-br",
    gender: "female",
    description:
      "Low-set and resonant, with firm even phrasing and short decisive sentences.",
  },
  {
    id: "6k6cRt7QJfm5ChrH",
    name: "Rafaela",
    locale: "pt-br",
    gender: "female",
    description:
      "A spirited young voice with bell-like clarity and joyful bounce, narrating like the best sleepover ever, a light, fun personal assistant.",
  },
  {
    id: "sGCMzFIA53ppIngM",
    name: "Clarice",
    locale: "pt-br",
    gender: "female",
    description:
      "Quiet authority in a deep, resonant lower range, even in dynamics and firm at the end of every sentence.",
  },
  {
    id: "gOc90Rjmv5CobHCj",
    name: "Fl\u00e1via",
    locale: "pt-br",
    gender: "female",
    description:
      "Compact, resonant timbre with crisp consonants and focused, forward phrasing.",
  },
  {
    id: "NuUr_x5V90hSHzCJ",
    name: "Davi",
    locale: "pt-br",
    gender: "male",
    description:
      "A confident, upbeat Brazilian Portuguese adult voice with infectious energy. Perfect for proactive assistants and motivating customer success calls.",
  },
  {
    id: "l7520SIXi14iEamd",
    name: "Igor",
    locale: "pt-br",
    gender: "male",
    description:
      "Lifted and lively, pitch moving across a phrase, articulation quick and tidy.",
  },
  {
    id: "6HftnVU1XqVBJS8t",
    name: "Kau\u00e3",
    locale: "pt-br",
    gender: "male",
    description:
      "Sparky and close, with clean attack, brisk rhythm and a decisive push on the final clause that cuts over a loud music bed.",
  },
  {
    id: "mWgyMRkFED70QxQv",
    name: "Vitor",
    locale: "pt-br",
    gender: "male",
    description:
      "Lean and focused, with light pitch movement and a tidy rhythm that stays on point.",
  },
  {
    id: "JYtmeaysoaR0Wybf",
    name: "Ot\u00e1vio",
    locale: "pt-br",
    gender: "male",
    description:
      "Low, chest-resonant and settled, with even dynamics and real pauses that hold a paragraph together.",
  },
  {
    id: "qDeAnE4L4bk0BRz1",
    name: "Marcelo",
    locale: "pt-br",
    gender: "male",
    description:
      "Low and grounded, consonants firm, phrases short and sure of themselves.",
  },
];

export const LOCALE_LABELS: Record<VoiceLocale, string> = {
  "en-us": "American English",
  "en-gb": "British English",
  characters: "Characters",
  "fr-fr": "French accent",
  "de-de": "German accent",
  "es-es": "Spanish accent",
  "es-mx": "Mexican Spanish accent",
  "pt-br": "Brazilian Portuguese accent",
};

export const ENGLISH_LOCALES: Array<VoiceLocale> = [
  "en-us",
  "en-gb",
  "characters",
];

// Easton, Maeve, Micah, Zoey, Hugh, Harper: distinct voices for up to six
// speakers, so a fresh episode never starts with two identical voices.
const DEFAULT_VOICE_IDS = [
  "LMDIYE0Oa377Qh6Z",
  "6PWnV0Nq4wu7RVBT",
  "40QrMVgAxFiUnP9f",
  "NbpkqMVS3CJeq2j8",
  "YyKcxPG7iIgS3jsK",
  "4SZHfMpw-p46Ywgs",
];

export const defaultVoices = (
  speakers: Array<string>
): Record<string, string> =>
  Object.fromEntries(
    speakers.map((speaker, i) => [
      speaker,
      DEFAULT_VOICE_IDS[i % DEFAULT_VOICE_IDS.length],
    ])
  );

export const getVoice = (id: string): Voice | undefined =>
  VOICES.find((voice) => voice.id === id);
