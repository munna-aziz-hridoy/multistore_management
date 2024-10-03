import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase.init";

const useUserInfo = (email) => {
  const [db_id, setDb_id] = useState("");
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInfo = () => {
    if (email) {
      setLoading(true);
      const q = query(
        collection(firestore, "users"),
        where("email", "==", email)
      );

      getDocs(q).then((data) => {
        if (!data.empty) {
          const user = data.docs[0];

          console.log(user);

          setDb_id(user.id);
          const sites = user.data()?.sites || [];
          setSites(sites);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [email]);

  const refetch = () => {
    fetchInfo();
  };

  return { db_id, sites, refetch, loading };
};

export default useUserInfo;
