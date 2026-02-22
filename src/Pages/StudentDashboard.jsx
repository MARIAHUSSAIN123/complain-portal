import { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, push, onValue, remove } from "firebase/database";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function StudentDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  // 🔥 Logout
  const handleLogout = function () {
    signOut(auth).then(function () {
      navigate("/");
    });
  };

  // 🔥 Add Complaint
  const handleSubmit = function (e) {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      Swal.fire("Error", "User not logged in", "error");
      return;
    }

    const newComplaint = {
      userId: user.uid,
      userName: user.email,
      category: category,
      description: description,
      status: "pending",
      createdAt: Date.now()
    };

    push(ref(database, "complaints"), newComplaint)
      .then(function () {
        Swal.fire("Submitted 🎉", "Complaint Added Successfully", "success");
        setCategory("");
        setDescription("");
      })
      .catch(function (error) {
        Swal.fire("Error", error.message, "error");
      });
  };

  // 🔥 Realtime Fetch (Only Current User Complaints)
  useEffect(function () {

    const complaintsRef = ref(database, "complaints");

    const unsubscribe = onValue(complaintsRef, function (snapshot) {

      const data = snapshot.val() || {};
      const user = auth.currentUser;

      if (!user) return;

      let list = [];

      for (let id in data) {
        if (data[id].userId === user.uid) {
          list.push({ id: id, ...data[id] });
        }
      }

      // Sort newest first
      list.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });

      setComplaints(list);

    });

    return function () {
      unsubscribe();
    };

  }, []);

  // 🔥 Delete Complaint
  const handleDelete = function (id) {

    Swal.fire({
      title: "Are you sure?",
      text: "You can't undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then(function (result) {

      if (result.isConfirmed) {
        remove(ref(database, "complaints/" + id))
          .then(function () {
            Swal.fire("Deleted!", "Complaint removed", "success");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          Student Dashboard
        </h2>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Add Complaint Form */}
      <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-white/30 mb-10">

        <h3 className="text-xl font-semibold mb-4 text-white">
          Add New Complaint
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            value={category}
            onChange={function (e) { setCategory(e.target.value) }}
            className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-purple-400"
            required
          >
            <option value="">Select Category</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Internet">Internet</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <textarea
            placeholder="Describe your issue..."
            value={description}
            onChange={function (e) { setDescription(e.target.value) }}
            className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition duration-300"
          >
            Submit Complaint
          </button>

        </form>

      </div>

      {/* Complaint List */}
      <div className="grid md:grid-cols-2 gap-6">

        {complaints.length === 0 && (
          <div className="text-white text-lg">
            No complaints yet...
          </div>
        )}

        {complaints.map(function (item) {

          return (
            <div
              key={item.id}
              className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/30 hover:scale-105 transition duration-300"
            >
              <h4 className="text-lg font-bold text-white mb-2">
                {item.category}
              </h4>

              <p className="text-gray-200 mb-4">
                {item.description}
              </p>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>

              {item.status === "pending" && (
                <button
                  onClick={function () { handleDelete(item.id) }}
                  className="block mt-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default StudentDashboard;