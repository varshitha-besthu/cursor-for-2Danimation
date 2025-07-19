import axios from "axios";
import { useEffect, useState } from "react";
import VideoPlayer from "../videoplayer";
import Sidebar from "./sidebar";
import Chat from "./mainLayout";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { newChat } from "../store/newchatAtom";
import { convoId } from "../store/conversationIdAtom";
import { videosAtom } from "../store/videosAtom";
import { conversationClick } from "../store/conversationClick";
import { userNameAtom } from "../store/usernameAtom";
import { pictureAtom } from "../store/pictureAtom";

export default function DashBoard() {
  // const [videos, setVideos] = useState([]); 
  const videos = useRecoilValue(videosAtom);
  const setVideos = useSetRecoilState(videosAtom)
  const isNewChat = useRecoilValue(newChat)
  const convoClick = useRecoilValue(conversationClick);
  const setConvoClick = useSetRecoilState(conversationClick);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [currentVideo, setCurrentVideo] = useState([]);

  const userName = useRecoilValue(userNameAtom);
  const picture = useRecoilValue(pictureAtom);
  const setUserName = useSetRecoilState(userNameAtom);

  const setPicture = useSetRecoilState(pictureAtom);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        
        const response = await axios.get("http://localhost:8000/grouped_by_conversation", {
          withCredentials: true, 
        });
        const user = await axios.get("http://localhost:8000/userInfo",{withCredentials : true});
        console.log(user.data);
        setUserName(user.data.name);
        setPicture(user.data.picture);

        setVideos(response.data);
        
      } catch (err) {
        console.error("Failed to load videos", err);
      }
    };
    fetchVideos();
  }, [isNewChat]);

  useEffect(() => {
  //   console.log(videos)
  //   console.log(convoClick);
  }, [videos])

    const handleOnClick = async () => {
        try {
          setLoading(true)
        let selectedconversationId = "";
        const keys = Object.keys(convoClick).reverse();

        for (const key of keys) {
          if (convoClick[key] === true) {
            console.log("ccideos:", videos[key][0]);
            selectedconversationId = videos[key][0].conversationId;
            break;
          }
        }
 
        const generateRes = await axios.post(
              "http://localhost:8000/generate_video",
              { prompt:prompt, conversationId:selectedconversationId},
              { withCredentials: true }
        );

        

          const newUrl = generateRes.data.data.url;
          setCurrentVideo((prev) => [...prev, { prompt, url: newUrl, selectedconversationId }]);
          setLoading(false)
          setPrompt(""); 

        } catch (err) {
          console.error("Error generating or adding video:", err);
        }
  };
   const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleOnClick();
    }
  };

  return (
    <div className="bg-neutral-800 w-screen h-screen text-white flex ">
        <Sidebar />
        {/* {console.log(newChat)} */}
        {isNewChat && <Chat />}

        {!isNewChat && (
          <div className="w-screen overflow-auto custom-scrollbar pb-32">
            <div className=" pr-4 pt-4  ">
              {videos.map((video, index) => {
                if (convoClick[index]) {
                  return (
                    <div key={index}>
                      {video.map((vid, i) => (
                        <div key={i}>
                          <div className="flex justify-end">
                                <div className="bg-neutral-200 text-neutral-800 text-mono rounded-xl px-4 py-2 text-start w-[800px] text-xl ">{vid.prompt}</div>
                          </div>
                          <VideoPlayer url={vid.url} />
                        </div>
                      ))}
                      <div className="text-end flex justify-end ">
                          <div className="flex">
                              <span className={`bg-white text-black  rounded-xl flex gap-2 ${loading ? "px-4 py-2" : ""}`}>
                                  {loading && <svg
                              className="animate-spin h-8 w-8 text-purple-500 "
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              >
                              <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                              ></circle>
                              <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                              </svg>}
                                  {`${loading ? "loading..." : ""}`}
                                  
                              </span>
                          </div> 
                      </div>

                      <div className={`text-center fixed bottom-0 flex justify-center items-end  w-full`}>
                          <textarea name="message" rows="5" cols="100" className="rounded-3xl bg-neutral-700 outline-none border-none pl-4 pt-2 text-md mb-4" placeholder="Ask Anything here" onKeyDown={handleKeyDown} onChange={(e) => setPrompt(e.target.value)} value={prompt}>
                                        
                          </textarea>
                          
                      </div>

                    </div>
                  );
                }
                return null;
              })}
              

              

            </div>
          </div>
            
          )}

        

    </div>
  );
}
