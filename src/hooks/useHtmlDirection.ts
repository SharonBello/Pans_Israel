// src/hooks/useHtmlDirection.ts
import { useEffect } from "react";
import i18n from "../i18n";

export function useHtmlDirection() {
  useEffect(() => {
    const setDir = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = i18n.dir(lng);
    };

    // initialize
    setDir(i18n.language);

    // listen to future changes
    i18n.on("languageChanged", setDir);
    return () => {
      i18n.off("languageChanged", setDir);
    };
  }, []);
}
