import axios from "axios";
import { useRecoilValue } from "recoil";
import { convoId } from "../store/conversationIdAtom";
import { useState } from "react";
import VideoPlayer from "../videoplayer";

export default function Chat(){
    const conversationId = useRecoilValue(convoId);
    const [prompt, setPrompt] = useState("");
    const [video, setVideos] = useState([]);
    
    const handleOnClick = async () => {
        try {
        const generateRes = await axios.post(
            "http://localhost:8000/generate_video",
            { prompt, conversationId},
            { withCredentials: true }
        );
        const newUrl = generateRes.data.data.url;
        
        // const addRes = await axios.post(
        //     "http://localhost:8000/addVideo",
        //     { prompt, url: newUrl, conversationId },
        //     { withCredentials: true }
        // );

        setVideos((prev) => [...prev, { prompt, url: newUrl,conversationId }]);
        console.log(video)
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

    {
        if(video.length === 0){
            return (
            <div className="h-screen w-screen flex items-center justify-center">
                <div>
                    <div className="text-4xl text-center mb-4">How can I help you today??</div>
                        <div>
                            <textarea name="message" rows="5" cols="75 " className="rounded-3xl bg-neutral-700 outline-none border-none pl-4 pt-2 text-md" placeholder="Ask Anything here" onKeyDown={handleKeyDown} onChange={(e) => setPrompt(e.target.value)}>
                                
                            </textarea>
                        </div>
                    </div>
            </div>
            )
        }
        return (
            <div className=" w-screen flex-col justify-end pb-56 pt-4 pr-4 overflow-auto custom-scrollbar">
                {
                    video.map((video, index) => (

                        <div key={index} className="  text-right relative ">
                            <span className="bg-neutral-600 rounded-xl w-auto px-4 py-2">{video.prompt}</span>
                            <VideoPlayer url={video.url} />
                            
                        </div>
                        
                    ))
                }
                <div className="text-center fixed bottom-0 flex justify-center w-full">
                    <textarea name="message" rows="5" cols="200" className="rounded-3xl bg-neutral-700 outline-none border-none pl-4 pt-2 text-md" placeholder="Ask Anything here" onKeyDown={handleKeyDown} onChange={(e) => setPrompt(e.target.value)}>
                                
                            </textarea>
                </div>
            </div>
      
        )
    }
  
 
    
}