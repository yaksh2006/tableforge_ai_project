import React from "react";

function Sidebar({ tables, onSelect }) {
  return (
    <div className="sidebar">
      <h2>TableForge</h2>

      {tables.map((t) => (
        <div
          key={t.table_name}
          className="table-item"
          onClick={() => onSelect(t.table_name)}
        >
          {t.table_name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;