import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0f1f35",
      borderColor: "rgba(56,189,248,0.2)",
      borderWidth: 1,
      titleColor: "#7ea8c4",
      bodyColor: "#e8f4fd",
      titleFont: { family: "'JetBrains Mono', monospace", size: 10 },
      bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(99,179,237,0.05)" },
      ticks: {
        color: "#3d6580",
        font: { family: "'JetBrains Mono', monospace", size: 10 },
      },
      border: { color: "rgba(99,179,237,0.08)" },
    },
    y: {
      grid: { color: "rgba(99,179,237,0.05)" },
      ticks: {
        color: "#3d6580",
        font: { family: "'JetBrains Mono', monospace", size: 10 },
      },
      border: { color: "rgba(99,179,237,0.08)" },
    },
  },
};

function Dashboard({ users, products, orders }) {

  const chartData = {
    labels: ["Users", "Products", "Orders"],
    datasets: [
      {
        data: [users.length, products.length, orders.length],
        backgroundColor: [
          "rgba(56,189,248,0.7)",
          "rgba(16,185,129,0.7)",
          "rgba(245,158,11,0.7)",
        ],
        borderColor: [
          "rgba(56,189,248,1)",
          "rgba(16,185,129,1)",
          "rgba(245,158,11,1)",
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const cards = [
    { label: "Total Users",    value: users.length,    color: "#38bdf8", icon: "◉" },
    { label: "Total Products", value: products.length, color: "#10b981", icon: "◈" },
    { label: "Total Orders",   value: orders.length,   color: "#f59e0b", icon: "◇" },
  ];

  return (
    <div className="content-area">

      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">WORKSPACE OVERVIEW · LIVE</div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="stat-grid">
        {cards.map(card => (
          <div
            key={card.label}
            className="stat-card"
            style={{ "--card-accent": card.color }}
          >
            <div className="stat-card-glow" style={{ background: card.color }} />
            <div className="stat-label">{card.label}</div>
            <div className="stat-value"
              style={{ color: card.color }}
            >{String(card.value).padStart(2, "0")}</div>
            <div className="stat-delta">↑ live count</div>
            <div className="stat-icon">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* ── CHART ── */}
      <div className="chart-card">
        <h3>◈ Distribution Overview</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* ── INSIGHTS ── */}
      <div className="insight-grid">
        {[
          { icon: "◉", text: `${users.length} users registered` },
          { icon: "◈", text: `${products.length} products in catalog` },
          { icon: "◇", text: `${orders.length} orders placed` },
          { icon: "⬡", text: "PostgreSQL · connected" },
        ].map((item, i) => (
          <div key={i} className="insight-chip">
            <span style={{ color: "var(--accent-cyan)" }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
