import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthService } from "../../services/auth.service";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import type { TooltipItem } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

type CustomerStatus = "Active" | "Pending" | "Inactive";

type Customer = {
  id: string;
  owner_user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  company: string;
  status: CustomerStatus;
  country: string;
  address: string;
  created_at: string;
  updated_at: string;
};

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export default function Dashboard() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCustomers(token);
  }, [navigate]);

  const fetchCustomers = async (token: string) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/customers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading dashboard customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === "Active").length;
    const pendingCustomers = customers.filter((c) => c.status === "Pending").length;
    const inactiveCustomers = customers.filter((c) => c.status === "Inactive").length;

    return {
      totalCustomers,
      activeCustomers,
      pendingCustomers,
      inactiveCustomers,
    };
  }, [customers]);

  const percentage = (value: number, total: number) =>
    total === 0 ? 0 : Number(((value / total) * 100).toFixed(1));

  const statusDistributionData = {
    labels: ["Active", "Pending", "Inactive"],
    datasets: [
      {
        data: [
          stats.activeCustomers,
          stats.pendingCustomers,
          stats.inactiveCustomers,
        ],
        backgroundColor: ["#22c55e", "#f97316", "#6b7280"],
        borderWidth: 0
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"doughnut">) => {
            const label = ctx.label || "";
            const value = Number(ctx.parsed || 0);
            const total = stats.totalCustomers || 1;
            const pct = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${pct}%)`;
          }
        }
      }
    }
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const groupedByMonth = useMemo(() => {
    const result = [0, 0, 0, 0, 0, 0];
    const now = new Date();

    customers.forEach((customer) => {
      const createdAt = new Date(customer.created_at);

      const diffMonths =
        (now.getFullYear() - createdAt.getFullYear()) * 12 +
        (now.getMonth() - createdAt.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        const index = 5 - diffMonths;
        result[index] += 1;
      }
    });

    return result;
  }, [customers]);

  const newCustomersGrowthData = {
    labels: months,
    datasets: [
      {
        label: "New Customers",
        data: groupedByMonth,
        backgroundColor: "#3b82f6"
      }
    ]
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: { stepSize: 1 }
      }
    }
  };

  const customerTrendsOverTimeData = useMemo(() => {
    const active = [0, 0, 0, 0, 0, 0];
    const pending = [0, 0, 0, 0, 0, 0];
    const inactive = [0, 0, 0, 0, 0, 0];
    const now = new Date();

    customers.forEach((customer) => {
      const createdAt = new Date(customer.created_at);

      const diffMonths =
        (now.getFullYear() - createdAt.getFullYear()) * 12 +
        (now.getMonth() - createdAt.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        const index = 5 - diffMonths;

        if (customer.status === "Active") active[index] += 1;
        if (customer.status === "Pending") pending[index] += 1;
        if (customer.status === "Inactive") inactive[index] += 1;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Active",
          data: active,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.35)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Pending",
          data: pending,
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.35)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Inactive",
          data: inactive,
          borderColor: "#6b7280",
          backgroundColor: "rgba(107,114,128,0.35)",
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [customers]);

  const lineOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "#e5e7eb" }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" }
      }
    }
  };

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <h2 className="dashboard-title">Analytics</h2>
          <p className="dashboard-subtitle">
            Overview of your customer performance and trends
          </p>
        </section>

        <section className="dashboard-cards">
          <article className="dashboard-card">
            <p className="dashboard-card-label">Total Customers</p>
            <p className="dashboard-card-value">
              {loading ? "..." : stats.totalCustomers}
            </p>
            <p className="dashboard-card-helper dashboard-card-helper--success">
              Real data from database
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-card-label">Active Customers</p>
            <p className="dashboard-card-value">
              {loading ? "..." : stats.activeCustomers}
            </p>
            <p className="dashboard-card-helper">
              {percentage(stats.activeCustomers, stats.totalCustomers)}% of total
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-card-label">Pending Review</p>
            <p className="dashboard-card-value">
              {loading ? "..." : stats.pendingCustomers}
            </p>
            <p className="dashboard-card-helper dashboard-card-helper--warning">
              {percentage(stats.pendingCustomers, stats.totalCustomers)}% of total
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-card-label">Inactive</p>
            <p className="dashboard-card-value">
              {loading ? "..." : stats.inactiveCustomers}
            </p>
            <p className="dashboard-card-helper">
              {percentage(stats.inactiveCustomers, stats.totalCustomers)}% of total
            </p>
          </article>
        </section>

        <section className="dashboard-grid-2">
          <article className="dashboard-panel">
            <header className="dashboard-panel-header">
              <h3 className="dashboard-panel-title">
                Customer Status Distribution
              </h3>
              <p className="dashboard-panel-subtitle">
                Current distribution by status
              </p>
            </header>
            <div className="dashboard-panel-body dashboard-panel-body--pie">
              <div className="dashboard-pie-wrapper">
                <Doughnut data={statusDistributionData} options={pieOptions} />
              </div>
              <div className="dashboard-status-labels">
                <span className="status-label status-label--active">
                  Active {percentage(stats.activeCustomers, stats.totalCustomers)}%
                </span>
                <span className="status-label status-label--pending">
                  Pending {percentage(stats.pendingCustomers, stats.totalCustomers)}%
                </span>
                <span className="status-label status-label--inactive">
                  Inactive {percentage(stats.inactiveCustomers, stats.totalCustomers)}%
                </span>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <header className="dashboard-panel-header">
              <h3 className="dashboard-panel-title">New Customers Growth</h3>
              <p className="dashboard-panel-subtitle">
                Monthly new customer acquisitions
              </p>
            </header>
            <div className="dashboard-panel-body">
              <Bar data={newCustomersGrowthData} options={barOptions} />
            </div>
          </article>
        </section>

        <section className="dashboard-row">
          <article className="dashboard-panel">
            <header className="dashboard-panel-header">
              <h3 className="dashboard-panel-title">
                Customer Trends Over Time
              </h3>
              <p className="dashboard-panel-subtitle">
                6-month customer status trend analysis
              </p>
            </header>
            <div className="dashboard-panel-body dashboard-panel-body--large">
              <Line data={customerTrendsOverTimeData} options={lineOptions} />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}