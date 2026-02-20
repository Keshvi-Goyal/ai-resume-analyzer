import { useState } from "react"
import Navbar from "../components/Navbar"

function Home() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("resume", file)

    try {
      setLoading(true)

      const response = await fetch(
        "https://ai-resume-analyzer-x2mm.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      alert("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <Navbar />

      <div style={{ textAlign: "center", paddingTop: "100px" }}>
        <h1 style={{ fontSize: "3rem" }}>
          Analyze Your Resume with AI
        </h1>

        <p style={{ marginTop: "20px", color: "#94a3b8" }}>
          Get instant feedback, ATS score, and skill gap analysis.
        </p>

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
          <div style={{ marginTop: "40px" }}>
            <h2>ATS Score: {result.atsScore}%</h2>
            <p>Total Skills Found: {result.totalSkillsFound}</p>

            <h3>Detected Skills:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {result.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home