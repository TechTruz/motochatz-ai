import { Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  className?: string;
  onSend?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ className, onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend?.(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Input
        type="text"
        placeholder="Tanya perbaikan Aerox..."
        className="h-14 rounded-xl border-gray-800 bg-[#090b11] pr-14 text-gray-200 placeholder:text-gray-600 focus-visible:ring-blue-500/20"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className="absolute right-2 h-10 w-10 rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
