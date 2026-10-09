// MEMBER 1 — FRONTEND
import { useState } from 'react';
import api from '../services/api';

export default function ReportIssue() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert('Could not get GPS location. Use manual fallback if implemented.')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !location) return alert('Please provide photo and location');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);

    try {
      const res = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.report);
    } catch (err) {
      alert('Error submitting report: ' + (err.response?.data?.error || err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  if (result) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        {result.is_duplicate ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-orange-600">DUPLICATE ISSUE DETECTED</h2>
            <div className="bg-orange-50 p-4 border border-orange-200 rounded mb-4">
              <p>Existing Ticket: #{result.ticket_id}</p>
              <p>Your report has been linked to the existing ticket.</p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-green-600">AI ANALYSIS RESULT</h2>
            <div className="bg-gray-50 p-4 border rounded mb-4">
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Severity:</strong> {result.severity}</p>
              <p><strong>Severity Score:</strong> {result.severity_score}</p>
              <p><strong>Confidence:</strong> {result.confidence * 100}%</p>
              <p><strong>Priority Score:</strong> {result.priority_score.toFixed(1)}</p>
            </div>
          </>
        )}
        <div className="bg-blue-50 p-3 text-sm text-blue-800 rounded border border-blue-200">
          ⚠ {result.ai_mode === 'demo' ? 'AI Demo Mode - Result is simulated for demonstration purposes.' : 'AI Model Mode'}
        </div>
        <button onClick={() => setResult(null)} className="mt-4 w-full bg-gray-200 py-2 rounded">Submit Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Report a City Issue</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Upload Photo</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Location</label>
          <div className="flex gap-2">
            <button type="button" onClick={handleGPS} className="bg-gray-200 px-4 py-2 rounded w-full">Get GPS Location</button>
          </div>
          {location && <p className="text-sm text-green-600 mt-1">Location selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Description (Optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" rows="3" placeholder="Describe the issue... e.g. Large pothole on main road"></textarea>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded font-semibold disabled:bg-blue-300">
          {loading ? 'Analyzing & Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
