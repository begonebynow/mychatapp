"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // ✅ Auto-redirect if already logged in
    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            router.push("/chat");
        }
    }, []);

    const handleLogin = () => {
        const storedUser = localStorage.getItem("chatUser");

        if (!storedUser) {
            setError("No user registered. Please register first.");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.username !== username || user.password !== password) {
            setError("Invalid username or password.");
            return;
        }

        // ✅ Login successful
        localStorage.setItem("currentUser", username);
        router.push("/chat");
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

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

            <label className="w-52 block text-sm font-medium text-gray-700 mb-1">
                Password
            </label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 p-2 border rounded w-52"
            />

            <button
                className="bg-blue-500 text-white p-2 rounded mt-4 w-52"
                onClick={handleLogin}
            >
                Login
            </button>

            <button
                className="bg-gray-200 text-blue-700 p-2 rounded mt-4 w-52"
                onClick={() => router.push("/register")}
            >
                New User? Register
            </button>

            <button
                className="bg-gray-200 text-blue-700 p-2 rounded mt-2 w-52"
                onClick={() => router.push("/forgot-password")}
            >
                Forgot Password?
            </button>
        </main>
    );
}
