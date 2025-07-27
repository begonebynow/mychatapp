"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleRegister = () => {
        setError("");
        setSuccess("");

        if (!username || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const storedUsers = localStorage.getItem("chatUsers");
        const users = storedUsers ? JSON.parse(storedUsers) : [];

        const userExists = users.find((u: { username: string }) => u.username === username);
        if (userExists) {
            setError("User already exists. Please login.");
            return;
        }

        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem("chatUsers", JSON.stringify(users));
        localStorage.setItem("currentUser", username);

        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => router.push("/chat"), 1000);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}
            <label className="w-64 block text-sm font-medium text-gray-700 mb-1">
                Username
            </label>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2 p-2 border rounded w-64"
            />
<label className="w-64 block text-sm font-medium text-gray-700 mb-1">
                Password
            </label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 p-2 border rounded w-64"
            />
<label className="w-64 block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
            </label>
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 p-2 border rounded w-64"
            />

            <button
                className="bg-blue-500 text-white p-2 rounded w-64"
                onClick={handleRegister}
            >
                Register
            </button>

            <button
                className="bg-gray-200 text-blue-700 p-2 rounded mt-4   w-64"
                onClick={() => router.push("/login")}


            >                Already have an account? Login
            </button>
    </main>
    );
}