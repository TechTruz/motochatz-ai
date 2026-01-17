import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  pageReference?: string;
  onReferenceClick?: (page: string) => void;
}

export function ChatBubble({
  role,
  content,
  timestamp,
  pageReference,
  onReferenceClick,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "mb-4 flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 shadow-sm transition-all",
          isUser
            ? "rounded-tr-none bg-blue-600"
            : "rounded-tl-none border border-gray-800 bg-[#0f121a]"
        )}
      >
        <p className="text-sm leading-relaxed text-white">{content}</p>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold text-slate-300 uppercase tabular-nums opacity-60">
            {timestamp}
          </span>

          {pageReference && (
            <button
              onClick={() => onReferenceClick?.(pageReference)}
              className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-blue-400 transition-colors hover:bg-slate-700 active:scale-95"
            >
              <ExternalLink size={10} />
              Hal. {pageReference}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
