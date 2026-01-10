import { describe, it } from "node:test";
import assert from "node:assert";
import { XDotComRewriter } from "./x-dot-com.js";

describe("XDotComRewriter", () => {
  it("should remove 's' query parameter", () => {
    const rewriter = new XDotComRewriter();
    const inputUrl = "https://x.com/user/status/1111111111111111111?s=20";
    const expectedUrl = "https://x.com/user/status/1111111111111111111";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return the same URL when 's' parameter doesn't exist", () => {
    const rewriter = new XDotComRewriter();
    const inputUrl = "https://x.com/user/status/1111111111111111111";
    const expectedUrl = "https://x.com/user/status/1111111111111111111";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should preserve other query parameters", () => {
    const rewriter = new XDotComRewriter();
    const inputUrl =
      "https://x.com/user/status/1111111111111111111?s=20&ref_src=twsrc";
    const expectedUrl =
      "https://x.com/user/status/1111111111111111111?ref_src=twsrc";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return correct name", () => {
    const rewriter = new XDotComRewriter();
    assert.strictEqual(rewriter.getName(), "X.com Rewriter");
  });

  it("should return correct pattern", () => {
    const rewriter = new XDotComRewriter();
    assert.strictEqual(rewriter.getRewritablePattern(), "^https://x\\.com/");
  });
});
