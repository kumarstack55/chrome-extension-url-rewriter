import { describe, it } from "node:test";
import assert from "node:assert";
import { LanguageCountryRewriter } from "./language-country.js";

describe("LanguageCountryRewriter", () => {
  it("should rewrite en_us to ja_jp in lowercase", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/en_us/docs";
    const expectedUrl = "https://example.com/ja_jp/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite en-us to ja-jp in lowercase", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/en-us/docs";
    const expectedUrl = "https://example.com/ja-jp/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite en-US to ja-JP with mixed case", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/en-US/docs";
    const expectedUrl = "https://example.com/ja-JP/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite EN-US to JA-JP in uppercase", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/EN-US/docs";
    const expectedUrl = "https://example.com/JA-JP/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should rewrite ja-jp to en-us in lowercase", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/ja-jp/docs";
    const expectedUrl = "https://example.com/en-us/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should handle multiple language-country codes in path", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/en-us/ja-jp/docs";
    const expectedUrl = "https://example.com/ja-jp/en-us/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return null when no language-country code exists", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/docs";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should preserve query parameters", () => {
    const rewriter = new LanguageCountryRewriter();
    const inputUrl = "https://example.com/en-us/docs?query=test";
    const expectedUrl = "https://example.com/ja-jp/docs?query=test";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return correct name", () => {
    const rewriter = new LanguageCountryRewriter();
    assert.strictEqual(rewriter.getName(), "Language Country Switcher");
  });

  it("should return correct pattern", () => {
    const rewriter = new LanguageCountryRewriter();
    assert.strictEqual(
      rewriter.getRewritablePattern(),
      "/[a-z]{2}-[A-Za-z]{2}/"
    );
  });
});
