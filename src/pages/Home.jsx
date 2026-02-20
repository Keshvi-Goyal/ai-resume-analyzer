import { useState } from "react";
import Navbar from "../components/Navbar";

function Home() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Software Developer");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {
      setLoading(true);

      const response = await fetch(
        "https://ai-resume-analyzer-x2mm.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar />

      <div style={{ textAlign: "center", paddingTop: "100px" }}>
        <h1 style={{ fontSize: "3rem" }}>
          Analyze Your Resume with AI
        </h1>

        <p style={{ marginTop: "20px", color: "#94a3b8" }}>
          Get instant feedback, ATS score, and skill gap analysis.
        </p>

        {/* ROLE DROPDOWN */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginTop: "20px", padding: "8px" }}
        >
          <option>Software Developer</option>
          <option>Data Scientist</option>
          <option>Management</option>
          <option>Teacher</option>
        </select>

        <br />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginTop: "20px" }}
        />

        <br />

        <button
          onClick={handleUpload}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            fontSize: "1rem",
            background: "#2563eb",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Upload Resume"}
        </button>

        {/* RESULT SECTION */}
        {result && (
          <div style={{ marginTop: "50px" }}>
            <h2>ATS Score: {result.atsScore}%</h2>

            <h3 style={{ marginTop: "20px" }}>Score Breakdown</h3>
            <p>Technical: {result.breakdown?.technicalScore}%</p>
            <p>Soft Skills: {result.breakdown?.softScore}%</p>
            <p>Sections: {result.breakdown?.sectionScore}%</p>

            {/* Detected Technical */}
            <h3 style={{ marginTop: "30px", color: "#4ade80" }}>
              Detected Technical Skills
            </h3>
            {result.detectedTechnical?.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}

            {/* Detected Soft */}
            <h3 style={{ marginTop: "20px", color: "#4ade80" }}>
              Detected Soft Skills
            </h3>
            {result.detectedSoft?.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}

            {/* Missing Technical */}
            <h3 style={{ marginTop: "30px", color: "#f87171" }}>
              Missing Technical Skills
            </h3>
            {result.missingTechnical?.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}

            {/* Missing Soft */}
            <h3 style={{ marginTop: "20px", color: "#f87171" }}>
              Missing Soft Skills
            </h3>
            {result.missingSoft?.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}

            {/* Suggestions */}
            <h3 style={{ marginTop: "30px" }}>
              Suggestions
            </h3>
            {result.suggestions?.map((s, index) => (
              <div key={index}>{s}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;