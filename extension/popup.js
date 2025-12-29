class UrlRewriter {
  constructor(url) {
    this.url = url;
  }

  rewrite() {
    return this.url;
  }
}

class AmazonCoJpRewriter extends UrlRewriter {
  rewrite() {
    const u = new URL(this.url);

    const pathname = u.pathname

    const m = pathname.match(/\/dp\/\w+/)
    if (m) {
      const hostname = u.hostname;
      const dpAsin = m[0];
      return `https://${hostname}${dpAsin}/`;
    }

    return this.url;
  }
}

class RewriterFactory {
  constructor() {
    this.rewriters = new Map();
  }

  addRewriter(urlPattern, rewriterClass) {
    const re = new RegExp(urlPattern);
    this.rewriters.set(re, rewriterClass);
  }

  getRewriter(url) {
    for (const [re, rewriterClass] of this.rewriters) {
      if (re.test(url)) {
        return new rewriterClass(url);
      }
    }
    return null;
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];
  const activeTabUrl = activeTab.url;
  console.log(activeTabUrl);

  const rewriterFactory = new RewriterFactory();
  rewriterFactory.addRewriter(/^https:\/\/www\.amazon\.co\.jp\/.+/, AmazonCoJpRewriter);

  const rewriter = rewriterFactory.getRewriter(activeTabUrl)
  if (!rewriter) {
    console.log("No rewriter found for this URL.");
    return;
  }
  const url = rewriter.rewrite();
  console.log(url);

  const urlDisplay = document.getElementById('url-display');
  urlDisplay.href = url;
  urlDisplay.textContent = url;

  const copyBtn = document.getElementById('copy-btn');
  const copyMessage = document.getElementById('copy-message');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(url).then(() => {
      copyMessage.style.display = 'block';
      setTimeout(() => {
        copyMessage.style.display = 'none';
      }, 2000);
    });
  });
});
