import { useEffect, useRef, useState } from "react";
import {
  Cloud,
  LayoutGrid,
  Users,
  CircleUserRound,
  LogOut,
  ChevronDown,
  PencilLine,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import EditProfileModal from "./EditProfileModal";
import "../styles/header.scss";

export default function Header() {
  const navigate = useNavigate();
  const { user } = AuthService.getAuthData();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const userName = user?.name || "User";

  const [currentUser, setCurrentUser] = useState<User | null>(AuthService.getAuthData().user);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleEditProfile = () => {
    setIsMenuOpen(false);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => setIsEditOpen(false);

  const handleSaveProfile = (updated: User) => {
    setCurrentUser(updated);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);

    if (typeof AuthService.clearAuthData === "function") {
      AuthService.clearAuthData();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="crm-header">
      <div className="crm-header__container">
        <div className="crm-header__brand">
          <div className="crm-header__logo">
            <Cloud size={28} strokeWidth={2.2} />
          </div>

          <div className="crm-header__brand-text">
            <h1 className="crm-header__title">Orbit</h1>
            <p className="crm-header__subtitle">Cloud Migration MVP</p>
          </div>
        </div>

        <div className="crm-header__actions">
          <nav className="crm-header__nav" aria-label="Primary navigation">
            <NavLink
              to="/dashboard"
              onClick={handleCloseMenu}
              className={({ isActive }) =>
                `crm-header__nav-item ${isActive ? "is-active" : ""}`
              }
            >
              <LayoutGrid size={20} />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/customers"
              onClick={handleCloseMenu}
              className={({ isActive }) =>
                `crm-header__nav-item ${isActive ? "is-active" : ""}`
              }
            >
              <Users size={20} />
              <span>Customers</span>
            </NavLink>
          </nav>

          <div className="crm-header__profile-wrapper" ref={menuRef}>
            <button
              type="button"
              className="crm-header__profile"
              onClick={handleToggleMenu}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <CircleUserRound size={22} />
              <span className="crm-header__profile-name">{currentUser?.name || userName}</span>
              <ChevronDown
                size={18}
                className={`crm-header__chevron ${isMenuOpen ? "is-open" : ""}`}
              />
            </button>

            {isMenuOpen && (
              <div className="crm-header__dropdown" role="menu">
                <div className="crm-header__dropdown-title">My Account</div>

                <button
                  type="button"
                  className="crm-header__dropdown-item"
                  onClick={handleEditProfile}
                >
                  <PencilLine size={18} />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  className="crm-header__dropdown-item"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditOpen && (
        <EditProfileModal isOpen={isEditOpen} onClose={handleCloseEdit} onSave={handleSaveProfile} />
      )}
    </header>
  );
}