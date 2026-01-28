import { describe, it } from "node:test";
import assert from "node:assert";
import { GoogleRewriter } from "./google.js";

describe("GoogleRewriter", () => {
  it("should rewrite URL from en to ja", () => {
    const rewriter = new GoogleRewriter();
    const inputUrl =
      "https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop";
    const expectedUrl =
      "https://support.google.com/chrome/answer/95647?hl=ja&co=GENIE.Platform%3DDesktop";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite URL from ja to en", () => {
    const rewriter = new GoogleRewriter();
    const inputUrl =
      "https://support.google.com/chrome/answer/95647?hl=ja&co=GENIE.Platform%3DDesktop";
    const expectedUrl =
      "https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite ai.google.dev URL", () => {
    const rewriter = new GoogleRewriter();
    const inputUrl =
      "https://ai.google.dev/gemini-api/docs/get-started/tutorial?hl=en";
    const expectedUrl =
      "https://ai.google.dev/gemini-api/docs/get-started/tutorial?hl=ja";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite subdomain.google.com URL", () => {
    const rewriter = new GoogleRewriter();
    const inputUrl = "https://developers.google.com/apps-script?hl=en";
    const expectedUrl = "https://developers.google.com/apps-script?hl=ja";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return null when hl parameter doesn't exist", () => {
    const rewriter = new GoogleRewriter();
    const inputUrl =
      "https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should return correct name", () => {
    const rewriter = new GoogleRewriter();
    assert.strictEqual(rewriter.getName(), "Google Language Switcher");
  });

  it("should return correct pattern", () => {
    const rewriter = new GoogleRewriter();
    assert.strictEqual(
      rewriter.getRewritablePattern(),
      "^https://.*\\.google\\.(?:dev|com)/",
    );
  });

  it("should match pattern for various Google domains", () => {
    const rewriter = new GoogleRewriter();
    const pattern = new RegExp(rewriter.getRewritablePattern());

    assert.ok(pattern.test("https://support.google.com/"));
    assert.ok(pattern.test("https://ai.google.dev/"));
    assert.ok(pattern.test("https://developers.google.com/"));
    assert.ok(pattern.test("https://console.google.com/"));
    assert.ok(!pattern.test("https://google.com/"));
    assert.ok(!pattern.test("https://www.google.co.jp/"));
  });
});
