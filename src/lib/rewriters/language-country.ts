import { setHeapSnapshotNearHeapLimit } from "v8";
import { UrlRewriter } from "./base.js";

export class LanguageCountryRewriter extends UrlRewriter {
  getName(): string {
    return "Language Country Switcher";
  }

  getRewritablePattern(): string {
    return "/[a-z]{2}-[A-Za-z]{2}/";
  }

  private getCanonicalLocale(part: string): string | null {
    try {
      const part2 = part.replace("_", "-");
      const [canon] = Intl.getCanonicalLocales(part2);
      return canon;
    } catch {
      return null;
    }
  }

  private getSeparator(part: string): string | null {
    if (part.includes("-")) {
      return "-";
    } else if (part.includes("_")) {
      return "_";
    }
    return null;
  }

  private isLanguageCountry(canon: string): boolean {
    try {
      return /^[a-z]{2}-[A-Z]{2}$/.test(canon);
    } catch {
      return false;
    }
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
      console.log(`Processing part: ${part}`);
      const canon = this.getCanonicalLocale(part);
      if (!canon) {
        return part;
      }

      if (!this.isLanguageCountry(canon)) {
        return part;
      }
      console.log(`Found language-country part: ${part}`);

      const separator = this.getSeparator(part);
      if (!separator) {
        return part;
      }

      const [lang, country] = part.split(separator);

      let newLang = "en";
      let newCountry = "US";
      if (canon.toLocaleLowerCase() === "en-us") {
        newLang = "ja";
        newCountry = "JP";
      }

      if (this.isLower(lang)) {
        newLang = newLang.toLowerCase();
      } else if (this.isUcFirst(lang)) {
        newLang = this.ucFirst(newLang);
      } else {
        newLang = newLang.toUpperCase();
      }

      if (this.isLower(country)) {
        newCountry = newCountry.toLowerCase();
      } else if (this.isUcFirst(country)) {
        newCountry = this.ucFirst(newCountry);
      } else {
        newCountry = newCountry.toUpperCase();
      }

      return `${newLang}${separator}${newCountry}`;
    });

    u.pathname = newPathParts.join("/");

    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }
    return url2;
  }
}
