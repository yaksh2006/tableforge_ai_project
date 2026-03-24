import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TableView from "./components/TableView";
import Dashboard from "./components/Dashboard";
import { getTables, getTableData } from "./services/api";

function App() {
  const [tables, setTables] = useState([]);
  const [data, setData] = useState([]);

  const [selectedTable, setSelectedTable] = useState("dashboard");

  // Dashboard data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // 🔁 Initial Load
  useEffect(() => {
    getTables().then(res => setTables(res.data));

    getTableData("users").then(res => setUsers(res.data));
    getTableData("products").then(res => setProducts(res.data));
    getTableData("orders").then(res => setOrders(res.data));
  }, []);

  // 🔥 FIXED loadTable
  const loadTable = (name) => {
    setSelectedTable(name);

    // ❌ skip non-table routes
    if (
      name === "dashboard" ||
      name === "analytics" ||
      name === "settings"
    ) {
      return;
    }

    // ✅ only real tables
    getTableData(name).then(res => setData(res.data));
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <Sidebar
        tables={tables}
        onSelect={loadTable}
      />

      {/* MAIN */}
      <div className="main">

        {/* DASHBOARD */}
        {selectedTable === "dashboard" && (
          <Dashboard
            users={users}
            products={products}
            orders={orders}
          />
        )}

        {/* ANALYTICS */}
        {selectedTable === "analytics" && (
          <div>
            <h2>📈 Analytics</h2>
            <p>Total Users: {users.length}</p>
            <p>Total Products: {products.length}</p>
            <p>Total Orders: {orders.length}</p>
          </div>
        )}

        {/* SETTINGS */}
        {selectedTable === "settings" && (
          <div>
            <h2>⚙️ Settings</h2>
            <button onClick={() => alert("Feature coming soon")}>
              Reset Database
            </button>
          </div>
        )}

        {/* TABLE VIEW */}
        {!["dashboard", "analytics", "settings"].includes(selectedTable) && (
          <TableView
            data={data}
            setData={setData}
            table={selectedTable}
          />
        )}

      </div>

    </div>
  );
}

export default App;