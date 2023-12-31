import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

type ChatContent = {
  user: string;
  content: string;
  messageTime: Date; // Assuming it's a timestamp
  room: string;
  email: string;
};

export const ChatRoom = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatContent, setChatContent] = useState<ChatContent[]>([]);
  const [roomName, setRoomName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const { id } = useParams();

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };
  const formatLocalDate = (date: Date) => {
    const resultDate = new Date(date);
    return resultDate.toLocaleString(); // You can customize the formatting
  };

  const CreateChat = async () => {
    addDoc(collection(db, "chatContent"), {
      user: localStorage.getItem("user"),
      content: chatInput,
      messageTime: Date.now(),
      room: id,
      email: localStorage.getItem("email"),
      chatRoomId: id,
    });
    const ChatRoomRef = doc(db, "chatRoom", `${id}`);
    await updateDoc(ChatRoomRef, {
      lastUpdateTime: Date.now(),
    });
    setChatInput("");
    // console.log("Document written with ID: ", docRef);
  };
  const fetchChatContent = () => {
    const q = query(
      collection(db, "chatContent"),
      where("chatRoomId", "==", id)
    );
    onSnapshot(q, (querySnapshot) => {
      const chatContents: ChatContent[] = [];
      querySnapshot.forEach((doc) => {
        chatContents.push(doc.data() as ChatContent);
      });
      setChatContent(chatContents);
      // console.log("chatContents", chatContents);
    });
  };
  const getRoomNameById = () => {
    onSnapshot(doc(db, "chatRoom", `${id}`), (doc) => {
      // console.log("Current data: ", doc.data());
      if (doc.data()) {
        setRoomName(doc.data()!.name);
      }
    });
  };

  const checkLoign = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLogin(true);
        console.log("Logged in ", user);
      } else {
        setIsLogin(false);
        console.log("Logged out");
      }
    });
  };

  useEffect(() => {
    fetchChatContent();
    getRoomNameById();
    checkLoign();
  }, [isLogin]);
  return (
    <div className="p-4">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{roomName}</h1>
        <div className="mb-6">
          {chatContent ? (
            chatContent
              .slice()
              .sort((a: any, b: any) => a.messageTime - b.messageTime)
              .map((content, i) =>
                localStorage.getItem("email") === content.email ? (
                  <div key={i}>
                    <div className="p-2 rounded-lg mb-2 bg-purple-500 text-white ml-auto w-3/5">
                      <p className="text-sm">
                        <strong>{content.user}</strong> -{" "}
                        {formatLocalDate(content.messageTime)}
                      </p>
                      <p>{content.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={i}>
                    <div className="p-2 rounded-lg mb-2 bg-gray-800 w-3/5">
                      <p className="text-sm">
                        <strong>{content.user}</strong> -{" "}
                        {formatLocalDate(content.messageTime)}
                      </p>
                      <p>{content.content}</p>
                    </div>
                  </div>
                )
              )
          ) : (
            <></>
          )}
        </div>
        {isLogin ? (
          <div className="flex">
            <input
              type="text"
              placeholder=""
              className="flex-grow p-2 rounded-lg border border-gray-300  text-black mr-2"
              onChange={handleInputOnChange}
              value={chatInput}
            />
            <button
              type="button"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg"
              onClick={CreateChat}
            >
              Send
            </button>
          </div>
        ) : (
          <div className="flex">
            <input
              type="text"
              placeholder="Please log in to chat"
              className="flex-grow p-2 rounded-lg border border-gray-300  text-black mr-2"
              value=""
              disabled={true}
            />
            <button
              type="button"
              disabled={true}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
