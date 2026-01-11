import { UrlRewriter } from "./base.js";

export class KubernetesDotIoRewriter extends UrlRewriter {
  getName(): string {
    return "kubernetes.io Language Switcher";
  }

  getRewritablePattern(): string {
    return "^https://kubernetes\\.io/";
  }

  private isLanguagePart(part: string): boolean {
    // FIXME: This is a simplified example. Actual language codes may vary.
    return part === "ja";
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);

    if (u.pathname === "/") {
      u.pathname = "/ja/";
    } else {
      const parts = u.pathname.split("/");
      const maybeLangPart = parts[1];
      if (this.isLanguagePart(maybeLangPart)) {
        parts.splice(1, 1);
        u.pathname = parts.join("/");
      } else {
        parts.splice(1, 0, "ja");
        u.pathname = parts.join("/");
      }
    }

    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }

    return url2;
  }
}
