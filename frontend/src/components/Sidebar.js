import React, { useState } from "react";

function Sidebar({ tables, onSelect, activeTable }) {

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "analytics", icon: "◈", label: "Analytics" },
    { id: "settings",  icon: "◎", label: "Settings"  },
  ];

  return (
    <div className="sidebar">

      {/* ── BRAND ── */}
      <div className="sidebar-brand">
        <div className="brand-icon">⬡</div>
        <span className="brand-name">TableForge</span>
        <span className="brand-badge">v2.0</span>
      </div>

      {/* ── MAIN NAV ── */}
      <div className="sidebar-nav">
        <div className="nav-label">Workspace</div>

        {navItems.map(item => (
          <div
            key={item.id}
            className={`table-item ${activeTable === item.id ? "active" : ""}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-label">{item.label}</span>
          </div>
        ))}

        <div className="sidebar-divider" />

        {/* ── TABLES ── */}
        <div className="nav-label">Database Tables</div>

        {tables.length === 0 && (
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-muted)",
            padding: "8px 10px"
          }}>
            No tables found
          </div>
        )}

        {tables.map((t) => (
          <div
            key={t.table_name}
            className={`table-item ${activeTable === t.table_name ? "active" : ""}`}
            onClick={() => onSelect(t.table_name)}
          >
            <span className="item-icon" style={{ fontSize: "11px" }}>▤</span>
            <span className="item-label">{t.table_name}</span>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div className="sidebar-footer">
        <div className="db-status">
          <div className="status-dot" />
          <span>postgres · connected</span>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
