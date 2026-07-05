"use client";
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

export default function ChatThread({
  currentUserId,
  otherUserId,
  bookingId,
}: {
  currentUserId: string;
  otherUserId: string;
  bookingId?: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Gagal ambil pesan:", error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);

      // Tandai pesan masuk sebagai dibaca
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", otherUserId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);
    }

    fetchMessages();

    const channel = supabase
      .channel(`chat-${[currentUserId, otherUserId].sort().join("-")}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          const isRelevant =
            (msg.sender_id === currentUserId && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === currentUserId);
          if (isRelevant) {
            setMessages((prev) => [...prev, msg]);
            if (msg.sender_id === otherUserId) {
              supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: otherUserId,
      booking_id: bookingId || null,
      content,
    });

    if (error) {
      console.error("Gagal kirim pesan:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-[#8ABDB5] mt-6">
            Belum ada pesan. Mulai percakapan sekarang.
          </p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                <div
                  className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    isMine
                      ? "bg-[#1CABB4] text-white rounded-br-sm"
                      : "bg-[#EAF5E4] text-[#1A3A3C] rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[10px] text-[#8ABDB5] px-1">
                  {new Date(m.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-[#EAF5E4] flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Tulis pesan..."
          className="flex-1 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] placeholder:text-[#8ABDB5]"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-9 h-9 bg-[#1CABB4] disabled:bg-[#D4EAC8] text-white rounded-xl flex items-center justify-center hover:bg-[#178E96] transition-colors flex-shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </>
  );
}