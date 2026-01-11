import { UrlRewriter } from "./base.js";

export class AmazonCoJpRewriter extends UrlRewriter {
  getName(): string {
    return "Amazon.co.jp Rewriter";
  }

  getRewritablePattern(): string {
    return "^https://www\\.amazon\\.co\\.jp/";
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);

    const pathname = u.pathname;

    const m = pathname.match(/\/dp\/\w+/);
    if (!m) {
      return null;
    }

    const hostname = u.hostname;
    const dpAsin = m[0];
    return `https://${hostname}${dpAsin}/`;
  }
}
