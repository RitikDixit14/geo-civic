import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertCircle, CheckCircle2, Clock, FileText, Activity, MapPin, Layers, Settings, Eye } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Reusable components
const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:-translate-y-1">
    <div className={`p-4 rounded-xl ${bgClass}`}>
      <Icon className={`w-8 h-8 ${colorClass}`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const Badge = ({ children, color }) => {
  const colors = {
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [mapData, setMapData] = useState([]);
  
  const fetchData = async () => {
    try {
      const [sRes, cRes, tRes, mRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/category-counts'),
        api.get('/admin/reports'),
        api.get('/dashboard/map-data')
      ]);
      setStats(sRes.data.stats);
      setCounts(cRes.data.counts);
      setTickets(tRes.data.tickets);
      setMapData(mRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await api.patch(`/admin/reports/${id}/status`, { status: newStatus });
    fetchData();
  };

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Activity className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Loading command center data...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Command Center</h2>
          <p className="text-gray-500 mt-2">Real-time civic issue tracking, analytics, and prioritization.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 font-medium shadow-sm">
          <Activity className="w-5 h-5 animate-pulse" />
          <span>Live Updates Active</span>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Reports" value={stats.total} icon={FileText} colorClass="text-gray-600" bgClass="bg-gray-100" />
        <StatCard title="Open Issues" value={stats.open} icon={AlertCircle} colorClass="text-red-600" bgClass="bg-red-100" />
        <StatCard title="In Progress" value={stats.in_progress} icon={Clock} colorClass="text-yellow-600" bgClass="bg-yellow-100" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle2} colorClass="text-green-600" bgClass="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Layers className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800">Reports by Category</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={counts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1).replace('_', ' ')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {counts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800">Geographic Hotspots</h3>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 min-h-[18rem]">
            <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: '400px', width: '100%', minHeight: '400px' }}>
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {mapData.map(m => parseFloat(m.latitude) && parseFloat(m.longitude) ? (
                <Marker key={m.ticket_id} position={[parseFloat(m.latitude), parseFloat(m.longitude)]}>
                  <Popup className="rounded-lg shadow-sm">
                    <div className="p-1">
                      <strong className="text-gray-900 block mb-1">Ticket #{m.ticket_id}</strong>
                      <div className="text-sm text-gray-600 mb-2 capitalize">{(m.category || '').replace('_', ' ')}</div>
                      <div className="flex space-x-2 mb-1">
                        <Badge color={m.severity === 'high' ? 'red' : m.severity === 'medium' ? 'yellow' : 'blue'}>
                          {m.severity}
                        </Badge>
                        <Badge color={m.status === 'Open' ? 'red' : m.status === 'In Progress' ? 'yellow' : 'green'}>
                          {m.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">Priority Score: {m.priority_score}</div>
                    </div>
                  </Popup>
                </Marker>) : null)}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Priority Tickets Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800">Priority Inbox & Triage</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Ticket ID</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Priority Score</th>
                <th className="px-6 py-4 font-semibold">Duplicates</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    No tickets found. You're all caught up!
                  </td>
                </tr>
              ) : tickets.map(t => (
                <tr key={t.ticket_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#{t.ticket_id}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">
                    {t.category.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={t.severity === 'high' ? 'red' : t.severity === 'medium' ? 'yellow' : 'blue'}>
                      {t.severity}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(t.priority_score, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{parseFloat(t.priority_score).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {t.duplicate_count > 0 ? (
                      <span className="flex items-center"><Layers className="w-4 h-4 mr-1 text-blue-400"/> {t.duplicate_count}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={t.status} 
                      onChange={e => handleStatusChange(t.ticket_id, e.target.value)}
                      className={`text-sm font-medium rounded-lg px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                        t.status === 'Open' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                        t.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                        'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

