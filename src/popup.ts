class UrlRewriterError extends Error {}

class UrlRewriter {
  getName(): string {
    throw new UrlRewriterError("Not implemented");
  }

  getRewritablePattern(): string {
    throw new UrlRewriterError("Not implemented");
  }

  rewriteUrl(url: string): string | null {
    throw new UrlRewriterError("Not implemented");
  }
}

class AmazonCoJpRewriter extends UrlRewriter {
  getName(): string {
    return "Amazon.co.jp Rewriter";
  }

  getRewritablePattern(): string {
    return "^https://www\\.amazon\\.co\\.jp/";
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);

    const pathname = u.pathname;

    const m = pathname.match(/\/dp\/\w+/);
    if (!m) {
      return null;
    }

    const hostname = u.hostname;
    const dpAsin = m[0];
    return `https://${hostname}${dpAsin}/`;
  }
}

class SupportGoogleComRewriter extends UrlRewriter {
  getName(): string {
    return "support.google.com Language Switcher";
  }

  getRewritablePattern(): string {
    return "^https://support\\.google\\.com/";
  }

  rewriteUrl(url: string): string | null {
    const HL = "hl";

    const u = new URL(url);
    if (u.searchParams.has(HL)) {
      const value = u.searchParams.get(HL);
      let newValue = "en";
      if (value === "en") {
        newValue = "ja";
      }
      u.searchParams.set(HL, newValue);
    }
    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }

    return url2;
  }
}

class XDotComRewriter extends UrlRewriter {
  getName(): string {
    return "X.com Rewriter";
  }

  getRewritablePattern(): string {
    return "^https://x\\.com/";
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);
    u.searchParams.delete("s");
    return u.toString();
  }
}

class GadRemoverRewriter extends UrlRewriter {
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

class LanguageCountryRewriter extends UrlRewriter {
  getName(): string {
    return "Language Country Switcher";
  }

  getRewritablePattern(): string {
    return "/[a-z]{2}-[A-Za-z]{2}/";
  }

  private isLanguageCountry(part: string): boolean {
    try {
      const [canon] = Intl.getCanonicalLocales(String(part).replace("_", "-"));
      return /^[a-z]{2,3}-[A-Z]{2}$/.test(canon);
    } catch {
      return false;
    }
  }

  private ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private isUcFirst(str: string): boolean {
    const firstChar = str.charAt(0);
    const rest = str.slice(1);
    return firstChar === firstChar.toUpperCase() && rest === rest.toLowerCase();
  }

  private isLower(str: string): boolean {
    return str === str.toLowerCase();
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);
    const pathname = u.pathname;

    const pathParts = pathname.split("/");
    const newPathParts = pathParts.map((part) => {
      if (this.isLanguageCountry(part)) {
        console.log(`Found language-country part: ${part}`);

        const [lang, country] = part.split("-");

        let newLang = "en";
        let newCountry = "US";
        if (part.toLocaleLowerCase() === "en-us") {
          newLang = "ja";
          newCountry = "JP";
        }

        if (this.isLower(lang)) {
          newLang = newLang.toLowerCase();
        } else if (this.isUcFirst(lang)) {
          newLang = this.ucFirst(newLang);
        } else {
          newLang = newLang.toUpperCase();
        }

        if (this.isLower(country)) {
          newCountry = newCountry.toLowerCase();
        } else if (this.isUcFirst(country)) {
          newCountry = this.ucFirst(newCountry);
        } else {
          newCountry = newCountry.toUpperCase();
        }

        return `${newLang}-${newCountry}`;
      }

      return part;
    });

    u.pathname = newPathParts.join("/");

    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }
    return url2;
  }
}

class LanguageRewriter extends UrlRewriter {
  // ISO 639-1 (2-letter) codes
  private readonly ISO639_1: Set<string> = new Set([
    "aa",
    "ab",
    "ae",
    "af",
    "ak",
    "am",
    "an",
    "ar",
    "as",
    "av",
    "ay",
    "az",
    "ba",
    "be",
    "bg",
    "bh",
    "bi",
    "bm",
    "bn",
    "bo",
    "br",
    "bs",
    "ca",
    "ce",
    "ch",
    "co",
    "cr",
    "cs",
    "cu",
    "cv",
    "cy",
    "da",
    "de",
    "dv",
    "dz",
    "ee",
    "el",
    "en",
    "eo",
    "es",
    "et",
    "eu",
    "fa",
    "ff",
    "fi",
    "fj",
    "fo",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gn",
    "gu",
    "gv",
    "ha",
    "he",
    "hi",
    "ho",
    "hr",
    "ht",
    "hu",
    "hy",
    "hz",
    "ia",
    "id",
    "ie",
    "ig",
    "ii",
    "ik",
    "io",
    "is",
    "it",
    "iu",
    "ja",
    "jv",
    "ka",
    "kg",
    "ki",
    "kj",
    "kk",
    "kl",
    "km",
    "kn",
    "ko",
    "kr",
    "ks",
    "ku",
    "kv",
    "kw",
    "ky",
    "la",
    "lb",
    "lg",
    "li",
    "ln",
    "lo",
    "lt",
    "lu",
    "lv",
    "mg",
    "mh",
    "mi",
    "mk",
    "ml",
    "mn",
    "mr",
    "ms",
    "mt",
    "my",
    "na",
    "nb",
    "nd",
    "ne",
    "ng",
    "nl",
    "nn",
    "no",
    "nr",
    "nv",
    "ny",
    "oc",
    "oj",
    "om",
    "or",
    "os",
    "pa",
    "pi",
    "pl",
    "ps",
    "pt",
    "qu",
    "rm",
    "rn",
    "ro",
    "ru",
    "rw",
    "sa",
    "sc",
    "sd",
    "se",
    "sg",
    "si",
    "sk",
    "sl",
    "sm",
    "sn",
    "so",
    "sq",
    "sr",
    "ss",
    "st",
    "su",
    "sv",
    "sw",
    "ta",
    "te",
    "tg",
    "th",
    "ti",
    "tk",
    "tl",
    "tn",
    "to",
    "tr",
    "ts",
    "tt",
    "tw",
    "ty",
    "ug",
    "uk",
    "ur",
    "uz",
    "ve",
    "vi",
    "vo",
    "wa",
    "wo",
    "xh",
    "yi",
    "yo",
    "za",
    "zh",
    "zu",
  ]);

  getName(): string {
    return "Language Switcher";
  }

  getRewritablePattern(): string {
    return "/[A-Za-z]{2}/";
  }

  private ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private isUcFirst(str: string): boolean {
    const firstChar = str.charAt(0);
    const rest = str.slice(1);
    return firstChar === firstChar.toUpperCase() && rest === rest.toLowerCase();
  }

  private isLower(str: string): boolean {
    return str === str.toLowerCase();
  }

  rewriteUrl(url: string): string | null {
    const u = new URL(url);
    const pathname = u.pathname;

    const pathParts = pathname.split("/");
    const newPathParts = pathParts.map((part) => {
      console.log(`Checking part: ${part}`);

      const lowerPart = part.toLowerCase();
      if (this.ISO639_1.has(lowerPart)) {
        console.log(`Found language part: ${part}`);

        let newLang = "en";
        if (part === "en") {
          newLang = "ja";
        }

        if (this.isLower(part)) {
          newLang = newLang.toLowerCase();
        } else if (this.isUcFirst(part)) {
          newLang = this.ucFirst(newLang);
        } else {
          newLang = newLang.toUpperCase();
        }
        return newLang;
      }

      return part;
    });

    u.pathname = newPathParts.join("/");

    const url2 = u.toString();
    if (url2 === url) {
      return null;
    }
    return url2;
  }
}

class NoopRewriter extends UrlRewriter {
  getName(): string {
    return "Original URL";
  }

  getRewritablePattern(): string {
    return "^.*";
  }

  rewriteUrl(url: string): string | null {
    return url;
  }
}

class Result {
  private name: string;
  private url: string;
  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  getName(): string {
    return this.name;
  }

  getUrl(): string {
    return this.url;
  }
}

class ResultSet {
  private results: Result[];

  constructor(results: Result[]) {
    this.results = results;
  }

  isEmpty(): boolean {
    return this.results.length === 0;
  }

  getResults(): Result[] {
    return this.results;
  }
}

class RewriterMatcher {
  private rewriters: Map<RegExp, UrlRewriter>;
  constructor(rewriters: Map<RegExp, UrlRewriter>) {
    this.rewriters = rewriters;
  }

  match(url: string): ResultSet {
    const results: Result[] = [];

    this.rewriters.forEach((rewriter, pattern) => {
      if (pattern.test(url)) {
        const rewrittenUrl = rewriter.rewriteUrl(url);
        if (rewrittenUrl === null) {
          return;
        }
        const result = new Result(rewriter.getName(), rewrittenUrl);
        results.push(result);
      }
    });

    return new ResultSet(results);
  }
}

class RewriterFactory {
  private rewriters: Map<RegExp, UrlRewriter>;

  constructor() {
    this.rewriters = new Map<RegExp, UrlRewriter>();
  }

  addRewriter(rewriter: UrlRewriter): void {
    const pattern = rewriter.getRewritablePattern();
    const re = new RegExp(pattern);
    this.rewriters.set(re, rewriter);
  }

  getRewriterMatcher(): RewriterMatcher {
    return new RewriterMatcher(this.rewriters);
  }
}

const rewriterFactory = new RewriterFactory();
rewriterFactory.addRewriter(new AmazonCoJpRewriter());
rewriterFactory.addRewriter(new XDotComRewriter());
rewriterFactory.addRewriter(new SupportGoogleComRewriter());
rewriterFactory.addRewriter(new GadRemoverRewriter());
rewriterFactory.addRewriter(new LanguageCountryRewriter());
rewriterFactory.addRewriter(new LanguageRewriter());
rewriterFactory.addRewriter(new NoopRewriter());

function updatePopupContent(
  results: Result[],
  title: string | undefined
): void {
  const urlList = document.getElementById("url-list") as HTMLElement;
  if (!urlList) {
    console.error("URL list element not found in popup.");
    return;
  }
  urlList.innerHTML = "";

  const messageElement = document.getElementById("message") as HTMLElement;
  if (!messageElement) {
    console.error("Message element not found in popup.");
    return;
  }
  messageElement.innerHTML = "";

  if (results.length === 0) {
    messageElement.className = "no-rewriter-message";
    messageElement.textContent = "No rewriter found for this URL.";
    return;
  }

  results.forEach((result) => {
    const url = result.getUrl();
    const name = result.getName();
    const nameAndUrlLength = `${name} (${url.length} chars)`;

    // Create container for each URL
    const container = document.createElement("div");
    container.className = "url-container";

    // Create name label
    const nameLabel = document.createElement("div");
    nameLabel.className = "url-name";
    nameLabel.textContent = nameAndUrlLength;
    container.appendChild(nameLabel);

    // Create URL link
    const urlLink = document.createElement("a");
    urlLink.className = "url-display";
    urlLink.href = url;
    urlLink.textContent = url;
    urlLink.target = "_blank";
    container.appendChild(urlLink);

    // Create copy button
    const copyUrlBtn = document.createElement("button");
    copyUrlBtn.className = "copy-btn";
    copyUrlBtn.textContent = "🔗";
    copyUrlBtn.title = "Copy to clipboard";
    container.appendChild(copyUrlBtn);

    // Create copy text button
    const copyTextBtn = document.createElement("button");
    copyTextBtn.className = "copy-btn";
    copyTextBtn.textContent = "📋";
    copyTextBtn.title = "Copy title and url as text";
    container.appendChild(copyTextBtn);

    // Create copy markdown button
    const copyMarkdownBtn = document.createElement("button");
    copyMarkdownBtn.className = "copy-btn";
    copyMarkdownBtn.textContent = "📝";
    copyMarkdownBtn.title = "Copy title and url as Markdown";
    container.appendChild(copyMarkdownBtn);

    // Create copy message
    const copyMessage = document.createElement("div");
    copyMessage.className = "copy-message";
    copyMessage.textContent = "Copied!";
    copyMessage.style.display = "none";
    container.appendChild(copyMessage);

    // Add copy functionality
    copyTextToClipboardAndShowCopyMessage(copyUrlBtn, copyMessage, url);

    // Add copy text functionality
    const title2 = title || "No Title";
    const text = `${title2}\n${url}`;
    copyTextToClipboardAndShowCopyMessage(copyTextBtn, copyMessage, text);

    // Add copy markdwon functionality
    const markdownLink = `[${title2}](${url})`;
    copyTextToClipboardAndShowCopyMessage(
      copyMarkdownBtn,
      copyMessage,
      markdownLink
    );

    urlList.appendChild(container);
  });
}

function copyTextToClipboardAndShowCopyMessage(
  copyBtn: HTMLElement,
  copyMessage: HTMLElement,
  text: string
): void {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(text).then(() => {
      copyMessage.style.display = "block";
      setTimeout(() => {
        copyMessage.style.display = "none";
      }, 2000);
    });
  });
}

function tryRewriteUrlAndUpdatePopup(
  url: string,
  title: string | undefined
): void {
  const rewriterMatcher = rewriterFactory.getRewriterMatcher();
  const resultSet = rewriterMatcher.match(url);

  const results = resultSet.getResults();
  console.log(results);
  updatePopupContent(results, title);
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  const activeTabUrl = activeTab.url;
  console.log(activeTabUrl);

  const title: string | undefined = activeTab.title;

  if (!activeTabUrl) {
    console.log("No active tab URL found.");
    return;
  }

  tryRewriteUrlAndUpdatePopup(activeTabUrl, title);
});
