import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TableView from "./components/TableView";
import { getTables, getTableData } from "./services/api";

function App() {
  const [tables, setTables] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    getTables().then(res => setTables(res.data));
  }, []);

  const loadTable = (name) => {
    setSelectedTable(name);
    getTableData(name).then(res => setData(res.data));
  };

  return (
    <div className="app">
      <Sidebar tables={tables} onSelect={loadTable} />

      <div className="main">
        {selectedTable ? (
          <TableView
            data={data}
            setData={setData}
            table={selectedTable}
          />
        ) : (
          <h1>Select a table</h1>
        )}
      </div>
    </div>
  );
}

export default App;