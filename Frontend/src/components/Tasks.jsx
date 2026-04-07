export default function Tasks() {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Recommended Tasks</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        {["Math", "Logic", "Coding"].map((task, i) => (
          <div key={i} style={{ background: "#111827", padding: "20px", borderRadius: "12px", flex: 1 }}>
            <p style={{ color: "orange" }}>MEDIUM</p>
            <h3>{task} Task</h3>
            <p style={{ color: "gray" }}>Solve problems and improve performance.</p>
            <button style={{ marginTop: "10px", color: "#3B82F6", background: "none", border: "none" }}>
              Start →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}