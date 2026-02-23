import Layout from "../components/Layout";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [data, setData] = useState([]);

  useEffect(() => {
    onValue(ref(database, "complaints"), (snapshot) => {
      if (snapshot.exists()) {
        setData(Object.values(snapshot.val()));
      } else {
        setData([]);
      }
    });
  }, []);

  const total = data.length;
  const pending = data.filter(c => c.status === "pending").length;
  const resolved = data.filter(c => c.status === "resolved").length;

  return (
    <Layout>

      <h2 className="text-3xl font-bold text-white mb-8">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl text-white shadow-xl">
          <h3 className="text-lg">Total Complaints</h3>
          <p className="text-5xl font-bold mt-3">{total}</p>
        </div>

        <div className="bg-yellow-400 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="text-lg">Pending</h3>
          <p className="text-5xl font-bold mt-3">{pending}</p>
        </div>

        <div className="bg-green-500 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="text-lg">Resolved</h3>
          <p className="text-5xl font-bold mt-3">{resolved}</p>
        </div>

      </div>

    </Layout>
  );
}