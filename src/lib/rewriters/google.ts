import { UrlRewriter } from "./base.js";

export class GoogleRewriter extends UrlRewriter {
  getName(): string {
    return "Google Language Switcher";
  }

  getRewritablePattern(): string {
    return "^https://.*\\.google\\.(?:dev|com)/";
  }

  rewriteUrl(url: string): string | null {
    const HL = "hl";

    const u = new URL(url);
    if (u.searchParams.has(HL)) {
      const value = u.searchParams.get(HL);
      let newValue = "en";
      if (value === "en") {
        newValue = "ja";
      }
      u.searchParams.set(HL, newValue);
    }
    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }

    return url2;
  }
}
