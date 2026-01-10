import { describe, it } from "node:test";
import assert from "node:assert";
import { RewriterFactory, ResultSet, Result } from "./rewriter-factory.js";
import { XDotComRewriter } from "./rewriters/x-dot-com.js";

describe("RewriterFactory", () => {
  describe("create", () => {
    it("should create a factory with all rewriters registered", () => {
      const factory = RewriterFactory.create();
      const matcher = factory.getRewriterMatcher();

      // Test that various rewriters are registered
      const amazonUrl = "https://www.amazon.co.jp/dp/B0CKRLJQLT/ref=sr_1_1";
      const amazonResult = matcher.match(amazonUrl);
      assert.ok(!amazonResult.isEmpty());

      const xUrl = "https://x.com/user/status/1111111111111111111?s=20";
      const xResult = matcher.match(xUrl);
      assert.ok(!xResult.isEmpty());
    });
  });

  describe("addRewriter", () => {
    it("should add a rewriter to the factory", () => {
      const factory = new RewriterFactory();

      // Initially no rewriters
      const matcher1 = factory.getRewriterMatcher();
      const result1 = matcher1.match("https://x.com/user/status/123?s=20");
      assert.ok(result1.isEmpty());

      // Add a rewriter
      factory.addRewriter(new XDotComRewriter());

      const matcher2 = factory.getRewriterMatcher();
      const result2 = matcher2.match("https://x.com/user/status/123?s=20");
      assert.ok(!result2.isEmpty());
    });
  });

  describe("getRewriterMatcher", () => {
    it("should return a RewriterMatcher instance", () => {
      const factory = RewriterFactory.create();
      const matcher = factory.getRewriterMatcher();

      assert.ok(matcher !== null);
      assert.ok(typeof matcher.match === "function");
    });
  });
});

describe("RewriterMatcher", () => {
  describe("match", () => {
    it("should match and rewrite URLs with matching rewriters", () => {
      const factory = RewriterFactory.create();
      const matcher = factory.getRewriterMatcher();

      const url = "https://x.com/user/status/1111111111111111111?s=20";
      const resultSet = matcher.match(url);

      assert.ok(!resultSet.isEmpty());
      const results = resultSet.getResults();
      assert.ok(results.length > 0);

      // Find the X.com rewriter result
      const xResult = results.find((r) => r.getName() === "X.com Rewriter");
      assert.ok(xResult !== undefined);
      assert.strictEqual(
        xResult.getUrl(),
        "https://x.com/user/status/1111111111111111111"
      );
    });

    it("should return empty ResultSet when no rewriters match", () => {
      const factory = new RewriterFactory();
      const matcher = factory.getRewriterMatcher();

      const url = "https://example.com/page";
      const resultSet = matcher.match(url);

      assert.ok(resultSet.isEmpty());
    });

    it("should skip rewriters that return null", () => {
      const factory = RewriterFactory.create();
      const matcher = factory.getRewriterMatcher();

      const url = "https://www.amazon.co.jp/some/other/path";
      const resultSet = matcher.match(url);

      // AmazonCoJpRewriter should match but return null (no dp pattern)
      const results = resultSet.getResults();
      const amazonResult = results.find(
        (r) => r.getName() === "Amazon.co.jp Rewriter"
      );
      assert.strictEqual(amazonResult, undefined);
    });
  });
});

describe("ResultSet", () => {
  describe("isEmpty", () => {
    it("should return true when there are no results", () => {
      const resultSet = new ResultSet([]);
      assert.strictEqual(resultSet.isEmpty(), true);
    });

    it("should return false when there are results", () => {
      const result = new Result("Test", "https://example.com");
      const resultSet = new ResultSet([result]);
      assert.strictEqual(resultSet.isEmpty(), false);
    });
  });

  describe("getResults", () => {
    it("should return the array of results", () => {
      const result1 = new Result("Test 1", "https://example1.com");
      const result2 = new Result("Test 2", "https://example2.com");
      const resultSet = new ResultSet([result1, result2]);

      const results = resultSet.getResults();
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].getName(), "Test 1");
      assert.strictEqual(results[1].getName(), "Test 2");
    });
  });
});

describe("Result", () => {
  describe("getName", () => {
    it("should return the name", () => {
      const result = new Result("Test Name", "https://example.com");
      assert.strictEqual(result.getName(), "Test Name");
    });
  });

  describe("getUrl", () => {
    it("should return the URL", () => {
      const result = new Result("Test Name", "https://example.com");
      assert.strictEqual(result.getUrl(), "https://example.com");
    });
  });
});
