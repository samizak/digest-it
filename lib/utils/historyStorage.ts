import { HistoryEntry } from "../types/historyTypes";

const HISTORY_KEY = "digestItHistory";

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return []; // Don't run on server
  }
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as HistoryEntry[];
    // Basic validation (can be improved)
    if (!Array.isArray(parsed)) {
      console.error("Invalid history data found in local storage. Clearing.");
      localStorage.removeItem(HISTORY_KEY);
      return [];
    }
    return parsed.sort((a, b) => b.timestamp - a.timestamp); // Show newest first
  } catch (error) {
    console.error("Failed to load history from local storage:", error);
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]) {
  if (typeof window === "undefined") {
    return; // Don't run on server
  }
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to local storage:", error);
  }
}

export function addHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const currentHistory = loadHistory();
  // Prevent duplicates based on URL
  const existingIndex = currentHistory.findIndex(
    (item) => item.url === entry.url
  );
  if (existingIndex !== -1) {
    // Update existing entry's timestamp and summary
    currentHistory[existingIndex] = entry;
  } else {
    currentHistory.push(entry);
  }
  // Optional: Limit history size
  const maxHistorySize = 50;
  if (currentHistory.length > maxHistorySize) {
    currentHistory.sort((a, b) => b.timestamp - a.timestamp);
    currentHistory.length = maxHistorySize;
  }

  saveHistory(currentHistory);
  return loadHistory(); // Return the updated, sorted history
}

export function clearHistory() {
  if (typeof window === "undefined") {
    return; // Don't run on server
  }
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from local storage:", error);
  }
}
