"use client";

import { useState, useEffect } from "react";
import ResumePreview from "@/components/ResumePreview";
import { redirect, useRouter } from "next/navigation";

/* ---------------- SMALL UI COMPONENTS ---------------- */

function Input({ label, name, onChange }: { label: string; name: string; onChange: any }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        name={name}
        onChange={onChange}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white"
      />
    </div>
  );
}

function Textarea({ label, name, onChange }: { label: string; name: string; onChange: any }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <textarea
        name={name}
        rows={3}
        onChange={onChange}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white"
      />
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function ResumePage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");

  const [isPremium, setPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);

  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
    github: "",
    linkedin: "",
    languages: "",
  });

  const router = useRouter();

  // ================= AUTH GUARD =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // ================= CHECK PREMIUM STATUS FROM DB =================
  useEffect(() => {
    const checkPremium = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/payment/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setPremium(data.isPremium);
      } catch {
        console.log("Failed to check premium status");
      }
    };

    checkPremium();
  }, []);

  // ================= FAKE PAYMENT =================
  const handleFakePayment = async () => {
    try {
      setPaying(true);

      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/payment/fake-pay", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPremium(true);
      setShowPayment(false);
      alert("Payment Successful 🎉 Premium Unlocked!");
    } catch {
      alert("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ================= DOWNLOAD PDF =================
  const downloadPDF = async () => {
    const element = document.getElementById("resume-preview");

    if (!element) {
      alert("Resume not found");
      return;
    }

    const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;

    const opt = {
      margin: 0,
      filename: "CareerAI_Resume.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black py-14">
      <div className="max-w-7xl mx-auto px-6 flex justify-center">

        {/* ---------------- STEP 1 ---------------- */}
        {step === 1 && (
          <div className="text-center space-y-8 mt-20">
            <h1 className="text-5xl font-bold text-white">Want to build your resume?</h1>
            <p className="text-zinc-400">It will take only 2–3 minutes</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-10 py-4 bg-white text-black rounded-xl font-semibold hover:scale-105 transition"
              >
                Yes, let’s go !!
              </button>
              <button
                className="px-10 py-4 border border-zinc-700 text-white rounded-xl"
                onClick={() => redirect("/")}
              >
                Not now
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {step === 2 && (
          <div className="w-full mt-10">
            <button onClick={goBack} className="text-zinc-400 hover:text-white mb-6">
              ← Back
            </button>

            <h2 className="text-4xl font-bold text-center text-white mb-12">
              What are you aiming for?
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {["Teaching", "Software Engineer", "CA / Finance", "Designer"].map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setGoal(item);
                    setStep(3);
                  }}
                  className="cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-white hover:shadow-2xl hover:-translate-y-1 transition"
                >
                  <p className="font-semibold text-lg">{item}</p>
                  <p className="text-sm text-zinc-400 mt-2">Resume for {item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {step === 3 && (
          <div className="text-center space-y-8 mt-20">
            <button onClick={goBack} className="text-zinc-400 hover:text-white">
              ← Back
            </button>

            <h2 className="text-5xl font-bold text-white">Resume for {goal}</h2>

            <p className="text-zinc-400">Let’s build a professional resume for you</p>

            <button
              onClick={() => setStep(4)}
              className="px-12 py-5 bg-white text-black rounded-2xl text-lg font-semibold hover:scale-105 transition"
            >
              Let’s Build !!
            </button>
          </div>
        )}

        {/* ---------------- STEP 4 ---------------- */}
        {step === 4 && (
          <div className="grid lg:grid-cols-2 gap-14 items-start w-full">

            {/* FORM PANEL */}
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">

              <button onClick={goBack} className="text-zinc-400 hover:text-white text-sm">
                ← Back
              </button>

              <h2 className="text-3xl font-bold text-white">Build Your Resume</h2>

              <div className="grid gap-4">
                <Input label="Name" name="name" onChange={handleChange} />
                <Input label="Job Title" name="title" onChange={handleChange} />
                <Input label="Email" name="email" onChange={handleChange} />
                <Input label="Phone" name="phone" onChange={handleChange} />

                <Textarea label="Summary" name="summary" onChange={handleChange} />
                <Textarea label="Skills" name="skills" onChange={handleChange} />
                <Textarea label="Education" name="education" onChange={handleChange} />
                <Textarea label="Projects" name="projects" onChange={handleChange} />
                <Textarea label="Experience" name="experience" onChange={handleChange} />

                <Input label="Languages" name="languages" onChange={handleChange} />
                <Input label="GitHub Link" name="github" onChange={handleChange} />
                <Input label="LinkedIn Link" name="linkedin" onChange={handleChange} />
              </div>
            </div>

            {/* PREVIEW + DOWNLOAD */}
            <div className="flex flex-col items-center gap-4">
              <div id="resume-preview" className="bg-white w-[794px] min-h-[1123px] p-10 border">
                <ResumePreview {...form} />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isPremium) setShowPayment(true);
                  else downloadPDF();
                }}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90"
              >
                Download Resume as PDF 📄
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= PAYMENT POPUP ================= */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl w-[350px] text-center space-y-4 border border-zinc-700">

            <h2 className="text-xl font-bold">Upgrade to Premium !!</h2>
            <p className="text-zinc-400 text-sm">
              Unlock resume download & premium features
            </p>

            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-2xl font-bold">₹199</p>
              <p className="text-xs text-zinc-400">One-time access</p>
            </div>

            {paying ? (
              <p className="text-blue-400">Processing payment...</p>
            ) : (
              <button
                onClick={handleFakePayment}
                className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700"
              >
                Pay Now
              </button>
            )}

            <button
              onClick={() => setShowPayment(false)}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
