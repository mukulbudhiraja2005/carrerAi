"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
   const router = useRouter();
  const[isLoggedIn,setIsLoggedIn]=useState(false);
  useEffect(()=>{
    const token=localStorage.getItem("token");
    setIsLoggedIn(!!token);
  },[]);
    const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center border-b">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        Career.AI
      </Link>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        {!isLoggedIn ? (
          <><Link
          href="/login"
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Signup
        </Link>
        </>)
        :( <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>)}
       
      </div>
    </nav>
  );
}
