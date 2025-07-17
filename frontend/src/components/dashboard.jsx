import axios from "axios";
import { useEffect, useState } from "react";
import VideoPlayer from "../videoplayer";
import Sidebar from "./sidebar";
import Chat from "./mainLayout";
import { useRecoilState, useRecoilValue } from "recoil";
import { newChat } from "../store/newchatAtom";
import { convoId } from "../store/conversationIdAtom";

export default function DashBoard() {
  const [videos, setVideos] = useState([]); 
  const isNewChat = useRecoilValue(newChat)
  const conversationId = useRecoilValue(convoId);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/myVideos", {
          withCredentials: true, // Send cookie
        });
        setVideos(response.data.videos);
      } catch (err) {
        console.error("Failed to load videos", err);
      }
    };
    fetchVideos();
  }, []);

 

  return (
    <div className="bg-neutral-800 w-screen h-screen text-white flex">
        <Sidebar />
        {isNewChat ? <Chat /> : conversationId}
    </div>
  );
}
