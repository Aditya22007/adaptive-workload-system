import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function Charts() {

  const data = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 72 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 85 },
    { day: "Sun", value: 78 },
  ];

  const pieData = [
    { name: "Math", value: 30 },
    { name: "Coding", value: 25 },
    { name: "Logic", value: 20 },
    { name: "Data", value: 25 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <>
      {/* Line Chart */}
      <div style={{ background: "#111827", padding: "20px", borderRadius: "12px", marginTop: "20px" }}>
        <h2>7-Day Performance Trend</h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div style={{ background: "#111827", padding: "20px", borderRadius: "12px", marginTop: "20px" }}>
        <h2>Task Distribution</h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}