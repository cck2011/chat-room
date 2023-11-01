import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";

// Define a type for user data
type UserData = {
  email: string;
  lastLogin: string;
  name: string;
};

export const UserList = () => {
  const [FetchData, setFetchData] = useState<UserData[]>([]); 
  
  const fetchUserData = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    let dataList: UserData[] = []; 
    querySnapshot.forEach((doc) => {
      console.log('doc', " => ", doc.data());
      dataList.push(doc.data() as UserData); 
    });
    setFetchData(dataList);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="w-full lg:w-100 mt-4 lg:mt-0 lg:ml-4">
        <h2 className="text-3xl font-bold mb-6">Users</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
          {FetchData.map((user, index) => (
            <div className="mb-4" key={index}>
              <p className="text-lg font-semibold">{user.name}</p>
              <p>{user.email}</p>
              <p className="text-gray-400">Joined: {user.lastLogin}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
