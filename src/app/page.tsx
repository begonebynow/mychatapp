import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100">
      <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-sm mb-4 text-blue-600">Welcome to MyChatApp</h1>
      <p className="text-x1 text-gray-600 max-w-md text-center mb-6">Secure 1-to-1 Chat Made Easy</p>

      <Link href="/login">
        <button className="w-48 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
          Login
        </button>
      </Link>

      <Link href="/register">
        <button className="w-48 mt-4 bg-white border border-blue-500 text-blue-600 px-8 py-3 rounded-lg shadow-md hover:bg-blue-50 transition">
          Register
        </button>
      </Link>
    </main>
  );
}
