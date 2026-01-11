import { describe, it } from "node:test";
import assert from "node:assert";
import { AmazonCoJpRewriter } from "./amazon-co-jp.js";

describe("AmazonCoJpRewriter", () => {
  it("should rewrite Amazon product URL to clean format", () => {
    const rewriter = new AmazonCoJpRewriter();
    const inputUrl =
      "https://www.amazon.co.jp/dp/B0CKRLJQLT/ref=sr_1_1?crid=123&keywords=test";
    const expectedUrl = "https://www.amazon.co.jp/dp/B0CKRLJQLT/";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return null when URL does not contain dp pattern", () => {
    const rewriter = new AmazonCoJpRewriter();
    const inputUrl = "https://www.amazon.co.jp/gp/bestsellers/";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, null);
  });

  it("should handle URL without query parameters", () => {
    const rewriter = new AmazonCoJpRewriter();
    const inputUrl = "https://www.amazon.co.jp/dp/B0CKRLJQLT/ref=sr_1_1";
    const expectedUrl = "https://www.amazon.co.jp/dp/B0CKRLJQLT/";

    const result = rewriter.rewriteUrl(inputUrl);

    assert.strictEqual(result, expectedUrl);
  });

  it("should return correct name", () => {
    const rewriter = new AmazonCoJpRewriter();
    assert.strictEqual(rewriter.getName(), "Amazon.co.jp Rewriter");
  });

  it("should return correct pattern", () => {
    const rewriter = new AmazonCoJpRewriter();
    assert.strictEqual(
      rewriter.getRewritablePattern(),
      "^https://www\\.amazon\\.co\\.jp/"
    );
  });
});
