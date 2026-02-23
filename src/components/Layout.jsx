import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-8">
          {children}
        </div>

      </div>

    </div>
  );
}