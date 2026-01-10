import { describe, it } from "node:test";
import assert from "node:assert";
import { GadRemoverRewriter } from "./gad-remover.js";

describe("GadRemoverRewriter", () => {
  it("should remove utm_source parameter", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl = "https://example.com/page?utm_source=google&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should remove all UTM parameters", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl =
      "https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=test&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should remove gclid parameter", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl = "https://example.com/page?gclid=123456&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should remove gbraid parameter", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl = "https://example.com/page?gbraid=abc123&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should remove wbraid parameter", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl = "https://example.com/page?wbraid=xyz789&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should remove gad_* parameters", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl =
      "https://example.com/page?gad_source=1&gad_campaign=test&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should remove all ad tracking parameters", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl =
      "https://example.com/page?utm_source=google&gclid=123&gbraid=abc&wbraid=xyz&gad_source=1&other=value";
    const expectedUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return null when no tracking parameters exist", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl = "https://example.com/page?other=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should handle URL with only tracking parameters", () => {
    const rewriter = new GadRemoverRewriter();
    const inputUrl = "https://example.com/page?utm_source=google&gclid=123";
    const expectedUrl = "https://example.com/page";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return correct name", () => {
    const rewriter = new GadRemoverRewriter();
    assert.strictEqual(rewriter.getName(), "Google Ad Remover");
  });

  it("should return correct pattern", () => {
    const rewriter = new GadRemoverRewriter();
    assert.strictEqual(
      rewriter.getRewritablePattern(),
      ".*[?&](?:utm_|gad_|gclid=|gbraid=|wbraid=).*"
    );
  });
});
