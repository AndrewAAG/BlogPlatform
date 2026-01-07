import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Placeholder for Home Page */}
            <Route path="/" element={
              <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm">
                  <h1 className="text-2xl font-bold mb-4 text-slate-900">Welcome to DevBlog!</h1>

                  <div className="bg-slate-100 p-4 rounded-lg mb-6">
                    <h2 className="font-semibold mb-2 text-slate-800">Debug Info (JWT Verification)</h2>
                    <AuthDebug />
                  </div>

                  <div className="flex gap-4">
                    <a href="/login" className="text-primary-600 hover:underline">Login</a>
                    <span className="text-slate-300">|</span>
                    <a href="/register" className="text-primary-600 hover:underline">Register</a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const AuthDebug = () => {
  const { token, isAuthenticated, logout } = useAuth();
  return (
    <div className="text-sm font-mono flex flex-col gap-2 text-slate-700">
      <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
      <p className="break-all"><strong>Token:</strong> {token ? `${token.substring(0, 15)}...` : 'None'}</p>
      {isAuthenticated && (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded text-xs w-fit hover:bg-red-600"
        >
          Logout Check
        </button>
      )}
    </div>
  )
}

export default App;
