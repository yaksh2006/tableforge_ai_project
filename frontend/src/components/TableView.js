import React, { useState } from "react";
import axios from "axios";
import { updateRow, insertRow } from "../services/api";

function TableView({ data, setData, table }) {

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [asc, setAsc] = useState(true);
  const [history, setHistory] = useState([]);
  const [sqlToast, setSqlToast] = useState(null);
  const [aiInput, setAiInput] = useState("");

  // ── Edit cell ──
  const handleChange = (i, key, value) => {
    const next = [...data];
    next[i][key] = value;
    setData(next);
  };

  const handleBlur = (row) => updateRow(table, row.id, row);

  // ── Add Row ──
  const addRow = () => {
    let newRow = {};
    if (data.length === 0) {
      if (table === "users")    newRow = { name: "", email: "" };
      else if (table === "products") newRow = { name: "", price: 0 };
      else if (table === "orders")   newRow = { product_name: "", quantity: 1 };
    } else {
      const sample = data[0];
      Object.entries(sample).forEach(([key, val]) => {
        if (key !== "id" && key !== "created_at") {
          newRow[key] = typeof val === "number" ? 0 : "";
        }
      });
    }
    insertRow(table, newRow)
      .then(res => setData([...data, res.data]))
      .catch(() => alert("Insert failed"));
  };

  // ── Delete ──
  const deleteRow = (id) => {
    if (!window.confirm("Delete this row?")) return;
    axios.delete(`http://localhost:5000/delete/${table}/${id}`)
      .then(() => setData(data.filter(d => d.id !== id)));
  };

  // ── AI ──
  const runAI = () => {
    if (!aiInput.trim()) return;
    setHistory(prev => [aiInput, ...prev]);
    axios.post("http://localhost:5000/ai-query", { prompt: aiInput })
      .then(res => {
        setData(res.data.data);
        setSqlToast(res.data.query);
        setTimeout(() => setSqlToast(null), 4000);
      })
      .catch(() => alert("AI query failed"));
    setAiInput("");
  };

  // ── Filter & Sort ──
  const filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    return asc
      ? String(a[sortKey]).localeCompare(String(b[sortKey]))
      : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });

  const columns = sorted[0] ? Object.keys(sorted[0]) : [];

  // ── Export CSV ──
  const exportCSV = () => {
    const header = columns.join(",");
    const rows = sorted.map(row => columns.map(c => `"${row[c] ?? ""}"`).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${table}.csv`; a.click();
  };

  return (
    <div className="content-area">

      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <div className="page-title" style={{ textTransform: "capitalize" }}>
            {table}
          </div>
          <div className="page-subtitle">
            {data.length} ROWS · POSTGRESQL TABLE
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={exportCSV}>↓ Export CSV</button>
          <button className="btn-primary" onClick={addRow}>+ New Row</button>
        </div>
      </div>

      {/* ── AI BAR ── */}
      <div className="ai-bar">
        <span className="ai-badge">AI SQL</span>
        <input
          placeholder={`Ask anything — "show latest ${table}", "count rows"...`}
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && runAI()}
        />
        <span className="ai-hint">⏎ to run</span>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">⊘</span>
          <input
            className="search-input"
            placeholder="Filter rows..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="data-table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className={sortKey === col ? "sorted" : ""}
                  onClick={() => { setSortKey(col); setAsc(sortKey === col ? !asc : true); }}
                >
                  {col}
                  <span className="sort-arrow">
                    {sortKey === col ? (asc ? "▲" : "▼") : "⬍"}
                  </span>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="empty-state">
                    <div className="empty-icon">◎</div>
                    <div>No rows found</div>
                  </div>
                </td>
              </tr>
            )}
            {sorted.map((row, i) => (
              <tr key={i}>
                {Object.entries(row).map(([key, val], j) => (
                  <td key={j} className={key === "id" ? "td-id" : ""}>
                    {key === "id" ? (
                      <span>#{val}</span>
                    ) : (
                      <input
                        value={val ?? ""}
                        onChange={e => handleChange(i, key, e.target.value)}
                        onBlur={() => handleBlur(row)}
                      />
                    )}
                  </td>
                ))}
                <td className="td-actions">
                  <button
                    className="btn-danger"
                    onClick={() => deleteRow(row.id)}
                  >
                    ✕ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── TABLE FOOTER ── */}
        <div className="table-footer">
          <span>{filtered.length} of {data.length} rows</span>
          {sortKey && (
            <span>Sorted by <b style={{ color: "var(--accent-cyan)" }}>{sortKey}</b></span>
          )}
          <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
            {table} · PostgreSQL
          </span>
        </div>
      </div>

      {/* ── AI HISTORY ── */}
      {history.length > 0 && (
        <div className="ai-history">
          <div className="ai-history-header">
            ◈ Query History
          </div>
          {history.map((h, i) => (
            <div key={i} className="ai-history-item">{h}</div>
          ))}
        </div>
      )}

      {/* ── SQL TOAST ── */}
      {sqlToast && (
        <div className="sql-toast">
          <div className="sql-toast-label">Generated SQL</div>
          <div className="sql-toast-query">{sqlToast}</div>
        </div>
      )}

    </div>
  );
}

export default TableView;
