import { Cloud, LayoutGrid, Users, CircleUserRound } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AuthService } from "../../services/auth.service";
import "../styles/header.scss";

export default function Header() {
  const location = useLocation();
  const { user } = AuthService.getAuthData();

  const isAnalyticsActive = location.pathname === "/dashboard";
  const userName = user?.name || "User";

  return (
    <header className="crm-header">
      <div className="crm-header__container">
        <div className="crm-header__brand">
          <div className="crm-header__logo">
            <Cloud size={28} strokeWidth={2.2} />
          </div>

          <div className="crm-header__brand-text">
            <h1 className="crm-header__title">CRM Analytics</h1>
            <p className="crm-header__subtitle">Cloud Migration MVP</p>
          </div>
        </div>

        <div className="crm-header__actions">
          <nav className="crm-header__nav" aria-label="Primary navigation">
            <button
              type="button"
              className={`crm-header__nav-item ${isAnalyticsActive ? "is-active" : ""}`}
              aria-current={isAnalyticsActive ? "page" : undefined}
            >
              <LayoutGrid size={20} />
              <span>Analytics</span>
            </button>

            <button type="button" className="crm-header__nav-item">
              <Users size={20} />
              <span>Customers</span>
            </button>
          </nav>

          <button type="button" className="crm-header__profile">
            <CircleUserRound size={22} />
            <span>{userName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}