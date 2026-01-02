class UrlRewriter {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  rewrite(): string {
    return this.url;
  }
}

class AmazonCoJpRewriter extends UrlRewriter {
  rewrite(): string {
    const u = new URL(this.url);

    const pathname = u.pathname;

    const m = pathname.match(/\/dp\/\w+/);
    if (m) {
      const hostname = u.hostname;
      const dpAsin = m[0];
      return `https://${hostname}${dpAsin}/`;
    }

    return this.url;
  }
}

class RewriterFactory {
  private rewriters: Map<RegExp, typeof UrlRewriter>;

  constructor() {
    this.rewriters = new Map();
  }

  addRewriter(urlPattern: string, rewriterClass: typeof UrlRewriter): void {
    const re = new RegExp(urlPattern);
    this.rewriters.set(re, rewriterClass);
  }

  getRewriter(url: string): UrlRewriter | null {
    for (const [re, rewriterClass] of this.rewriters) {
      if (re.test(url)) {
        return new rewriterClass(url);
      }
    }
    return null;
  }
}

function getRewritedUrl(url: string): string | null {
  const rewriterFactory = new RewriterFactory();
  rewriterFactory.addRewriter(/^https:\/\/www\.amazon\.co\.jp\/.+/.source, AmazonCoJpRewriter);

  const rewriter = rewriterFactory.getRewriter(url);
  if (!rewriter) {
    return null;
  }
  return rewriter.rewrite();
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
