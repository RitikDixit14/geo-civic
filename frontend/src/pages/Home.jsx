// MEMBER 1 — FRONTEND
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Everyday city problems ko report aur prioritize karne wala AI-based platform</h1>
      <p className="text-gray-600 mb-8 text-xl">Upload a photo, and our AI will automatically categorize the issue, assess severity, and notify authorities.</p>
      
      <div className="flex gap-4 justify-center">
        <Link to="/report" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700">Report an Issue</Link>
        <Link to="/dashboard" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-gray-300">Authority Dashboard</Link>
      </div>
    </div>
  );
}
