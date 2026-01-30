type ResumeProps = {
  name: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
  github: string;
  linkedin: string;
  languages: string;
};

const toBullets = (text: string) =>
  text
    ? text.split("\n").map((t) => t.trim()).filter(Boolean)
    : [];

export default function ResumePreview({
  name,
  title,
  email,
  phone,
  summary,
  skills,
  education,
  experience,
  projects,
  github,
  linkedin,
  languages,
}: ResumeProps) {
  return (
    <div
      id="resume-preview"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "40px",
        fontFamily: "Georgia, serif",
        fontSize: "13px",
        lineHeight: "1.45",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            margin: "0",
          }}
        >
          {name || "YOUR NAME"}
        </h1>

        <p style={{ fontWeight: "600", fontSize: "14px", marginTop: "4px", margin: "4px 0 0 0" }}>
          {title || "JOB TITLE"}
        </p>

        <p style={{ fontSize: "11px", marginTop: "4px", margin: "4px 0 0 0" }}>
          {phone || "XXXXXXXXXX"} &nbsp;|&nbsp; {email || "email@example.com"}
          {github && <> &nbsp;|&nbsp; <span style={{ textDecoration: "underline" }}>GitHub</span></>}
          {linkedin && <> &nbsp;|&nbsp; <span style={{ textDecoration: "underline" }}>LinkedIn</span></>}
        </p>

        <div style={{ borderTop: "1px solid #000000", marginTop: "8px" }} />
      </div>

      {/* SECTION WRAPPER */}
      <div style={{ marginTop: "12px" }}>
        {/* SUMMARY */}
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              borderBottom: "1px solid #000000",
              marginBottom: "4px",
              paddingBottom: "2px",
            }}
          >
            SUMMARY
          </h2>
          <p style={{ textAlign: "justify", margin: "4px 0" }}>
            {summary || "Write a short professional summary about yourself."}
          </p>
        </section>

        {/* SKILLS */}
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              borderBottom: "1px solid #000000",
              marginBottom: "4px",
              paddingBottom: "2px",
            }}
          >
            TECHNICAL SKILLS
          </h2>
          <ul style={{ listStyleType: "disc", marginLeft: "20px", paddingLeft: "0px", margin: "0" }}>
            {(toBullets(skills).length ? toBullets(skills) : ["Your skills here"]).map((s, i) => (
              <li key={i} style={{ marginBottom: "2px" }}>
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* EDUCATION */}
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              borderBottom: "1px solid #000000",
              marginBottom: "4px",
              paddingBottom: "2px",
            }}
          >
            EDUCATION
          </h2>
          <p style={{ margin: "4px 0" }}>{education || "Your education details here"}</p>
        </section>

        {/* PROJECTS */}
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              borderBottom: "1px solid #000000",
              marginBottom: "4px",
              paddingBottom: "2px",
            }}
          >
            PROJECTS
          </h2>
          <ul style={{ listStyleType: "disc", marginLeft: "20px", paddingLeft: "0px", margin: "0" }}>
            {(toBullets(projects).length ? toBullets(projects) : ["Your project details here"]).map(
              (p, i) => (
                <li key={i} style={{ marginBottom: "2px" }}>
                  {p}
                </li>
              )
            )}
          </ul>
        </section>

        {/* EXPERIENCE */}
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              borderBottom: "1px solid #000000",
              marginBottom: "4px",
              paddingBottom: "2px",
            }}
          >
            EXPERIENCE
          </h2>
          <ul style={{ listStyleType: "disc", marginLeft: "20px", paddingLeft: "0px", margin: "0" }}>
            {(toBullets(experience).length ? toBullets(experience) : ["Your experience details here"]).map(
              (e, i) => (
                <li key={i} style={{ marginBottom: "2px" }}>
                  {e}
                </li>
              )
            )}
          </ul>
        </section>

        {/* LANGUAGES */}
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              borderBottom: "1px solid #000000",
              marginBottom: "4px",
              paddingBottom: "2px",
            }}
          >
            LANGUAGES
          </h2>
          <p style={{ margin: "4px 0" }}>{languages || "English, Hindi"}</p>
        </section>
      </div>
    </div>
  );
}
