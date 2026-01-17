import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatInput({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Input
        type="text"
        placeholder="Tanya perbaikan Aerox..."
        className="h-14 rounded-xl border-gray-800 bg-[#090b11] pr-14 text-gray-200 placeholder:text-gray-600 focus-visible:ring-blue-500/20"
      />
      <Button
        size="icon"
        className="absolute right-2 h-10 w-10 rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95"
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
