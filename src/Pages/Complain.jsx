import Layout from "../components/Layout";
import { database } from "../firebase";
import { ref, push } from "firebase/database";
import { auth } from "../firebase";
import Swal from "sweetalert2";

export default function Complain() {

  const submit = (e) => {
    e.preventDefault();

    const category = e.target.category.value;
    const description = e.target.desc.value;

    push(ref(database, "complaints"), {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.email,
      category,
      description,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    Swal.fire("Submitted 🎉", "Complaint Added Successfully", "success");

    e.target.reset();
  };

  return (
    <Layout>

      <div className="flex justify-center items-center min-h-[80vh]">

        <form
          onSubmit={submit}
          className="bg-white/20 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md text-white space-y-6 border border-white/30"
        >

          <h2 className="text-3xl font-bold text-center mb-4">
            New Complaint
          </h2>

          <select
            name="category"
            className="w-full p-3 rounded-xl bg-white/30 text-white outline-none"
          >
            <option className="text-black">Water</option>
            <option className="text-black">Electricity</option>
            <option className="text-black">Internet</option>
            <option className="text-black">Maintenance</option>
          </select>

          <textarea
            name="desc"
            placeholder="Describe your issue..."
            className="w-full p-3 rounded-xl bg-white/30 text-white outline-none resize-none"
            rows="4"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-bold hover:scale-105 transition duration-300 shadow-lg"
          >
            Submit Complaint
          </button>

        </form>

      </div>

    </Layout>
  );
}
