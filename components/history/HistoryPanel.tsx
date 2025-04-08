"use client";

import { useHistory } from "@/contexts/HistoryContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryEntry } from "@/lib/types/historyTypes";
import { Trash2 } from "lucide-react";
import { truncateUrl } from "@/lib/utils/stringUtils";
import { formatDistanceToNow } from "date-fns";

interface HistoryPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function HistoryPanel({
  isOpen,
  onOpenChange,
}: HistoryPanelProps) {
  const { history, selectHistoryEntry, clearHistory, selectedEntry } =
    useHistory();

  const handleSelect = (entry: HistoryEntry) => {
    selectHistoryEntry(entry);
    onOpenChange(false); // Close panel on selection
  };

  const handleClear = () => {
    clearHistory();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
          <SheetDescription>
            View summaries of previously analyzed Reddit threads.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 pr-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No history yet.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <Button
                  key={entry.id}
                  variant={
                    selectedEntry?.id === entry.id ? "secondary" : "ghost"
                  }
                  className="w-full h-auto justify-start text-left p-3 flex flex-col items-start"
                  onClick={() => handleSelect(entry)}
                >
                  <span className="font-medium truncate block w-full">
                    {entry.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate block w-full">
                    {truncateUrl(entry.url, 50)}
                  </span>
                  <span className="text-xs text-muted-foreground/80 block w-full mt-0.5">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
        <SheetFooter className="mt-auto pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={history.length === 0}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
