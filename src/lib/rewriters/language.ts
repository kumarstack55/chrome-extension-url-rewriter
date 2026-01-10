import { UrlRewriter } from "./base.js";

export class LanguageRewriter extends UrlRewriter {
  // ISO 639-1 (2-letter) codes
  private readonly ISO639_1: Set<string> = new Set([
    "aa",
    "ab",
    "ae",
    "af",
    "ak",
    "am",
    "an",
    "ar",
    "as",
    "av",
    "ay",
    "az",
    "ba",
    "be",
    "bg",
    "bh",
    "bi",
    "bm",
    "bn",
    "bo",
    "br",
    "bs",
    "ca",
    "ce",
    "ch",
    "co",
    "cr",
    "cs",
    "cu",
    "cv",
    "cy",
    "da",
    "de",
    "dv",
    "dz",
    "ee",
    "el",
    "en",
    "eo",
    "es",
    "et",
    "eu",
    "fa",
    "ff",
    "fi",
    "fj",
    "fo",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gn",
    "gu",
    "gv",
    "ha",
    "he",
    "hi",
    "ho",
    "hr",
    "ht",
    "hu",
    "hy",
    "hz",
    "ia",
    "id",
    "ie",
    "ig",
    "ii",
    "ik",
    "io",
    "is",
    "it",
    "iu",
    "ja",
    "jv",
    "ka",
    "kg",
    "ki",
    "kj",
    "kk",
    "kl",
    "km",
    "kn",
    "ko",
    "kr",
    "ks",
    "ku",
    "kv",
    "kw",
    "ky",
    "la",
    "lb",
    "lg",
    "li",
    "ln",
    "lo",
    "lt",
    "lu",
    "lv",
    "mg",
    "mh",
    "mi",
    "mk",
    "ml",
    "mn",
    "mr",
    "ms",
    "mt",
    "my",
    "na",
    "nb",
    "nd",
    "ne",
    "ng",
    "nl",
    "nn",
    "no",
    "nr",
    "nv",
    "ny",
    "oc",
    "oj",
    "om",
    "or",
    "os",
    "pa",
    "pi",
    "pl",
    "ps",
    "pt",
    "qu",
    "rm",
    "rn",
    "ro",
    "ru",
    "rw",
    "sa",
    "sc",
    "sd",
    "se",
    "sg",
    "si",
    "sk",
    "sl",
    "sm",
    "sn",
    "so",
    "sq",
    "sr",
    "ss",
    "st",
    "su",
    "sv",
    "sw",
    "ta",
    "te",
    "tg",
    "th",
    "ti",
    "tk",
    "tl",
    "tn",
    "to",
    "tr",
    "ts",
    "tt",
    "tw",
    "ty",
    "ug",
    "uk",
    "ur",
    "uz",
    "ve",
    "vi",
    "vo",
    "wa",
    "wo",
    "xh",
    "yi",
    "yo",
    "za",
    "zh",
    "zu",
  ]);

  getName(): string {
    return "Language Switcher";
  }

  getRewritablePattern(): string {
    return "/[A-Za-z]{2}/";
  }

  private ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private isUcFirst(str: string): boolean {
    const firstChar = str.charAt(0);
    const rest = str.slice(1);
    return firstChar === firstChar.toUpperCase() && rest === rest.toLowerCase();
  }

  private isLower(str: string): boolean {
    return str === str.toLowerCase();
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);
    const pathname = u.pathname;

    const pathParts = pathname.split("/");
    const newPathParts = pathParts.map((part) => {
      console.log(`Checking part: ${part}`);

      const lowerPart = part.toLowerCase();
      if (this.ISO639_1.has(lowerPart)) {
        console.log(`Found language part: ${part}`);

        let newLang = "en";
        if (lowerPart === "en") {
          newLang = "ja";
        }

        if (this.isLower(part)) {
          newLang = newLang.toLowerCase();
        } else if (this.isUcFirst(part)) {
          newLang = this.ucFirst(newLang);
        } else {
          newLang = newLang.toUpperCase();
        }
        return newLang;
      }

      return part;
    });

    u.pathname = newPathParts.join("/");

    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }
    return url2;
  }
}
