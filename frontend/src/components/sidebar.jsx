import {Clapperboard, PanelRightClose, Plus, SquarePen} from "lucide-react"
import { useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { newChat } from "../store/newchatAtom"
import { convoId } from "../store/conversationIdAtom"
import { v4 as uuidv4 } from 'uuid';
import { videosAtom } from "../store/videosAtom"
import { conversationClick } from "../store/conversationClick"
import { pictureAtom } from "../store/pictureAtom"
import { userNameAtom } from "../store/usernameAtom"

export default function Sidebar(){
    const [sidebar, setSidebar] = useState(true)
    const setNewChat = useSetRecoilState(newChat);
    const newchat = useRecoilValue(newChat);
    const conversationId = useRecoilValue(convoId);
    const setConversationId = useSetRecoilState(convoId);
    const video = useRecoilValue(videosAtom);
    const convoClick = useRecoilValue(conversationClick);
    const setConvoClick = useSetRecoilState(conversationClick);
    const userName = useRecoilValue(userNameAtom);
    const picture = useRecoilValue(pictureAtom);

    // return <div className={`${sidebar ? "z-10 md:z-0 md:max-w-[200px] md:min-w-[200px] bg-neutral-900 " : "w-[30px] bg-neutral-800 border-r-1 border-neutral-600"}  h-screen`}>
        
    //     <div className="">
    //         {/* Navbar */}
    //         <div className="flex justify-between py-2 px-2">
    //             <div className={`${sidebar ? "" : "hidden"}`}><Clapperboard size={"14"} /></div>
    //             <div><PanelRightClose size={"14"} className="cursor-pointer" onClick={() => setSidebar(!sidebar)} /></div>
    //         </div>
    //         {/*conversations and new Chat  */}

    //         <div className="cursor-pointer mt-4 p-2 hover:bg-neutral-800 hover: rounded-xl hover: w-[180px]" 
    //         onClick={() => {
    //             setNewChat(!newchat)
    //             const id = uuidv4()
    //             setConversationId(id)
    //             // console.log(id)
    //         }}>
    //             <div className={`hover:bg-neutral-400 flex items-center ${sidebar ? "bg-neutral-100 text-black px-4 py-2" : ""} rounded-xl`}>
    //                 <SquarePen size={"14"}/> 
    //                 <div className={`${sidebar ? "pl-2 text-sm" : "hidden"}`}>New Chat</div>
                
    //             </div>
    //         </div>
    //         {
    //             video.slice().reverse().map((vid, index) => (
    //                 <div className="cursor-pointer mt-2 px-2 py-1 hover:bg-neutral-800 hover: rounded-xl hover: w-[180px] " 
    //                     onClick={(e) => {
    //                         setConvoClick(() => {
    //                             const newState = {};
    //                             video.forEach((_, i) => {
    //                                 newState[i] = i === index; 
    //                             });
    //                             return newState;
    //                             });
    //                         setNewChat(!newChat)

    //                     }}
    //                     key={index}
    //                 >
    //                 <div className="flex items-center">
    //                     <div className={`${sidebar ? "pl-2 text-sm" : "hidden"} ${convoClick[index] ? "bg-neutral-800 w-full rounded-2xl py-1 " : ""}`}>Conversation {index + 1}</div>
    //                 </div>
    //                 </div>
    //             ))
    //         }
    //     </div>
        
    // <div className={`fixed bottom-2 ${sidebar ? "w-[160px] md:max-w-[190px] md:min-w-[190px] pl-1 pr-4 py-3" : "max-w-[28px] min-w-[28px] pl-1"}  bg-neutral-800 rounded-xl `}>
    //         <div className="bg-red-white flex gap-1  w-auto  ">
    //             <img src={picture} height="22px" width="22px" className="rounded-full"/>
    //             <div className={`overflow-hidden text-ellipsis whitespace-nowrap ${sidebar ? "" : "hidden"}`}>
    //                 {userName}
    //             </div>
    //         </div>

    //     </div>
        

    // </div>
    return (
  <>
    {/* Toggle button for small screens */}
    <div className="md:hidden fixed top-2 left-2 z-50">
      <button
        className="bg-neutral-900 p-2 rounded-md"
        onClick={() => setSidebar(!sidebar)}
      >
        <PanelRightClose size={18} />
      </button>
    </div>

    {/* Sidebar */}
    <div
      className={`
        fixed md:relative top-0 left-0 h-full bg-neutral-900 transition-transform duration-300 z-40
        ${sidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        w-[200px] md:min-w-[200px] md:max-w-[200px]
      `}
    >
      <div className="p-2">
        <div className="flex justify-between items-center">
          <Clapperboard size={18} />
          <button className="md:hidden" onClick={() => setSidebar(false)}>
            <PanelRightClose size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div
          className="cursor-pointer mt-4 p-2 hover:bg-neutral-800 rounded-xl"
          onClick={() => {
            setNewChat(!newchat);
            const id = uuidv4();
            setConversationId(id);
          }}
        >
          <div className="flex items-center bg-neutral-100 text-black px-4 py-2 rounded-xl">
            <SquarePen size={14} />
            <div className="pl-2 text-sm">New Chat</div>
          </div>
        </div>
        

        {/* Conversation List */}
        {video
          .slice()
          .reverse()
          .map((vid, index) => (
            <div
              key={index}
              className="cursor-pointer   py-1 hover:bg-neutral-800 rounded-xl"
              onClick={() => {
                setConvoClick(() => {
                  const newState = {};
                  video.forEach((_, i) => {
                    newState[i] = i === index;
                  });
                  return newState;
                });
                setNewChat(!newChat);
              }}
            >
              <div
                className={` py-2 px-4 text-sm ${
                  convoClick[index]
                    ? "bg-neutral-800 w-full rounded-xl "
                    : ""
                }`}
              >
                Conversation {index + 1}
              </div>
            </div>
          ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="absolute bottom-2 left-2 right-2 bg-neutral-800 rounded-xl px-2 py-3 flex items-center gap-2">
        <img
          src={picture}
          alt="User"
          height="22"
          width="22"
          className="rounded-full"
        />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {userName}
        </span>
      </div>
    </div>
  </>
);

    
}

