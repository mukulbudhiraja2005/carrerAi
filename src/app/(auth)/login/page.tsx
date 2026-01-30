
"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const searchParams= useSearchParams();
  const redirect=searchParams.get("redirect")|| "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      //  Redirect to dashboard / chat / plan page
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-slate-900 to-black px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl text-white">

        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back 
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Login to continue your career journey
        </p>

        <form className="flex flex-col gap-5"
        onSubmit={handleLogin}>

          {/* Email */}
          <div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
          >
            {loading ?"Logging in...":"Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
