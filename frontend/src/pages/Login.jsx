// MEMBER 1 — FRONTEND
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthToken(res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      
      if (res.data.user.role === 'citizen') {
        navigate('/report');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-4">Login</button>
      </form>
      <div className="mt-4 text-sm text-gray-500">
        Demo Accounts:<br/>
        Citizen: john@example.com / password<br/>
        Authority: auth1@city.gov / password<br/>
        Admin: admin@city.gov / password
      </div>
    </div>
  );
}
