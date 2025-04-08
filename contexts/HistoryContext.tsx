"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { HistoryEntry } from "@/lib/types/historyTypes";
import {
  loadHistory,
  addHistoryEntry as saveEntry,
  clearHistory as clearStorage,
} from "@/lib/utils/historyStorage";

interface HistoryContextType {
  history: HistoryEntry[];
  selectedEntry: HistoryEntry | null;
  addHistoryEntry: (entry: HistoryEntry) => void;
  selectHistoryEntry: (entry: HistoryEntry | null) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addEntry = (entry: HistoryEntry) => {
    const updatedHistory = saveEntry(entry);
    setHistory(updatedHistory);
    setSelectedEntry(null); // Deselect any historical entry when adding a new one
  };

  const selectEntry = (entry: HistoryEntry | null) => {
    setSelectedEntry(entry);
  };

  const clear = () => {
    clearStorage();
    setHistory([]);
    setSelectedEntry(null);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        selectedEntry,
        addHistoryEntry: addEntry,
        selectHistoryEntry: selectEntry,
        clearHistory: clear,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
