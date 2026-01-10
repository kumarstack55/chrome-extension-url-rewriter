import { describe, it } from "node:test";
import assert from "node:assert";
import { SupportGoogleComRewriter } from "./support-google-com.js";

describe("SupportGoogleComRewriter", () => {
  it("should rewrite URL from en to ja", () => {
    const rewriter = new SupportGoogleComRewriter();
    const inputUrl =
      "https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop";
    const expectedUrl =
      "https://support.google.com/chrome/answer/95647?hl=ja&co=GENIE.Platform%3DDesktop";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite URL from ja to en", () => {
    const rewriter = new SupportGoogleComRewriter();
    const inputUrl =
      "https://support.google.com/chrome/answer/95647?hl=ja&co=GENIE.Platform%3DDesktop";
    const expectedUrl =
      "https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return null when hl parameter doesn't exist", () => {
    const rewriter = new SupportGoogleComRewriter();
    const inputUrl =
      "https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should return correct name", () => {
    const rewriter = new SupportGoogleComRewriter();
    assert.strictEqual(
      rewriter.getName(),
      "support.google.com Language Switcher"
    );
  });

  it("should return correct pattern", () => {
    const rewriter = new SupportGoogleComRewriter();
    assert.strictEqual(
      rewriter.getRewritablePattern(),
      "^https://support\\.google\\.com/"
    );
  });
});
