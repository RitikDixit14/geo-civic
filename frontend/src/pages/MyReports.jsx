// MEMBER 1 — FRONTEND
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/reports/my').then(res => setReports(res.data.reports));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">My Reports</h2>
      <div className="grid gap-4">
        {reports.map(r => (
          <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center border-l-4 border-blue-500">
            <div>
              <p className="font-semibold text-lg capitalize">{r.category.replace('_', ' ')}</p>
              <p className="text-gray-600 text-sm">{r.description}</p>
              <p className="text-gray-400 text-xs mt-1">{new Date(r.created_at).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                r.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                r.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>{r.status}</span>
              <p className="text-sm text-gray-500 mt-2">Severity: {r.severity}</p>
            </div>
          </div>
        ))}
        {reports.length === 0 && <p>You have not reported any issues yet.</p>}
      </div>
    </div>
  );
}
