"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import HomeNavbar from "@/components/HomeNavbar";
import { useRouter } from "next/navigation";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function ChatPage() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef<any>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // ================== AUTH CHECK ==================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  // ================== LOAD CHATS FROM BACKEND (USER WISE) ==================
  useEffect(() => {
    const loadChatsFromDB = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/ai/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedChat: Chat = {
            id: Date.now(),
            title: "Previous Chat",
            messages: data.flatMap((c: any) => [
              {
                id: Date.now() + Math.random(),
                text: c.message,
                sender: "user",
              },
              {
                id: Date.now() + Math.random(),
                text: c.reply,
                sender: "ai",
              },
            ]),
          };

          setChats([formattedChat]);
          setActiveChatId(formattedChat.id);
        } else {
          createDefaultChat();
        }
      } catch (err) {
        console.log("Failed to load chats");
        createDefaultChat();
      }
    };

    loadChatsFromDB();
  }, []);

  // ================== DEFAULT CHAT ==================
  const createDefaultChat = () => {
    const id = Date.now();
    const newChat: Chat = {
      id,
      title: "New Chat",
      messages: [
        {
          id: Date.now(),
          text: "Hi 👋, I am your Career AI assistant. How can I help you?",
          sender: "ai",
        },
      ],
    };

    setChats([newChat]);
    setActiveChatId(id);
  };

  // ================== VOICE RECOGNITION ==================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);

        recognitionRef.current.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (event.results[event.results.length - 1].isFinal) {
            setInput(transcript);
          }
        };

        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
  }, []);

  // ================== MIC BUTTON ==================
  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported");
      return;
    }

    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  // ================== NEW CHAT ==================
  const handleNewChat = () => {
    createDefaultChat();
  };

  // ================== TEXT TO SPEECH ==================
  const speakText = (text: string) => {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  // ================== SEND MESSAGE ==================
  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeChatId) return;

    const userText = input;

    const userMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: "user",
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: chat.title === "New Chat" ? userText.slice(0, 25) : chat.title,
              messages: [...chat.messages, userMsg],
            }
          : chat
      )
    );

    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "AI error");

      const aiMsg: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMsg] }
            : chat
        )
      );

      speakText(aiMsg.text);
    } catch (err) {
      const errMsg: Message = {
        id: Date.now(),
        text: "⚠️ AI server error. Please try again.",
        sender: "ai",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, errMsg] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <HomeNavbar />

      <div className="min-h-screen bg-black flex">
        {/* ===== SIDEBAR ===== */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"
            >
              + New Chat
            </button>
          </div>

          <div className="px-4 mb-3">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider">
              History
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`px-4 py-3 rounded-lg cursor-pointer text-sm truncate ${
                  chat.id === activeChatId
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {chat.title}
              </div>
            ))}
          </div>
        </div>

        {/* ===== MAIN CHAT ===== */}
        <div className="flex-1 flex justify-center items-center px-4">
          <div className="w-full max-w-3xl h-[85vh] bg-zinc-900 rounded-2xl flex flex-col border border-zinc-800">
            <div className="p-4 border-b border-zinc-800 text-lg font-semibold">
              🤖 Career.AI Assistant
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat &&
                activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-zinc-800 text-white rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

              {isLoading && (
                <div className="text-sm text-gray-400">AI is typing...</div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your career..."
                className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isListening}
              />

              <button
                onClick={handleMicClick}
                className={`px-4 py-2 rounded-lg ${
                  isListening ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>

              <button
                onClick={handleSend}
                className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
