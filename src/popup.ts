import { RewriterFactory, Result, ResultSet } from "./lib/rewriter-factory.js";

const rewriterFactory = RewriterFactory.create();

function updatePopupContent(
  resultSet: ResultSet,
  title: string | undefined
): void {
  const results = resultSet.getResults();
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

  console.log(resultSet);
  updatePopupContent(resultSet, title);
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
