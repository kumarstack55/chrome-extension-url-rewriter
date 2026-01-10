import { describe, it } from "node:test";
import assert from "node:assert";
import { LanguageRewriter } from "./language.js";

describe("LanguageRewriter", () => {
  it("should rewrite en to ja in lowercase", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/en/docs";
    const expectedUrl = "https://example.com/ja/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite EN to JA in uppercase", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/EN/docs";
    const expectedUrl = "https://example.com/JA/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite En to Ja with capitalized first letter", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/En/docs";
    const expectedUrl = "https://example.com/Ja/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite ja to en", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/ja/docs";
    const expectedUrl = "https://example.com/en/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should handle multiple language codes in path", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/en/ja/docs";
    const expectedUrl = "https://example.com/ja/en/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should handle fr language code", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/fr/docs";
    const expectedUrl = "https://example.com/en/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return null when no language code exists", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should preserve query parameters", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/en/docs?query=test";
    const expectedUrl = "https://example.com/ja/docs?query=test";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should not match non-ISO 639-1 codes", () => {
    const rewriter = new LanguageRewriter();
    const inputUrl = "https://example.com/xx/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should return correct name", () => {
    const rewriter = new LanguageRewriter();
    assert.strictEqual(rewriter.getName(), "Language Switcher");
  });

  it("should return correct pattern", () => {
    const rewriter = new LanguageRewriter();
    assert.strictEqual(rewriter.getRewritablePattern(), "/[A-Za-z]{2}/");
  });
});
