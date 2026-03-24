import React from "react";

function Sidebar({ tables, onSelect }) {
  return (
    <div className="sidebar">

      <h2>🚀 TableForge</h2>

      {/* 🔥 MAIN MENU */}
      <div
        className="table-item"
        onClick={() => onSelect("dashboard")}
      >
        📊 Dashboard
      </div>

      <div
        className="table-item"
        onClick={() => onSelect("analytics")}
      >
        📈 Analytics
      </div>

      <div
        className="table-item"
        onClick={() => onSelect("settings")}
      >
        ⚙️ Settings
      </div>

      {/* 🔹 Divider */}
      <hr style={{ border: "0.5px solid #1e293b", margin: "15px 0" }} />

      {/* 📂 TABLES */}
      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>
        DATABASE TABLES
      </div>

      {tables.map((t) => (
        <div
          key={t.table_name}
          className="table-item"
          onClick={() => onSelect(t.table_name)}
        >
          📄 {t.table_name}
        </div>
      ))}

    </div>
  );
}

export default Sidebar;