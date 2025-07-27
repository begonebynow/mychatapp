"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForgetPassword = () => {
    const storedUser = localStorage.getItem("chatUser");

    if (!storedUser) {
      setError("No user registered. Please register first.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.username !== username) {
      setError("Username not found.");
      return;
    }

    alert(`Password reset link sent to the email associated with "${username}".`);
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Forget Password</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="w-52 block text-sm font-medium text-gray-700 mb-1">
        Username
      </label>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border rounded w-52"
      />

      <button
        className="bg-blue-500 text-white p-2 rounded mt-4 w-52"
        onClick={handleForgetPassword}
      >
        Send Reset Link
      </button>
    </main>
  );
}

