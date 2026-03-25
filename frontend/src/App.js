import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TableView from "./components/TableView";
import Dashboard from "./components/Dashboard";
import { getTables, getTableData } from "./services/api";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ── ANALYTICS PAGE ──────────────────────────────────
function Analytics({ users, products, orders }) {
  const doughnutOpts = {
    plugins: {
      legend: {
        labels: {
          color: "#7ea8c4",
          font: { family: "'JetBrains Mono', monospace", size: 11 },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#0f1f35",
        titleColor: "#7ea8c4",
        bodyColor: "#e8f4fd",
        titleFont: { family: "'JetBrains Mono', monospace" },
        bodyFont:  { family: "'JetBrains Mono', monospace" },
        borderColor: "rgba(56,189,248,0.2)",
        borderWidth: 1,
      },
    },
    cutout: "65%",
  };

  const chartData = {
    labels: ["Users", "Products", "Orders"],
    datasets: [{
      data: [users.length, products.length, orders.length],
      backgroundColor: ["rgba(56,189,248,0.8)", "rgba(16,185,129,0.8)", "rgba(245,158,11,0.8)"],
      borderColor: ["#38bdf8", "#10b981", "#f59e0b"],
      borderWidth: 1,
    }],
  };

  const metrics = [
    { label: "Avg Orders / User",    value: users.length ? (orders.length / users.length).toFixed(2) : "—", unit: "ratio" },
    { label: "Products / Order",     value: orders.length ? (products.length / orders.length).toFixed(2) : "—", unit: "ratio" },
    { label: "Total Entities",       value: users.length + products.length + orders.length, unit: "rows" },
    { label: "Active Tables",        value: 3, unit: "tables" },
  ];

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-subtitle">METRICS & DISTRIBUTION</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* ── DOUGHNUT ── */}
        <div className="chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3>◈ Entity Distribution</h3>
          <div style={{ width: "220px" }}>
            <Doughnut data={chartData} options={doughnutOpts} />
          </div>
        </div>

        {/* ── METRICS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {metrics.map(m => (
            <div key={m.label} className="stat-card" style={{ "--card-accent": "var(--accent-cyan)" }}>
              <div className="stat-label">{m.label}</div>
              <div className="stat-value" style={{ fontSize: "28px", color: "var(--accent-cyan)" }}>{m.value}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>{m.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ────────────────────────────────────
function Settings() {
  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">WORKSPACE CONFIGURATION</div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Database</h3>
        <div className="settings-row">
          <div>
            <div className="settings-label">Connection</div>
            <div className="settings-desc">postgresql://localhost:5432</div>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-emerald)" }}>● Connected</span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Reset Database</div>
            <div className="settings-desc">Clears all rows in all tables</div>
          </div>
          <button className="btn-danger" onClick={() => alert("Coming soon")}>
            ⚠ Reset
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>AI Engine</h3>
        <div className="settings-row">
          <div>
            <div className="settings-label">AI Query Mode</div>
            <div className="settings-desc">Natural language → SQL translation</div>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-cyan)" }}>Enabled</span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Model</div>
            <div className="settings-desc">Rule-based NLP (upgrade to GPT-4 available)</div>
          </div>
          <button onClick={() => alert("Coming soon")}>Upgrade</button>
        </div>
      </div>

      <div className="settings-section">
        <h3>Interface</h3>
        <div className="settings-row">
          <div>
            <div className="settings-label">Theme</div>
            <div className="settings-desc">Obsidian Dark</div>
          </div>
          <button onClick={() => alert("Theme editor coming soon")}>Customize</button>
        </div>
      </div>
    </div>
  );
}

// ── TOPBAR ───────────────────────────────────────────
function Topbar({ selected }) {
  const labels = {
    dashboard: "Dashboard",
    analytics: "Analytics",
    settings:  "Settings",
  };
  const label = labels[selected] ?? selected;

  return (
    <div className="topbar">
      <div className="topbar-breadcrumb">
        TableForge <span style={{ color: "var(--text-muted)" }}>›</span> <span>{label}</span>
      </div>
      <div className="topbar-spacer" />
      <div className="topbar-actions">
        <button style={{ fontSize: "11px", padding: "6px 10px" }}>
          ◎ Docs
        </button>
        <div style={{
          width: "28px", height: "28px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: "700", cursor: "pointer",
        }}>Y</div>
      </div>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────
function App() {
  const [tables, setTables]   = useState([]);
  const [data, setData]       = useState([]);
  const [selected, setSelected] = useState("dashboard");

  const [users, setUsers]     = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders]   = useState([]);

  useEffect(() => {
    getTables().then(res => setTables(res.data));
    getTableData("users").then(res => setUsers(res.data));
    getTableData("products").then(res => setProducts(res.data));
    getTableData("orders").then(res => setOrders(res.data));
  }, []);

  const NON_TABLE = ["dashboard", "analytics", "settings"];

  const loadTable = (name) => {
    setSelected(name);
    if (!NON_TABLE.includes(name)) {
      getTableData(name).then(res => setData(res.data));
    }
  };

  return (
    <div className="app">
      <Sidebar tables={tables} onSelect={loadTable} activeTable={selected} />

      <div className="main">
        <Topbar selected={selected} />

        {selected === "dashboard" && (
          <Dashboard users={users} products={products} orders={orders} />
        )}
        {selected === "analytics" && (
          <Analytics users={users} products={products} orders={orders} />
        )}
        {selected === "settings" && <Settings />}

        {!NON_TABLE.includes(selected) && (
          <TableView data={data} setData={setData} table={selected} />
        )}
      </div>
    </div>
  );
}

export default App;
