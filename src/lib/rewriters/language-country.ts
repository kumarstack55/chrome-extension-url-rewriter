import { UrlRewriter } from "./base.js";

export class LanguageCountryRewriter extends UrlRewriter {
  getName(): string {
    return "Language Country Switcher";
  }

  getRewritablePattern(): string {
    return "/[a-z]{2}-[A-Za-z]{2}/";
  }

  private isLanguageCountry(part: string): boolean {
    try {
      const [canon] = Intl.getCanonicalLocales(String(part).replace("_", "-"));
      return /^[a-z]{2,3}-[A-Z]{2}$/.test(canon);
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
      if (this.isLanguageCountry(part)) {
        console.log(`Found language-country part: ${part}`);

        const [lang, country] = part.split("-");

        let newLang = "en";
        let newCountry = "US";
        if (part.toLocaleLowerCase() === "en-us") {
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

        return `${newLang}-${newCountry}`;
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
