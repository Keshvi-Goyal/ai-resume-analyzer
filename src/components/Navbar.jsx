function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
      background: "#111827",
      color: "white"
    }}>
      <h2>AI Resume Analyzer</h2>
      <button style={{
        padding: "8px 16px",
        background: "#2563eb",
        border: "none",
        color: "white",
        borderRadius: "5px"
      }}>
        Login
      </button>
    </nav>
  )
}

export default Navbar