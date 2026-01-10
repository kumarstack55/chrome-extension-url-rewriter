import { describe, it } from "node:test";
import assert from "node:assert";
import { NoopRewriter } from "./noop.js";

describe("NoopRewriter", () => {
  it("should return the original URL unchanged", () => {
    const rewriter = new NoopRewriter();
    const inputUrl = "https://example.com/page?param=value";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, inputUrl);
  });

  it("should match any URL", () => {
    const rewriter = new NoopRewriter();
    const pattern = new RegExp(rewriter.getRewritablePattern());

    assert.strictEqual(pattern.test("https://example.com"), true);
    assert.strictEqual(pattern.test("http://test.org/path"), true);
    assert.strictEqual(pattern.test("ftp://files.net"), true);
  });

  it("should return correct name", () => {
    const rewriter = new NoopRewriter();
    assert.strictEqual(rewriter.getName(), "Original URL");
  });

  it("should return correct pattern", () => {
    const rewriter = new NoopRewriter();
    assert.strictEqual(rewriter.getRewritablePattern(), "^.*");
  });
});
