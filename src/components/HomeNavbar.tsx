"use client";

import Link from "next/link";

export default function HomeNavbar() {
  return (
    <div className="w-full bg-black border-b border-zinc-800 px-6 py-3">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
      >
        ⬅ Home
      </Link>
    </div>
  );
}
