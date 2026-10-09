// MEMBER 1 — FRONTEND
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">City Issue Reporter</Link>
            <nav className="flex gap-4 items-center">
              {user ? (
                <>
                  <Link to="/report" className="hover:underline">Report Issue</Link>
                  <Link to="/my-reports" className="hover:underline">My Reports</Link>
                  <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                  <button onClick={handleLogout} className="bg-blue-800 px-3 py-1 rounded">Logout</button>
                </>
              ) : (
                <Link to="/login" className="bg-white text-blue-600 px-4 py-1 rounded font-semibold">Login</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
