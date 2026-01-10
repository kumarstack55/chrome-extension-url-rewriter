export class UrlRewriterError extends Error {}

export abstract class UrlRewriter {
  getName(): string {
    throw new UrlRewriterError("Not implemented");
  }

  getRewritablePattern(): string {
    throw new UrlRewriterError("Not implemented");
  }

  rewriteUrl(url: string): string | null {
    throw new UrlRewriterError("Not implemented");
  }
}
