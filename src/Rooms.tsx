import { Link } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";

type RoomData = {
  id:string;
  name: string;
  lastUpdateTime: string;
};

export const Rooms = () => {

  const [FetchData, setFetchData] = useState<RoomData[]>([]); 
  const formatLocalDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // You can customize the formatting
  };
  const fetchRoomData = async () => {
    const q = query(collection(db, "chatRoom"));
    const querySnapshot = await getDocs(q);
    let dataList: RoomData[] = []; 
    querySnapshot.forEach((doc) => {
      const roomData = {
        id: doc.id,
        name: doc.data().name, // Assuming name is a property in doc.data()
        lastUpdateTime: doc.data().lastUpdateTime, // Assuming lastUpdateTime is a property in doc.data()
      };
      dataList.push(roomData);
    });
  
    setFetchData(dataList);
    // console.log('dataList',dataList);
  };


  useEffect(()=>{
    fetchRoomData();

  },[])
  
  return (
    <>
      <div className="flex-grow">
        <h1 className="text-3xl font-bold mb-6">Rooms</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FetchData.map((room, i) => (
            <Link to={`/chatRoom/${room.id}`} key={i}>
          <div
            role="button"
            tabIndex={0}
            
            className="p-4 bg-gray-800 rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring focus:border-blue-300 min-h-[100px]"
          >
            <h3 className="text-xl font-semibold mb-2 truncate">{room.name}</h3>
            <p className="text-gray-400">{formatLocalDate(room.lastUpdateTime)}</p>
          </div>
          </Link>
          ))}
          
        </div>
      </div>
    </>
  );
};
