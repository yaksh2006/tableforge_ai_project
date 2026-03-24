import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Dashboard({ users, products, orders }) {

  const data = {
    labels: ["Users", "Products", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [users.length, products.length, orders.length],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div>

      <h2>📊 Dashboard</h2>

      {/* 🔥 CARDS */}
      <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>

        <Card title="👥 Users" value={users.length} color="#3b82f6" />
        <Card title="📦 Products" value={products.length} color="#10b981" />
        <Card title="🧾 Orders" value={orders.length} color="#f59e0b" />

      </div>

      {/* 📊 CHART */}
      <div style={{ background: "#020617", padding: "20px", borderRadius: "10px" }}>
        <Bar data={data} />
      </div>

      {/* 💡 INSIGHTS */}
      <div style={{ marginTop: "20px" }}>
        <h3>💡 Insights</h3>
        <p>🔥 You have {users.length} users in your system</p>
        <p>📦 Total products: {products.length}</p>
        <p>🧾 Orders placed: {orders.length}</p>
      </div>

    </div>
  );
}

// 🔥 CARD COMPONENT
const Card = ({ title, value, color }) => {
  return (
    <div style={{
      flex: 1,
      background: "#020617",
      padding: "20px",
      borderRadius: "10px",
      borderLeft: `4px solid ${color}`
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};

export default Dashboard;