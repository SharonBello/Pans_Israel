import i18n from "@/config/i18n";
import { useEffect } from "react";

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
