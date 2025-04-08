import { SummaryData } from "./summaryTypes";

export interface HistoryEntry {
  id: string; // Unique ID, could be timestamp + url hash
  url: string;
  title: string; // Extracted from summary or URL
  timestamp: number; // Unix timestamp
  summary: SummaryData;
}
