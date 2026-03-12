import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { AuthService } from '../../services/auth.service';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = AuthService.getAuthData();

  useEffect(() => {
    // Verificar si hay datos de autenticación
    const { token } = AuthService.getAuthData();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.clearAuthData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">CRM Cloud</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">Welcome to your customer management system</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Deals</p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Settings</p>
                  <p className="text-2xl font-semibold text-gray-900">•••</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Add Customer</p>
                <p className="text-sm text-gray-600">Create a new customer profile</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Building2 className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Add Company</p>
                <p className="text-sm text-gray-600">Register a new company</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-sm text-gray-600">Analytics and insights</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
