"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface ChatMessage {
  user: string;
  message: string;
}

const socket = io("https://mychatapp-backend-yrvv.onrender.com",{
  transports: ["websocket"],
});

export default function Chat() {
  const router = useRouter();

  const [socket, setSocket] = useState<Socket | null>(null);
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

    const newSocket = io("ws://localhost:3001", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      newSocket.emit("join", currentUser);
    });

    newSocket.on("private_message", (data: ChatMessage) => {
      if (data.user !== currentUser) {
        setMessages((prev) => [...prev, data]);
      }
    });

    newSocket.on("update-online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    newSocket.on("registered-users", (users: string[]) => {
      setRegisteredUsers(users);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, router]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !recipient.trim()) return;

    const newMessage: ChatMessage = {
      user: currentUser,
      message: inputMessage,
    };

    setMessages((prev) => [...prev, newMessage]);

    socket?.emit("private_message", {
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
    <main className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>

        {/* Chat With Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Chat with (username):
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded text-black"
            placeholder="Enter recipient username"
          />
        </div>

        {/* User List */}
        {registeredUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-700 p-2 rounded mb-2"
          >
            <span>{user}</span>
            <span
              className={`h-3 w-3 rounded-full ${
                onlineUsers.includes(user)
                  ? "bg-green-400"
                  : "bg-gray-500"
              }`}
            ></span>
          </div>
        ))}
      </aside>

      {/* Main Chat Section */}
      <div className="flex-1 max-w-2xl mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">MyChatApp</h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="border p-4 mb-4 h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.user === currentUser ? "You" : msg.user}:</strong>{" "}
              {msg.message}
            </p>
          ))}
        </div>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 border rounded"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <button
          className="mt-2 bg-blue-500 text-white p-2 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </main>
  );
}
