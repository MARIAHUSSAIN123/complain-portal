import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire("Logged Out", "You have been logged out", "success");
        navigate("/");   // 👈 Login page pe bhej dega
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  return (
    <div className="h-14 bg-white shadow flex justify-between px-6 items-center">

      <h1 className="font-bold text-blue-600">
        Complaint Portal
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>

    </div>
  );
}