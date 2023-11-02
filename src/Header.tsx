import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider, db } from "./firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Required for side-effects
import "firebase/firestore";
import Popup from "./Popup";
export const Header = () => {
  const [isLogin, setIsLogin] = useState("false");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleCreateRoom = () => {

    CreateRoom();
    togglePopup();
  };
  const CreateRoom = async () => {
 addDoc(collection(db, "chatRoom"), {
        name: inputValue,
        lastUpdateTime: Date.now(),
      });
      setInputValue("");
      setIsOpen(false);
      // console.log("Document written with ID: ", docRef);
  };

  const checkRepeatUser = async (email: string) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    // console.log("docSnap.exists()", !querySnapshot.empty);
    if (!querySnapshot.empty) {
      return true;
    }
    return false;
  };
  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        // console.log("user", user);
        if (token && user.email && user.displayName) {
          localStorage.setItem("login", "true"); // Convert to string
          localStorage.setItem("email", user.email);
          localStorage.setItem("user", user.displayName);
        }
        if (user.email) {
          const userExists = await checkRepeatUser(user.email);
          if (userExists) {
          } else {
addDoc(collection(db, "users"), {
              name: user.displayName,
              email: user.email,
              lastLogin: user.metadata.creationTime,
            });
            // console.log("Document written with ID: ", docRef);
          }

          setIsLogin("true");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, email, credential);
      });
  };
  const checkLoign = () =>{
    onAuthStateChanged(auth, async (user)=>{
      if(user){
          setIsLogin("true")
          console.log("Logged in ", user)
      }else{
        setIsLogin("false")
          console.log("Logged out");
      }
  })
  }
  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsLogin("false");
      // Sign-out successful.
    }).catch((error: any) => {
     console.log(error)
    });
    
    
  };

  useEffect(() => {
    checkLoign()
    // console.log(isOpen);
  }, []);

  return (
    <>
      <nav className="border-b border-purple-700 p-4 flex justify-between">
        <a className="text-purple-500 hover:text-purple-700" href="/">
          Rooms
        </a>
        {isLogin == "true" ? (
          <>
            <button
              className="text-purple-500 hover:text-purple-700"
              type="button"
              onClick={togglePopup}
            >
              Create Room
            </button>
            {isOpen && (
              <Popup
                content={
                  <div>
                    <form>
                      <div className="mt-10">
                        <input
                          type="text"
                          required
                          className="p-2 rounded w-full text-black"
                          placeholder="Room Name"
                          value={inputValue}
                          onChange={handleOnchange}
                        />
                      </div>
                      <div className="mt-4 flex justify-center">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded text-white bg-purple-300 cursor-not-allowed"
                          onClick={handleCreateRoom}
                        >
                          Create Room
                        </button>
                      </div>
                    </form>
                  </div>
                }
                handleClose={togglePopup}
              />
            )}
            <button
              className="text-purple-500 hover:text-purple-700"
              type="submit"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            className="text-purple-500 hover:text-purple-700"
            type="submit"
            onClick={googleLogin}
          >
            Sign in
          </button>
        )}
      </nav>
    </>
  );
};
