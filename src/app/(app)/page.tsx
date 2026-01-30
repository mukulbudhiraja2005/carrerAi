"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

type Review = {
  _id: string;
  name: string;
  rating: number;
  message: string;
  userId: string;
};

export default function HomePage() {
  const router = useRouter();

  const [form, setForm] = useState({ rating: 5, message: "" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  // ================= GET USER ID FROM TOKEN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyUserId(payload.id || payload._id);
      } catch {}
    }
  }, []);

  // ================= FETCH REVIEWS =================
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch {
      console.log("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ================= SUBMIT REVIEW =================
  const submitReview = async () => {
    if (!form.message) {
      alert("Please write your review");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to submit review");
      router.push("/login");
      return;
    }

    try {
      setLoadingReview(true);

      await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: form.rating,
          message: form.message,
        }),
      });

      setForm({ rating: 5, message: "" });
      await fetchReviews();

      alert("Thanks for your review ❤️");
    } catch {
      alert("Failed to submit review");
    } finally {
      setLoadingReview(false);
    }
  };

  // ================= DELETE REVIEW =================
  const deleteReview = async (id: string) => {
    const ok = confirm("Delete this review?");
    if (!ok) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchReviews();
  };

  // ================= PROTECTED ROUTE =================
  const handleProtectedRoute = (path: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect=${path}`);
    } else {
      router.push(path);
    }
  };

  // ================= STAR INPUT =================
  const StarInput = () => (
    <div className="flex justify-center gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setForm({ ...form, rating: n })}
          className={`text-2xl ${
            n <= form.rating ? "text-yellow-400" : "text-zinc-600"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  // ================= STAR DISPLAY =================
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex items-center justify-center px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <div className="flex justify-center">
            <Image
              src="/robot.png"
              alt="AI Robot"
              width={800}
              height={800}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Personal AI Career Assistant
            </h1>

            <p className="text-zinc-400 mb-8">
              Get personalized study plans, career guidance, and build your resume
              with the help of AI. Start your journey towards your dream career today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => handleProtectedRoute("/chat")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Talk to AI
              </button>

              <button
                onClick={() => handleProtectedRoute("/plan")}
                className="px-6 py-3 border border-zinc-600 rounded-lg hover:bg-zinc-800"
              >
                Generate Study Plan
              </button>

              <button
                onClick={() => handleProtectedRoute("/resume")}
                className="px-6 py-3 border border-zinc-600 rounded-lg hover:bg-zinc-800"
              >
                Build Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="w-full bg-gradient-to-b from-black via-zinc-900 to-black py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              About <span className="text-blue-500">Career.AI</span>
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              Career.AI is your personal AI-powered career assistant designed to help
              students choose the right path, build strong skills, and stay consistent
              with structured learning plans.
            </p>

            <p className="text-zinc-400 leading-relaxed">
              Whether you want to become a Web Developer, crack DSA for placements,
              start DevOps, or explore Cybersecurity — Career.AI creates personalized
              roadmaps, tracks your progress, and guides you step by step.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-5 py-3 bg-zinc-800 rounded-xl border border-zinc-700">
                🎯 Personalized Plans
              </div>
              <div className="px-5 py-3 bg-zinc-800 rounded-xl border border-zinc-700">
                📈 Progress Tracking
              </div>
              <div className="px-5 py-3 bg-zinc-800 rounded-xl border border-zinc-700">
                🤖 AI Career Guidance
              </div>
              <div className="px-5 py-3 bg-zinc-800 rounded-xl border border-zinc-700">
                🧠 Smart Learning Paths
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-500">5+</p>
              <p className="text-zinc-400 mt-2">Career Paths</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-500">12 Weeks</p>
              <p className="text-zinc-400 mt-2">Structured Roadmaps</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-500">AI</p>
              <p className="text-zinc-400 mt-2">Powered Mentor</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-500">24/7</p>
              <p className="text-zinc-400 mt-2">Career Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-4">
            What Our Users Say ❤️
          </h2>

          <p className="text-center text-zinc-400 mb-12">
            Real feedback from students using Career.AI
          </p>

          {/* REVIEWS GRID */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {reviews.length === 0 && (
              <p className="text-center col-span-full text-zinc-500">
                No reviews yet. Be the first one 🚀
              </p>
            )}

            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    {r.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <Stars rating={r.rating} />
                  </div>
                </div>

                <p className="text-zinc-400 mt-3 text-sm">{r.message}</p>

                {r.userId === myUserId && (
                  <button
                    onClick={() => deleteReview(r._id)}
                    className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ADD REVIEW FORM */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">
              Leave Your Review ⭐
            </h3>

            <StarInput />

            <textarea
              placeholder="Your Feedback"
              value={form.message}
              className="w-full mb-4 bg-zinc-800 p-3 rounded border border-zinc-700 outline-none"
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button
              onClick={submitReview}
              disabled={loadingReview}
              className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loadingReview ? "Submitting..." : "Submit Review ❤️"}
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}
