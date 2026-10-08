/**
 * Pronunciation helper.
 *
 * Browser speech synthesis very rarely ships voices for isiZulu, isiXhosa, Sepedi and
 * the rest, so this degrades deliberately: try the exact language, then any South
 * African voice, then any English voice, and slow the rate down so the syllables are at
 * least separable. It is a study aid, not a substitute for hearing a first-language
 * speaker — which is exactly why the archive asks people to record real audio.
 */

const BCP47: Record<string, string[]> = {
  zul: ["zu-ZA", "zu"],
  xho: ["xh-ZA", "xh"],
  afr: ["af-ZA", "af"],
  nso: ["nso-ZA", "nso"],
  tsn: ["tn-ZA", "tn"],
  eng: ["en-ZA", "en-GB", "en"],
  sot: ["st-ZA", "st"],
  tso: ["ts-ZA", "ts"],
  ssw: ["ss-ZA", "ss"],
  ven: ["ve-ZA", "ve"],
  nbl: ["nr-ZA", "nr"],
  sasl: [],
};

export function hasSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(langCode?: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const wanted = langCode ? BCP47[langCode] ?? [] : [];
  for (const tag of wanted) {
    const exact = voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;
    const prefix = voices.find((v) => v.lang.toLowerCase().startsWith(tag.split("-")[0].toLowerCase()));
    if (prefix) return prefix;
  }
  return (
    voices.find((v) => v.lang.toLowerCase() === "en-za") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en-g")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    voices[0]
  );
}

/** Speak a word or phrase. `langCode` is a ROOTS language code such as `zul`. */
export function speak(text: string, langCode?: string) {
  if (!hasSpeech()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(langCode);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }
  utter.rate = 0.78;
  utter.pitch = 1;
  synth.speak(utter);
}

/** True when the browser actually has a voice for this language rather than a fallback. */
export function hasNativeVoice(langCode: string): boolean {
  if (!hasSpeech()) return false;
  const tags = BCP47[langCode] ?? [];
  const voices = window.speechSynthesis.getVoices();
  return tags.some((t) => voices.some((v) => v.lang.toLowerCase().startsWith(t.split("-")[0].toLowerCase())));
}

/** Some browsers populate the voice list asynchronously. */
export function warmVoices() {
  if (!hasSpeech()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
