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
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl shadow-sm transition-all",
          isUser
            ? "bg-blue-600 rounded-tr-none"
            : "bg-[#0f121a] border border-gray-800 rounded-tl-none"
        )}
      >
        <p className="text-sm text-white leading-relaxed">{content}</p>

        <div className="flex items-center justify-between mt-2 gap-4">
          <span className="text-[10px] text-slate-300 opacity-60 uppercase font-bold tabular-nums">
            {timestamp}
          </span>

          {pageReference && (
            <button
              onClick={() => onReferenceClick?.(pageReference)}
              className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-blue-400 border border-slate-700 transition-colors active:scale-95"
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
