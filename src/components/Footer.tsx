"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-gradient-to-t from-black via-zinc-900 to-zinc-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 items-center">

        {/* LEFT */}
        <div className="text-center md:text-left space-y-2">
          <h3 className="text-lg font-semibold text-white">Career.ai</h3>
          <p className="text-sm text-zinc-400">
            Smart career guidance powered by AI
          </p>
        </div>

        {/* CENTER */}
        <div className="text-center space-y-2">
          <p className="text-sm">
            📧{" "}
            <a
              href="mailto:budhirajasmukul@gmail.com"
              className="text-blue-400 hover:underline"
            >
              budhirajasmukul@gmail.com
            </a>
          </p>
          <p className="text-xs text-zinc-500">
            Feel free to reach out for collaboration
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center md:justify-end gap-6 text-sm">
          <Link
            href="https://github.com/mukulbudhiraja2005"
            target="_blank"
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <FontAwesomeIcon icon={faGithub} />
            GitHub
          </Link>

          <Link
            href="https://www.linkedin.com/in/mukul-b62021276/"
            target="_blank"
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <FontAwesomeIcon icon={faLinkedin} />
            LinkedIn
          </Link>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-zinc-800">
        <p className="text-center text-xs text-zinc-500 py-4">
          © {new Date().getFullYear()} Career.AI — Built with ❤️ by Mukul
        </p>
      </div>
    </footer>
  );
}
