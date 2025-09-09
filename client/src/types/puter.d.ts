export {};

type TTSEngine = "standard" | "neural" | "generative";

interface Puter {
  ai: {
    txt2speech: (
      text: string,
      opts?: { language?: string; voice?: string; engine?: TTSEngine }
    ) => Promise<HTMLAudioElement>;
  };
}

declare global {
  interface Window {
    puter: Puter;
  }
  const puter: Puter;
}
