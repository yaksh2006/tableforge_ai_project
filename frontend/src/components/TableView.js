import React, { useState } from "react";
import axios from "axios";
import { updateRow, insertRow } from "../services/api";

function TableView({ data, setData, table }) {

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [asc, setAsc] = useState(true);

  // 🧠 AI History
  const [history, setHistory] = useState([]);

  // ✏️ Edit
  const handleChange = (i, key, value) => {
    const newData = [...data];
    newData[i][key] = value;
    setData(newData);
  };

  const handleBlur = (row) => {
    updateRow(table, row.id, row);
  };

  // ➕ Add Row
  const addRow = () => {
    let newRow = {};

    if (data.length === 0) {
      if (table === "users") newRow = { name: "", email: "" };
      else if (table === "products") newRow = { name: "", price: 0 };
      else if (table === "orders") newRow = { product_name: "", quantity: 1 };
    } else {
      const sample = data[0];

      Object.entries(sample).forEach(([key, value]) => {
        if (key !== "id" && key !== "created_at") {
          if (typeof value === "number") newRow[key] = 0;
          else newRow[key] = "";
        }
      });
    }

    insertRow(table, newRow)
      .then(res => setData([...data, res.data]))
      .catch(() => alert("Insert failed"));
  };

  // ❌ Delete
  const deleteRow = (id) => {
    if (window.confirm("Delete?")) {
      axios.delete(`http://localhost:5000/delete/${table}/${id}`)
        .then(() => setData(data.filter(d => d.id !== id)));
    }
  };

  // 🔍 Filter
  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // 🔃 Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    return asc
      ? String(a[sortKey]).localeCompare(String(b[sortKey]))
      : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });

  return (
    <div>

      <h2>{table}</h2>

      {/* 💡 Suggestions */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() =>
            alert("Try: latest products / count users / show names")
          }
        >
          💡 Suggestions
        </button>
      </div>

      {/* 🤖 AI INPUT */}
      <input
        placeholder="🤖 Ask AI (latest products, count users)"
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {

            // 🧠 Save history
            setHistory(prev => [...prev, e.target.value]);

            axios.post("http://localhost:5000/ai-query", {
              prompt: e.target.value
            }).then(res => {
              setData(res.data.data);
              alert("SQL: " + res.data.query);
            }).catch(() => alert("AI failed"));

            e.target.value = ""; // clear input
          }
        }}
      />

      {/* 🔍 Search */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 Stats */}
      <div style={{ margin: "10px 0" }}>
        <b>Total Rows:</b> {data.length}
      </div>

      {/* ➕ Add */}
      <button onClick={addRow}>➕ Add Row</button>

      {/* 📋 Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
            {sortedData[0] && Object.keys(sortedData[0]).map(col => (
              <th key={col} onClick={() => {
                setSortKey(col);
                setAsc(!asc);
              }}>
                {col} ⬍
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i}>
              {Object.entries(row).map(([key, val], j) => (
                <td key={j}>
                  {key === "id" ? val : (
                    <input
                      value={val || ""}
                      onChange={(e) =>
                        handleChange(i, key, e.target.value)
                      }
                      onBlur={() => handleBlur(row)}
                    />
                  )}
                </td>
              ))}

              <td>
                <button onClick={() => deleteRow(row.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🧠 HISTORY */}
      <div style={{ marginTop: "20px" }}>
        <h4>🧠 AI History</h4>
        {history.map((h, i) => (
          <div key={i} style={{ fontSize: "12px", color: "#94a3b8" }}>
            {h}
          </div>
        ))}
      </div>

    </div>
  );
}

export default TableView;