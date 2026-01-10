import { UrlRewriter } from "./base.js";

export class XDotComRewriter extends UrlRewriter {
  getName(): string {
    return "X.com Rewriter";
  }

  getRewritablePattern(): string {
    return "^https://x\\.com/";
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);
    u.searchParams.delete("s");
    return u.toString();
  }
}
