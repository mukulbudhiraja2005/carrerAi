"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { careerRoadmaps } from "@/data/carrerRoadmaps";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CheckedMap = Record<string, Record<string, boolean>>;

export default function PlanPage() {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [openCareer, setOpenCareer] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<CheckedMap>({});

  const router = useRouter();

  // ================== AUTH GUARD ==================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // ================== LOAD FROM LOCALSTORAGE ==================
  useEffect(() => {
    const savedGoal = localStorage.getItem("planGoal");
    const savedDuration = localStorage.getItem("planDuration");
    const savedPlan = localStorage.getItem("generatedPlan");
    const savedChecked = localStorage.getItem("checkedTasks");

    if (savedGoal) setGoal(savedGoal);
    if (savedDuration) setDuration(savedDuration);
    if (savedPlan) setPlan(savedPlan);

    if (savedChecked) {
      try {
        setCheckedTasks(JSON.parse(savedChecked));
      } catch {
        setCheckedTasks({});
      }
    }

    setIsMounted(true);
  }, []);

  // ================== SAVE PLAN ==================
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("planGoal", goal);
    localStorage.setItem("planDuration", duration);
    localStorage.setItem("generatedPlan", plan);
  }, [goal, duration, plan, isMounted]);

  // ================== SAVE CHECKED TASKS ==================
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("checkedTasks", JSON.stringify(checkedTasks));
  }, [checkedTasks, isMounted]);

  // ================== GENERATE PLAN ==================
  const handleGenerate = async () => {
    if (!goal || !duration) return;

    setLoading(true);
    setPlan("");

    try {
      const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/ai/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    message: `Create a detailed ${duration} study plan for ${goal}. Give week wise breakdown and topics.`,
  }),
});

     

      const data = await res.json();
      setPlan(data.reply);
    } catch {
      setPlan("⚠️ Failed to generate plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================== CHECKBOX FIX ==================
  const handleCheckTask = (
    careerId: string,
    taskKey: string,
    checked: boolean
  ) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [careerId]: {
        ...(prev[careerId] || {}),
        [taskKey]: checked,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <HomeNavbar />

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-6 py-14 text-center">
        <h1 className="text-4xl font-bold mb-3">📚 Smart Study Planner</h1>
        <p className="text-zinc-400">
          Generate a personalized roadmap and track your progress
        </p>
      </div>

      {/* GENERATOR CARD */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-3xl p-8 space-y-5 shadow-xl">

          <h2 className="text-xl font-semibold">Create Your Plan</h2>

          <input
            placeholder="What do you want to learn? (DSA, React, DevOps...)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-zinc-800 px-4 py-3 rounded-lg outline-none border border-zinc-700 focus:border-white"
          />

          <input
            placeholder="Duration (e.g. 3 months, 6 weeks)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-zinc-800 px-4 py-3 rounded-lg outline-none border border-zinc-700 focus:border-white"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Generating Plan..." : "Generate Study Plan !!"}
          </button>
        </div>
      </div>

      {/* AI PLAN RESULT */}
      {plan && (
        <div className="max-w-4xl mx-auto px-6 mt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 whitespace-pre-line shadow-lg">
            <h2 className="text-xl font-semibold mb-4">📅 Your AI Study Plan</h2>
            <p className="text-zinc-300 leading-relaxed">{plan}</p>
          </div>
        </div>
      )}

      {/* CAREER ROADMAPS */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-6">🎯 Suggested Career Roadmaps</h2>

        <div className="space-y-6">
          {Object.entries(careerRoadmaps).map(([id, career]) => (
            <div
              key={id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:shadow-xl transition"
            >
              {/* HEADER */}
              <button
                onClick={() => setOpenCareer(openCareer === id ? null : id)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-lg font-semibold">
                  📌 {career.title}
                </span>
                <span className="text-sm text-zinc-400">
                  {openCareer === id ? "Hide ▲" : "View ▼"}
                </span>
              </button>

              {/* CONTENT */}
              {openCareer === id && (
                <div className="mt-6 space-y-5">

                  <a
                    href={career.playlist}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-400 underline text-sm"
                  >
                    ▶ Watch Full Playlist
                  </a>

                  {career.weeks.map((w, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="bg-zinc-800/80 p-5 rounded-xl space-y-3 border border-zinc-700"
                    >
                      <p className="font-semibold mb-1">
                        Week {w.week}
                      </p>

                      <div className="space-y-2">
                        {w.tasks.map((task, taskIndex) => {
                          const taskKey = `${weekIndex}-${taskIndex}`;

                          return (
                            <label
                              key={taskKey}
                              className="flex items-start gap-3 text-sm text-zinc-300 hover:text-white transition"
                            >
                              <input
                                type="checkbox"
                                checked={checkedTasks[id]?.[taskKey] || false}
                                onChange={(e) =>
                                  handleCheckTask(id, taskKey, e.target.checked)
                                }
                                className="mt-1 accent-blue-500"
                              />
                              {task}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
