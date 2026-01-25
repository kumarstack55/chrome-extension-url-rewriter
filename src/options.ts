// Language and country pair
interface LanguageCountryPair {
  language: string;
  country: string;
}

// Default settings
interface Settings {
  languageCountryPairs: LanguageCountryPair[];
}

const DEFAULT_SETTINGS: Settings = {
  languageCountryPairs: [
    { language: "ja", country: "JP" },
    { language: "en", country: "US" },
  ],
};

// Load settings
async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      resolve(items as Settings);
    });
  });
}

// Save settings
async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}

// Create list item
function createListItem(pair: LanguageCountryPair, index: number): HTMLElement {
  const li = document.createElement("li");
  li.className = "pair-item";
  li.draggable = true;
  li.dataset.index = index.toString();

  li.innerHTML = `
    <span class="drag-handle">⋮⋮</span>
    <input type="text" class="language-input" value="${pair.language}" placeholder="Language (e.g., ja)">
    <input type="text" class="country-input" value="${pair.country}" placeholder="Country (e.g., JP)">
    <button type="button" class="delete-button">Delete</button>
  `;

  // Delete button event
  const deleteButton = li.querySelector(".delete-button") as HTMLButtonElement;
  deleteButton.addEventListener("click", () => {
    li.remove();
  });

  // Drag events
  li.addEventListener("dragstart", handleDragStart);
  li.addEventListener("dragover", handleDragOver);
  li.addEventListener("drop", handleDrop);
  li.addEventListener("dragend", handleDragEnd);

  return li;
}

// Drag and drop handlers
let draggedElement: HTMLElement | null = null;

function handleDragStart(e: DragEvent): void {
  draggedElement = e.currentTarget as HTMLElement;
  draggedElement.classList.add("dragging");
  e.dataTransfer!.effectAllowed = "move";
}

function handleDragOver(e: DragEvent): void {
  e.preventDefault();
  e.dataTransfer!.dropEffect = "move";

  const targetElement = e.currentTarget as HTMLElement;
  if (draggedElement && targetElement !== draggedElement) {
    const list = targetElement.parentElement!;
    const targetRect = targetElement.getBoundingClientRect();
    const middleY = targetRect.top + targetRect.height / 2;

    if (e.clientY < middleY) {
      list.insertBefore(draggedElement, targetElement);
    } else {
      list.insertBefore(draggedElement, targetElement.nextSibling);
    }
  }
}

function handleDrop(e: DragEvent): void {
  e.preventDefault();
}

function handleDragEnd(e: DragEvent): void {
  draggedElement?.classList.remove("dragging");
  draggedElement = null;
}

// Initialize UI
async function initializeUI(): Promise<void> {
  const settings = await loadSettings();
  const list = document.getElementById("pairs-list") as HTMLUListElement;
  list.innerHTML = "";

  settings.languageCountryPairs.forEach((pair, index) => {
    const li = createListItem(pair, index);
    list.appendChild(li);
  });
}

// Add new pair
function handleAdd(): void {
  const list = document.getElementById("pairs-list") as HTMLUListElement;
  const index = list.children.length;
  const li = createListItem({ language: "", country: "" }, index);
  list.appendChild(li);
}

// Save settings
async function handleSave(): Promise<void> {
  const list = document.getElementById("pairs-list") as HTMLUListElement;
  const pairs: LanguageCountryPair[] = [];

  Array.from(list.children).forEach((li) => {
    const languageInput = li.querySelector(
      ".language-input",
    ) as HTMLInputElement;
    const countryInput = li.querySelector(".country-input") as HTMLInputElement;

    const language = languageInput.value.trim();
    const country = countryInput.value.trim();

    if (language && country) {
      pairs.push({ language, country });
    }
  });

  if (pairs.length === 0) {
    showMessage("Please set at least one language-country pair", "error");
    return;
  }

  await saveSettings({ languageCountryPairs: pairs });
  showMessage("Settings saved successfully", "success");
}

// Reset settings
async function handleReset(): Promise<void> {
  await saveSettings(DEFAULT_SETTINGS);
  await initializeUI();
  showMessage("Settings reset successfully", "success");
}

// Show message
function showMessage(text: string, type: "success" | "error"): void {
  const message = document.getElementById("message") as HTMLElement;
  message.textContent = text;
  message.className = `message ${type}`;
  setTimeout(() => {
    message.textContent = "";
    message.className = "message";
  }, 3000);
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded event fired in options.ts");
  await initializeUI();

  const addButton = document.getElementById("add") as HTMLButtonElement;
  const saveButton = document.getElementById("save") as HTMLButtonElement;
  const resetButton = document.getElementById("reset") as HTMLButtonElement;

  addButton.addEventListener("click", handleAdd);
  saveButton.addEventListener("click", handleSave);
  resetButton.addEventListener("click", handleReset);
});
