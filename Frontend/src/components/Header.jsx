export default function Header() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1>Good afternoon, Aditya 👋</h1>
        <p style={{ color: "gray" }}>Here’s your performance snapshot</p>
      </div>
      <button style={{ background: "#3B82F6", padding: "10px 15px", borderRadius: "10px", color: "white", border: "none" }}>
        Start Task
      </button>
    </div>
  );
}