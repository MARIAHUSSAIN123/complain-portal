import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white/20 backdrop-blur-xl min-h-screen text-white shadow-xl">

      <div className="p-6 text-2xl font-bold border-b border-white/30">
        Complaint Portal
      </div>

      <nav className="p-6 space-y-4">

        <Link to="/dashboard" className="block hover:bg-white/30 p-3 rounded-xl transition">
          Dashboard
        </Link>

        <Link to="/mycomplain" className="block hover:bg-white/30 p-3 rounded-xl transition">
          My Complaint
        </Link>

        <Link to="/complain" className="block hover:bg-white/30 p-3 rounded-xl transition">
          New Complaint
        </Link>

        <Link to="/admin" className="block hover:bg-white/30 p-3 rounded-xl transition">
          Admin
        </Link>

      </nav>

    </div>
  );
}