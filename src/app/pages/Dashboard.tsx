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
  Filler,
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

type CustomerStatus = "active" | "pending" | "inactive";

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

  const fetchCustomers = async (tokenParam?: string) => {
    try {
      const { token: storedToken } = AuthService.getAuthData();
      const token = tokenParam || storedToken;

      if (!token) {
        navigate("/login");
        return;
      }

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

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    fetchCustomers(token);

    const interval = setInterval(() => {
      fetchCustomers(token);
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === "active").length;
    const pendingCustomers = customers.filter((c) => c.status === "pending").length;
    const inactiveCustomers = customers.filter((c) => c.status === "inactive").length;

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
        backgroundColor: ["#22c55e", "#f59e0b", "#94a3b8"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 10 },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"doughnut">) => {
            const label = ctx.label || "";
            const value = Number(ctx.parsed || 0);
            const pct = percentage(value, stats.totalCustomers);
            return `${label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  const months = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en", { month: "short" });
    const now = new Date();
    const result: string[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push(formatter.format(d));
    }

    return result;
  }, []);

  const newCustomersByMonth = useMemo(() => {
    const now = new Date();
    const counts = [0, 0, 0, 0, 0, 0];

    customers.forEach((customer) => {
      const createdAt = new Date(customer.created_at);

      const diffMonths =
        (now.getFullYear() - createdAt.getFullYear()) * 12 +
        (now.getMonth() - createdAt.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        const index = 5 - diffMonths;
        counts[index] += 1;
      }
    });

    return counts;
  }, [customers]);

  const newCustomersGrowthData = {
    labels: months,
    datasets: [
      {
        label: "New Customers",
        data: newCustomersByMonth,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: { stepSize: 1 },
      },
    },
  };

  const customerTrendsOverTimeData = useMemo(() => {
    const now = new Date();

    const active = [0, 0, 0, 0, 0, 0];
    const pending = [0, 0, 0, 0, 0, 0];
    const inactive = [0, 0, 0, 0, 0, 0];

    customers.forEach((customer) => {
      const createdAt = new Date(customer.created_at);

      const diffMonths =
        (now.getFullYear() - createdAt.getFullYear()) * 12 +
        (now.getMonth() - createdAt.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        const index = 5 - diffMonths;

        if (customer.status === "active") active[index] += 1;
        if (customer.status === "pending") pending[index] += 1;
        if (customer.status === "inactive") inactive[index] += 1;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Active",
          data: active,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.25)",
          fill: true,
          tension: 0.35,
        },
        {
          label: "Pending",
          data: pending,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.25)",
          fill: true,
          tension: 0.35,
        },
        {
          label: "Inactive",
          data: inactive,
          borderColor: "#94a3b8",
          backgroundColor: "rgba(148,163,184,0.25)",
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }, [customers, months]);

  const lineOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "#e5e7eb" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: { stepSize: 1 },
      },
    },
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
              <h3 className="dashboard-panel-title">Customer Trends Over Time</h3>
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