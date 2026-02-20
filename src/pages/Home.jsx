import Navbar from "../components/Navbar"

function Home() {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <Navbar />

      <div style={{
        textAlign: "center",
        paddingTop: "100px"
      }}>
        <h1 style={{ fontSize: "3rem" }}>
          Analyze Your Resume with AI
        </h1>

        <p style={{ marginTop: "20px", color: "#94a3b8" }}>
          Get instant feedback, ATS score, and skill gap analysis.
        </p>

        <button style={{
          marginTop: "30px",
          padding: "12px 24px",
          fontSize: "1rem",
          background: "#2563eb",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer"
        }}>
          Upload Resume
        </button>
      </div>
    </div>
  )
}

export default Home