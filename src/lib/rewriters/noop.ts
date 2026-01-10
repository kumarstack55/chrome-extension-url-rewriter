import { UrlRewriter } from "./base.js";

export class NoopRewriter extends UrlRewriter {
  getName(): string {
    return "Original URL";
  }

  getRewritablePattern(): string {
    return "^.*";
  }

  rewriteUrl(url: string): string | null {
    return url;
  }
}
