import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import Swal from "sweetalert2";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleSignup = function (e) {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(function (userCredential) {

        const user = userCredential.user;

        set(ref(database, "users/" + user.uid), {
          name: name,
          email: email,
          role: role
        })
          .then(function () {
            Swal.fire("Account Created 🎉", "Signup Successful", "success");
            navigate("/");
          })
          .catch(function (error) {
            Swal.fire("Error", error.message, "error");
          });

      })
      .catch(function (error) {
        Swal.fire("Signup Failed ❌", error.message, "error");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6">

      {/* Top Branding */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          Complaint Management Portal
        </h1>
        <p className="text-white/80 mt-3 text-lg">
          Create your account and start reporting issues
        </p>
      </div>

      {/* Glass Signup Card */}
      <div className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30">

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Create Your Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">

          <input
            type="text"
            placeholder="Enter Name"
            className="w-full p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={function (e) { setName(e.target.value) }}
            required
          />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={function (e) { setEmail(e.target.value) }}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={function (e) { setPassword(e.target.value) }}
            required
          />

          <select
            className="w-full p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={function (e) { setRole(e.target.value) }}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:scale-105 transition duration-300"
          >
            Signup
          </button>

        </form>

        <p className="text-center mt-6 text-white/90">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold underline hover:text-yellow-200 transition"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;