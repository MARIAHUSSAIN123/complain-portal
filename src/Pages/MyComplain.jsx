import Layout from "../components/Layout";
import { database, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

export default function MyComplain() {

  const [list, setList] = useState([]);

  useEffect(() => {

    const complaintsRef = ref(database, "complaints");

    onValue(complaintsRef, (snapshot) => {

      if (snapshot.exists()) {

        const data = snapshot.val();

        const myData = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(item => item.userId === auth.currentUser.uid);

        setList(myData);

      } else {
        setList([]);
      }

    });

  }, []);

  return (
    <Layout>

      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-6 rounded-3xl">

        <h2 className="text-3xl font-bold text-white mb-6">
          My Complaints
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {list.map((c) => (

            <div key={c.id}
              className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl text-white shadow-xl">

              <p className="font-bold text-lg">{c.category}</p>
              <p className="mt-2">{c.description}</p>
              <p className="mt-3">Status: {c.status}</p>

            </div>

          ))}

        </div>

      </div>

    </Layout>
  );
}