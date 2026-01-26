import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatInput({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Input
        type="text"
        placeholder="Tanya perbaikan Aerox..."
        className="h-14 bg-[#090b11] border-gray-800 rounded-xl pr-14 text-gray-200 placeholder:text-gray-600 focus-visible:ring-blue-500/20"
      />
      <Button
        size="icon"
        className="absolute right-2 h-10 w-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all active:scale-95"
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
