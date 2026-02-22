import { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  // 🔥 Logout
  const handleLogout = function () {
    signOut(auth).then(function () {
      navigate("/");
    });
  };

  // 🔥 Realtime Fetch All Complaints
  useEffect(function () {

    const complaintsRef = ref(database, "complaints");

    const unsubscribe = onValue(complaintsRef, function (snapshot) {

      const data = snapshot.val() || {};
      let list = [];

      for (let id in data) {
        list.push({ id: id, ...data[id] });
      }

      // Newest first
      list.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });

      setComplaints(list);

    });

    return function () {
      unsubscribe();
    };

  }, []);

  // 🔄 Update Status
  const handleStatusChange = function (id, newStatus) {

    update(ref(database, "complaints/" + id), {
      status: newStatus
    })
      .then(function () {
        Swal.fire("Updated ✅", "Status Changed", "success");
      })
      .catch(function (error) {
        Swal.fire("Error", error.message, "error");
      });
  };

  // ❌ Delete Complaint
  const handleDelete = function (id) {

    Swal.fire({
      title: "Delete this complaint?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes"
    }).then(function (result) {

      if (result.isConfirmed) {
        remove(ref(database, "complaints/" + id))
          .then(function () {
            Swal.fire("Deleted!", "Complaint Removed", "success");
          });
      }

    });
  };

  // 🎨 Status Badge Style
  const getStatusStyle = function (status) {
    if (status === "pending") {
      return "bg-yellow-200 text-yellow-800";
    }
    if (status === "in-progress") {
      return "bg-blue-200 text-blue-800";
    }
    return "bg-green-200 text-green-800";
  };

  // 📊 Stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "pending").length;
  const progress = complaints.filter(c => c.status === "in-progress").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          Admin Dashboard
        </h2>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/30 text-center">
          <h3 className="text-white">Total</h3>
          <p className="text-3xl font-bold text-white mt-2">{total}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/30 text-center">
          <h3 className="text-yellow-200">Pending</h3>
          <p className="text-3xl font-bold text-yellow-200 mt-2">{pending}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/30 text-center">
          <h3 className="text-blue-200">In Progress</h3>
          <p className="text-3xl font-bold text-blue-200 mt-2">{progress}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/30 text-center">
          <h3 className="text-green-200">Resolved</h3>
          <p className="text-3xl font-bold text-green-200 mt-2">{resolved}</p>
        </div>

      </div>

      {/* Complaint List */}
      <div className="grid md:grid-cols-2 gap-6">

        {complaints.length === 0 && (
          <div className="text-white text-lg">
            No complaints available...
          </div>
        )}

        {complaints.map(function (item) {

          return (
            <div
              key={item.id}
              className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/30 hover:scale-105 transition duration-300"
            >
              <h4 className="text-lg font-bold text-white mb-1">
                {item.category}
              </h4>

              <p className="text-gray-200 mb-2">
                {item.description}
              </p>

              <p className="text-sm text-gray-300 mb-3">
                By: {item.userName}
              </p>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>

              {/* Status Dropdown */}
              <select
                value={item.status}
                onChange={function (e) {
                  handleStatusChange(item.id, e.target.value);
                }}
                className="block mt-4 p-2 rounded-xl border-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                onClick={function () { handleDelete(item.id) }}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Delete
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default AdminDashboard;