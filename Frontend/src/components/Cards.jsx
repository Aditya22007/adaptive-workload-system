export default function Cards() {
  const cards = [
    { title: "Current Level", value: "Medium" },
    { title: "Productivity", value: "72.5" },
    { title: "Accuracy", value: "78%" },
    { title: "Tasks Done", value: "14" },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      {cards.map((card, i) => (
        <div key={i} style={{ background: "#111827", padding: "20px", borderRadius: "12px", flex: 1 }}>
          <p style={{ color: "gray" }}>{card.title}</p>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}