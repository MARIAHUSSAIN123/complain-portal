import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import Swal from "sweetalert2";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = function (e) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(function (userCredential) {

        const user = userCredential.user;

        get(ref(database, "users/" + user.uid))
          .then(function (snapshot) {

            if (snapshot.exists()) {
              const role = snapshot.val().role;

              Swal.fire("Success 🎉", "Login Successful", "success");

              if (role === "student") {
                navigate("/student");
              } else {
                navigate("/admin");
              }
            }
          })
          .catch(function (error) {
            Swal.fire("Error", error.message, "error");
          });

      })
      .catch(function (error) {
        Swal.fire("Login Failed ❌", error.message, "error");
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
          Report issues. Track progress. Manage efficiently.
        </p>
      </div>

      {/* Glass Login Card */}
      <div className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30">

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:scale-105 transition duration-300"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6 text-white/90">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold underline hover:text-yellow-200 transition"
          >
            Signup
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;