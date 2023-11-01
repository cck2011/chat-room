
import "./App.css";
import { Header } from "./Header";
// Import the functions you need from the SDKs you need

import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { ChatRoom } from "./ChatRoom";

function App() {
  // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

 
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/chatRoom/:id" element={<ChatRoom />}/>
      </Routes>
      
    </div>
  );
}

export default App;
