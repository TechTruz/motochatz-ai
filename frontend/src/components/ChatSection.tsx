import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function ChatSection() {
  return (
    <Card className="border-gray-800 bg-[#0F1729]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <CardTitle className="text-xl text-white">
              Gemini 1.5 Flash (RAG)
            </CardTitle>
          </div>
          <div>
            <CardTitle className="text-xl text-gray-400 italic">
              Connected to: Aerox_Manual.db
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex max-h-[300px] flex-col bg-slate-800">
        <div className="flex-1 space-y-4 overflow-auto p-6">
          <ChatBubble
            role="user"
            content="Bagaimana cara reset indikator oli Aerox?"
            timestamp="10:05 AM"
          />
          <ChatBubble
            role="assistant"
            content="Untuk mereset indikator oli pada Aerox, ikuti langkah-langkah berikut: 1. Nyalakan mesin motor. 2. Tekan dan tahan tombol reset pada panel instrumen selama beberapa detik hingga indikator berkedip. 3. Lepaskan tombol reset dan matikan mesin. 4. Nyalakan kembali mesin untuk memastikan indikator telah terreset."
            timestamp="10:06 AM"
            pageReference="34"
          />
          <ChatBubble
            role="assistant"
            content="Untuk mereset indikator oli pada Aerox, ikuti langkah-langkah berikut: 1. Nyalakan mesin motor. 2. Tekan dan tahan tombol reset pada panel instrumen selama beberapa detik hingga indikator berkedip. 3. Lepaskan tombol reset dan matikan mesin. 4. Nyalakan kembali mesin untuk memastikan indikator telah terreset."
            timestamp="10:06 AM"
            pageReference="34"
          />
          <ChatBubble
            role="assistant"
            content="Untuk mereset indikator oli pada Aerox, ikuti langkah-langkah berikut: 1. Nyalakan mesin motor. 2. Tekan dan tahan tombol reset pada panel instrumen selama beberapa detik hingga indikator berkedip. 3. Lepaskan tombol reset dan matikan mesin. 4. Nyalakan kembali mesin untuk memastikan indikator telah terreset."
            timestamp="10:06 AM"
            pageReference="34"
          />
          <ChatBubble
            role="assistant"
            content="Untuk mereset indikator oli pada Aerox, ikuti langkah-langkah berikut: 1. Nyalakan mesin motor. 2. Tekan dan tahan tombol reset pada panel instrumen selama beberapa detik hingga indikator berkedip. 3. Lepaskan tombol reset dan matikan mesin. 4. Nyalakan kembali mesin untuk memastikan indikator telah terreset."
            timestamp="10:06 AM"
            pageReference="34"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <ChatInput />
        <p className="text-gray-400">INTERNAL SANDBOX ENVIRONMENT</p>
      </CardFooter>
    </Card>
  );
}
