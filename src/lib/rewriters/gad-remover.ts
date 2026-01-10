import { UrlRewriter } from "./base.js";

export class GadRemoverRewriter extends UrlRewriter {
  // Urchin Tracking Module (UTM) parameters
  // https://support.google.com/analytics/answer/11242870?hl=en
  private utmKeywordsMap: Map<string, boolean> = new Map([
    ["utm_source", true],
    ["utm_medium", true],
    ["utm_campaign", true],
    ["utm_term", true],
    ["utm_content", true],
    ["utm_source_platform", true],
    ["utm_creative_format", true],
    ["utm_marketing_tactic", true],
  ]);

  private gadKeywordsMap: Map<string, boolean> = new Map([
    // https://support.google.com/google-ads/answer/9744275?hl=en
    // > Google Click ID (GCLID) is a URL parameter passed with ad clicks.
    ["gclid", true],
    // https://support.google.com/analytics/answer/11367152?hl=en
    // > For web to app measurement, the parameter is known as GBRAID, and for app to web measurement, it's known as WBRAID.
    ["gbraid", true],
    ["wbraid", true],
  ]);

  getName(): string {
    return "Google Ad Remover";
  }

  getRewritablePattern(): string {
    return ".*[?&](?:utm_|gad_|gclid=|gbraid=|wbraid=).*";
  }

  private isKeywordToRemove(key: string): boolean {
    // https://support.google.com/google-ads/answer/16193746?hl=en
    // > gad_* parameters are URL parameters that provide aggregate data about your campaigns.
    if (key.startsWith("gad_")) {
      return true;
    }

    return this.utmKeywordsMap.has(key) || this.gadKeywordsMap.has(key);
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);
    const searchParamsKeys = Array.from(u.searchParams.keys());
    searchParamsKeys.forEach((key) => {
      console.log(`Checking key: ${key}`);
      if (this.isKeywordToRemove(key)) {
        console.log(`Removing key: ${key}`);
        u.searchParams.delete(key);
      }
    });

    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }
    return url2;
  }
}
