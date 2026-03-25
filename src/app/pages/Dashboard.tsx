import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthService } from "../../services/auth.service";

// chart.js + react-chartjs-2
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

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ===== Datos quemados para las tarjetas y gráficos =====
  const totalCustomers = 11;
  const activeCustomers = 27;
  const pendingReview = 65;
  const inactiveCustomers = 47;

  // Distribución por estado (para el pie, porcentajes como el diseño)
  const statusDistributionData = {
    labels: ["Active", "Pending", "Inactive"],
    datasets: [
      {
        data: [63, 25, 13],
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
          label: (ctx: TooltipItem<'doughnut'>) => {
            const label = ctx.label || "";
            const value = ctx.parsed || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  // Nuevos clientes por mes (bar)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const newCustomersByMonth = [13, 15, 18, 22, 19, 25];

  const newCustomersGrowthData = {
    labels: months,
    datasets: [
      {
        label: "New Customers",
        data: newCustomersByMonth,
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
        ticks: { stepSize: 7 },
        suggestedMax: 28
      }
    }
  };

  // Tendencias por estado en 6 meses (área)
  const customerTrendsOverTimeData = {
    labels: months,
    datasets: [
      {
        label: "Active",
        data: [40, 45, 52, 60, 68, 10],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.35)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Pending",
        data: [8, 9, 10, 11, 12, 3],
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.35)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Inactive",
        data: [5, 6, 7, 8, 9, 2],
        borderColor: "#6b7280",
        backgroundColor: "rgba(107,114,128,0.35)",
        fill: true,
        tension: 0.4
      }
    ]
  };

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
        grid: { color: "#e5e7eb" }
      }
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header de tu app */}
      <Header />

      {/* Contenido principal del dashboard */}
      <main className="dashboard-main">
        {/* Título sección */}
        <section className="dashboard-header">
          <h2 className="dashboard-title">Analytics</h2>
          <p className="dashboard-subtitle">
            Overview of your customer performance and trends
          </p>
        </section>

        {/* Tarjetas resumen */}
        <section className="dashboard-cards">
          <article className="dashboard-card">
            <p className="dashboard-card-label">Total Customers</p>
            <p className="dashboard-card-value">{totalCustomers}</p>
            <p className="dashboard-card-helper dashboard-card-helper--success">
              ↑ +12% from last month
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-card-label">Active Customers</p>
            <p className="dashboard-card-value">{activeCustomers}</p>
            <p className="dashboard-card-helper">
              {((activeCustomers / totalCustomers) * 100).toFixed(1)}% of total
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-card-label">Pending Review</p>
            <p className="dashboard-card-value">{pendingReview}</p>
            <p className="dashboard-card-helper dashboard-card-helper--warning">
              Requires attention
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-card-label">Inactive</p>
            <p className="dashboard-card-value">{inactiveCustomers}</p>
            <p className="dashboard-card-helper">
              {((inactiveCustomers / totalCustomers) * 100).toFixed(1)}% of
              total
            </p>
          </article>
        </section>

        {/* Fila de gráficos 1 */}
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
                  Active 63%
                </span>
                <span className="status-label status-label--pending">
                  Pending 25%
                </span>
                <span className="status-label status-label--inactive">
                  Inactive 13%
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

        {/* Fila de gráficos 2 */}
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