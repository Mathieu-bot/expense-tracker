// src/hooks/usePuterTTS.ts
import { useEffect, useState, useCallback } from "react";

export type TTSEngine = "standard" | "neural" | "generative";

export function usePuterTTS() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).puter) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.puter.com/v2/";
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setError("There was an error loading Puter");
    document.head.appendChild(s);
    return () => {
      document.head.removeChild(s);
    };
  }, []);

  const speak = useCallback(
    async (
      text: string,
      opts?: { language?: string; voice?: string; engine?: TTSEngine }
    ) => {
      const audio = await window.puter.ai.txt2speech(text, {
        language: opts?.language ?? "en-US",
        voice: opts?.voice ?? "Joanna",
        engine: opts?.engine ?? "neural",
      });
      await audio.play();
    },
    []
  );

  return { ready, error, speak };
}
