'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - Next.js E-Commerce Store",
  description: "Admin dashboard with analytics, order management, and user insights. Featuring protected routes and real-time data visualization.",
};

// Mock user data
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
}

// Mock analytics data
interface Analytics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: Array<{
    id: number;
    customer: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Helper function to get status styling
const getStatusStyle = (status: 'pending' | 'completed' | 'cancelled'): string => {
  if (status === 'completed') return 'bg-green-100 text-green-800';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Mock authentication check
  useEffect(() => {
    const checkAuth = () => {
      // Simulate checking authentication status
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (authToken && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        loadDashboardData();
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    // Simulate API delay
    setTimeout(checkAuth, 1000);
  }, []);

  // Mock login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock authentication logic
    if (loginForm.email === 'admin@example.com' && loginForm.password === 'admin123') {
      const userData = {
        id: 1,
        name: 'John Admin',
        email: 'admin@example.com',
        role: 'admin' as const,
        avatar: '👨‍💼'
      };

      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      loadDashboardData();
    } else if (loginForm.email === 'user@example.com' && loginForm.password === 'user123') {
      const userData = {
        id: 2,
        name: 'Jane User',
        email: 'user@example.com',
        role: 'user' as const,
        avatar: '👩‍💻'
      };

      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      setLoginError('Invalid credentials. Try admin@example.com/admin123 or user@example.com/user123');
    }

    setLoading(false);
  };

  // Mock logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    setAnalytics(null);
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    setAnalytics({
      totalProducts: 156,
      totalOrders: 1247,
      totalRevenue: 89650.50,
      totalUsers: 3421,
      recentOrders: [
        { id: 1001, customer: 'Alice Johnson', amount: 299.99, status: 'completed', date: '2024-01-15' },
        { id: 1002, customer: 'Bob Smith', amount: 199.99, status: 'pending', date: '2024-01-15' },
        { id: 1003, customer: 'Carol Davis', amount: 79.99, status: 'completed', date: '2024-01-14' },
        { id: 1004, customer: 'David Wilson', amount: 449.99, status: 'cancelled', date: '2024-01-14' },
        { id: 1005, customer: 'Eva Brown', amount: 129.99, status: 'completed', date: '2024-01-13' }
      ],
      topProducts: [
        { id: 1, name: 'Premium Headphones', sales: 245, revenue: 73475.55 },
        { id: 2, name: 'Smart Watch', sales: 189, revenue: 37780.11 },
        { id: 3, name: 'Laptop Stand', sales: 156, revenue: 12478.44 }
      ]
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard Login</h1>
            <p className="text-gray-600">
              This demonstrates protected routes and authentication in Next.js
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Demo Credentials:</h3>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>User:</strong> user@example.com / user123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{user?.avatar}</span>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {analytics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold">{analytics.totalProducts}</p>
                </div>
                <div className="text-3xl">📦</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                </div>
                <div className="text-3xl">🛒</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          {analytics && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id} - {order.customer}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          {analytics && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Top Products</h2>
              <div className="space-y-3">
                {analytics.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin-only section */}
        {user?.role === 'admin' && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🔐 Admin Panel</h2>
            <p className="text-gray-600 mb-4">
              This section is only visible to admin users, demonstrating role-based access control.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                Manage Products
              </button>
              <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                View Analytics
              </button>
              <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                User Management
              </button>
            </div>
          </div>
        )}

        {/* Next.js Features Explanation */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">🚀 Next.js Features Demonstrated</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Protected Routes</h3>
              <p className="text-gray-600 text-sm">
                Authentication check before accessing dashboard content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client-side State</h3>
              <p className="text-gray-600 text-sm">
                Managing authentication state with localStorage and React hooks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Role-based Access</h3>
              <p className="text-gray-600 text-sm">
                Different UI components based on user roles (admin vs user).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Form Handling</h3>
              <p className="text-gray-600 text-sm">
                Login form with validation and error handling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}