import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: string;
  initials: string;
  text: string;
  time: string;
  isMentor?: boolean;
}

const mockMessages: Message[] = [
  { id: "1", sender: "Priya Patel", initials: "PP", text: "Hey team! I just pushed the updated API integration.", time: "2:30 PM" },
  { id: "2", sender: "Dr. Divya Krishnan", initials: "DK", text: "Great work! I'll review the PR tonight.", time: "2:45 PM", isMentor: true },
  { id: "3", sender: "Rohan Mehta", initials: "RM", text: "I'm almost done with the frontend components. Should be ready for review by tomorrow.", time: "3:10 PM" },
  { id: "4", sender: "Priya Patel", initials: "PP", text: "Perfect! Let's sync up tomorrow morning then.", time: "3:15 PM" },
];

export function ChatPanel() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-[400px] bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">Project Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isMentor ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {msg.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">{msg.sender}</span>
                {msg.isMentor && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Mentor</span>
                )}
                <span className="text-[11px] text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-9 text-sm"
        />
        <Button size="icon" className="h-9 w-9 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
