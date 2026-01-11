import { describe, it } from "node:test";
import assert from "node:assert";
import { KubernetesDotIoRewriter } from "./kubernetes-dot-io.js";

describe("KubernetesDotIoRewriter", () => {
  const rewriter = new KubernetesDotIoRewriter();

  describe("getName", () => {
    it("should return the correct name", () => {
      assert.strictEqual(rewriter.getName(), "kubernetes.io Language Switcher");
    });
  });

  describe("getRewritablePattern", () => {
    it("should return the correct pattern", () => {
      assert.strictEqual(rewriter.getRewritablePattern(), "^https://kubernetes\\.io/");
    });
  });

  describe("rewriteUrl", () => {
    it("should add /ja/ to root URL", () => {
      const inputUrl = "https://kubernetes.io/";
      const expectedUrl = "https://kubernetes.io/ja/";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });

    it("should add /ja/ to URL without language code", () => {
      const inputUrl = "https://kubernetes.io/docs/home/";
      const expectedUrl = "https://kubernetes.io/ja/docs/home/";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });

    it("should remove /ja/ from URL with language code", () => {
      const inputUrl = "https://kubernetes.io/ja/docs/home/";
      const expectedUrl = "https://kubernetes.io/docs/home/";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });

    it("should toggle /ja/ when URL has it", () => {
      const inputUrl = "https://kubernetes.io/ja/";
      const expectedUrl = "https://kubernetes.io/";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });

    it("should handle URLs with query parameters", () => {
      const inputUrl = "https://kubernetes.io/docs/home/?version=v1.28";
      const expectedUrl = "https://kubernetes.io/ja/docs/home/?version=v1.28";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });

    it("should handle URLs with hash fragments", () => {
      const inputUrl = "https://kubernetes.io/docs/home/#section";
      const expectedUrl = "https://kubernetes.io/ja/docs/home/#section";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });

    it("should remove /ja/ and preserve query and hash", () => {
      const inputUrl = "https://kubernetes.io/ja/docs/home/?v=1#section";
      const expectedUrl = "https://kubernetes.io/docs/home/?v=1#section";

      const result = rewriter.rewriteUrl(inputUrl);

      assert.strictEqual(result, expectedUrl);
    });
  });
});
