import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthService } from "../../services/auth.service";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="dashboard-page">
      <Header />
    </div>
  );
}