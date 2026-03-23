import React, { useState } from "react";
import axios from "axios";
import { updateRow, insertRow } from "../services/api";

function TableView({ data, setData, table }) {

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [asc, setAsc] = useState(true);

  // ✏️ Edit
  const handleChange = (i, key, value) => {
    const newData = [...data];
    newData[i][key] = value;
    setData(newData);
  };

  const handleBlur = (row) => {
    updateRow(table, row.id, row);
  };

  // ➕ Add (FULL FIXED)
const addRow = () => {
  let newRow = {};

  // 🔥 if table is empty
  if (data.length === 0) {
    if (table === "users") {
      newRow = { name: "", email: "" };
    }
    else if (table === "products") {
      newRow = { name: "", price: 0 };
    }
    else if (table === "orders") {
      newRow = { product_name: "", quantity: 1 };
    }
  }

  // 🔥 if data exists
  else {
    const sample = data[0];

    Object.entries(sample).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at") {

        if (typeof value === "number") {
          newRow[key] = 0;
        } else {
          newRow[key] = "";
        }
      }
    });
  }

  insertRow(table, newRow)
    .then(res => setData([...data, res.data]))
    .catch(err => {
      console.error("Insert Error:", err.response?.data);
      alert("Insert failed");
    });
};

  // ❌ Delete
  const deleteRow = (id) => {
    if (window.confirm("Delete this row?")) {
      axios.delete(`http://localhost:5000/delete/${table}/${id}`)
        .then(() => setData(data.filter(d => d.id !== id)));
    }
  };

  // 🔍 FILTER (MISSING THA — FIXED)
  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // 🔃 SORT
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    return asc
      ? String(a[sortKey]).localeCompare(String(b[sortKey]))
      : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });

  return (
    <div>

      <h2>{table}</h2>

      {/* 🤖 AI */}
      <input
        placeholder="🤖 Ask AI (show emails, latest users, count users)"
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            axios.post("http://localhost:5000/ai-query", {
              prompt: e.target.value
            }).then(res => setData(res.data));
          }
        }}
      />

      {/* 🔍 Search */}
      <input
        placeholder="🔍 Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
      />

      {/* 📊 Stats */}
      <div style={{ marginBottom: "10px" }}>
        <b>Total Rows:</b> {data.length}
      </div>

      {/* 🧠 Insight */}
      <div style={{ marginBottom: "10px", color: "#38bdf8" }}>
        💡 Insight: You have {data.length} {table}
      </div>

      {/* ➕ Button */}
      <button
        onClick={addRow}
        style={{
          background: "#3b82f6",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: "6px",
          marginBottom: "10px",
          cursor: "pointer"
        }}
      >
        ➕ Add Row
      </button>

      {/* 📋 Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
            {sortedData[0] && Object.keys(sortedData[0]).map(col => (
              <th
                key={col}
                onClick={() => {
                  setSortKey(col);
                  setAsc(!asc);
                }}
                style={{ cursor: "pointer" }}
              >
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
                <button
                  onClick={() => deleteRow(row.id)}
                  style={{
                    color: "white",
                    background: "red",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  ❌
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default TableView;