"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

interface ChatMessage {
  user: string;
  message: string;
  timestamp: string;
}

const BACKEND_URL = "https://mychatapp-backend-yrvv.onrender.com";
const socket = io(BACKEND_URL, {
  transports: ["websocket"],
});

export default function Chat() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<string[]>([]);

  const currentUser =
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || ""
      : "";

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    socket.emit("join", currentUser);

    socket.on("private_message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("update-online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("registered-users", (users: string[]) => {
      setRegisteredUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, router]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !recipient.trim()) return;

    const newMessage: ChatMessage = {
      user: currentUser,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("private_message", {
      to: recipient,
      from: currentUser,
      message: inputMessage,
    });

    setInputMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <main className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto">
        {/* Top Row: Users + Logout */}
        <div className="flex items-center justify-between mb-4">
          <div className="mb-2">
            <h2 className="text-xl font-bold">Users</h2>
            <p className="text-sm text-gray-300 mt-1">You: <span className="font-semibold">{currentUser}</span></p>
          </div>

          <button
            className="bg-red-700 text-white text-sm px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col justify-between items-start mb-4">
          <h1 className="text-3xl font-bold mb-1">ChitChat</h1>
          {recipient && (
            <p className="text-lg text-gray-700">
              Chatting with: <span className="font-semibold text-blue-600">{recipient}</span>
               </p>
               )}
            </div>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded text-black"
            placeholder="Enter username"
          />
        </div>

        {registeredUsers.map((user, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded mb-2 ${
              recipient === user ? "bg-blue-600" : "bg-gray-700"
            } cursor-pointer`}
            onClick={() => setRecipient(user)}
          >
            <span>{user}</span>
            <span
              className={`h-3 w-3 rounded-full ${
                onlineUsers.includes(user) ? "bg-green-400" : "bg-gray-500"
              }`}
            ></span>
          </div>
        ))}
      </aside>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">ChitChat</h1>
        </div>

        <div className="flex-1 border rounded p-4 mb-4 bg-white overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.user === currentUser ? "text-right" : "text-left"
              }`}
            >
              <p className="text-sm text-gray-500">
                {msg.user === currentUser ? "You" : msg.user} @ {msg.timestamp}
              </p>
              <p className="bg-gray-200 inline-block rounded px-3 py-1 mt-1">
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
