class UrlRewriterError extends Error {
}

class UrlRewriter {
  getName(): string {
    throw new UrlRewriterError("Not implemented");
  }

  getRewritablePattern(): string {
    throw new UrlRewriterError("Not implemented");
  }

  rewriteUrl(url: string): string {
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

  rewriteUrl(url: string): string {
    const u = new URL(url);

    const pathname = u.pathname;

    const m = pathname.match(/\/dp\/\w+/);
    if (!m) {
      return url;
    }

    const hostname = u.hostname;
    const dpAsin = m[0];
    return `https://${hostname}${dpAsin}/`;
  }
}

class UrchinRemoverRewriter extends UrlRewriter {
  getName(): string {
    return "Urchin Remover Rewriter";
  }

  getRewritablePattern(): string {
    return ".*[?&]utm_.*";
  }

  rewriteUrl(url: string): string {
    const u = new URL(url);

    // https://support.google.com/analytics/answer/11242870?hl=en
    u.searchParams.delete('utm_source');
    u.searchParams.delete('utm_medium');
    u.searchParams.delete('utm_campaign');
    u.searchParams.delete('utm_term');
    u.searchParams.delete('utm_content');
    u.searchParams.delete('utm_source_platform');
    u.searchParams.delete('utm_creative_format');
    u.searchParams.delete('utm_marketing_tactic');

    return u.toString();
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
        if (rewrittenUrl === url) {
          return;
        }
        results.push(new Result(rewriter.getName(), rewrittenUrl));
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

function getRewritedUrl(url: string): string | null {
  const rewriterFactory = new RewriterFactory();
  rewriterFactory.addRewriter(new AmazonCoJpRewriter());
  rewriterFactory.addRewriter(new UrchinRemoverRewriter());

  const rewriterMatcher = rewriterFactory.getRewriterMatcher();
  const resultSet = rewriterMatcher.match(url);

  if (resultSet.isEmpty()) {
    return null;
  }

  // Return the first rewritten URL
  return resultSet.getResults()[0].getUrl();
}

function updatePopupContent(url: string): void {
  const urlDisplay = document.getElementById('url-display') as HTMLAnchorElement;
  urlDisplay.href = url;
  urlDisplay.textContent = url;

  const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
  const copyMessage = document.getElementById('copy-message') as HTMLElement;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(url).then(() => {
      copyMessage.style.display = 'block';
      setTimeout(() => {
        copyMessage.style.display = 'none';
      }, 2000);
    });
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];
  const activeTabUrl = activeTab.url;
  console.log(activeTabUrl);

  if (!activeTabUrl) {
    console.log("No active tab URL found.");
    return;
  }

  const url = getRewritedUrl(activeTabUrl);
  if (!url) {
    console.log("No rewriter found for this URL.");
    return;
  }
  console.log(url);

  updatePopupContent(url);
});
