import {Clapperboard, PanelRightClose, SquarePen} from "lucide-react"
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

    return <div className={`${sidebar ? "max-w-[200px] min-w-[200px] bg-neutral-900 " : "w-[30px] bg-neutral-800 border-r-1 border-neutral-600"}  h-screen`}>
        
        <div className="">
            {/* Navbar */}
            <div className="flex justify-between py-2 px-2">
                <div className={`${sidebar ? "" : "hidden"}`}><Clapperboard size={"14"} /></div>
                <div><PanelRightClose size={"14"} className="cursor-pointer" onClick={() => setSidebar(!sidebar)} /></div>
            </div>
            {/*conversations and new Chat  */}

            <div className="cursor-pointer mt-4 p-2 hover:bg-neutral-800 hover: rounded-xl hover: w-[180px]" 
            onClick={() => {
                setNewChat(!newchat)
                const id = uuidv4()
                setConversationId(id)
                // console.log(id)
            }}>
                <div className="flex items-center">
                    <SquarePen size={"14"}/> 
                    <div className={`${sidebar ? "pl-2 text-sm" : "hidden"}`}>New Chat</div>
                
                </div>
            </div>
            {
                video.slice().reverse().map((vid, index) => (
                    <div className="cursor-pointer mt-2 px-2 py-1 hover:bg-neutral-800 hover: rounded-xl hover: w-[180px] " 
                        onClick={(e) => {
                            setConvoClick(() => {
                                const newState = {};
                                video.forEach((_, i) => {
                                    newState[i] = i === index; 
                                });
                                return newState;
                                });
                            setNewChat(!newChat)

                        }}
                        key={index}
                    >
                    <div className="flex items-center">
                        <div className={`${sidebar ? "pl-2 text-sm" : "hidden"} ${convoClick[index] ? "bg-neutral-800 w-full rounded-2xl py-1 " : ""}`}>Conversation {index + 1}</div>
                    </div>
                    </div>
                ))
            }
        </div>
        
        <div className="fixed bottom-2 max-w-[190px] bg-neutral-800 rounded-xl">
            <div className="bg-red-white flex gap-1 pl-1 pr-4 py-3 w-auto  ">
                <img src={picture} height="22px" width="22px" className="rounded-full"/>
                <div className={`overflow-hidden text-ellipsis whitespace-nowrap ${sidebar ? "" : "hidden"}`}>
                    {userName}
                </div>
            </div>

        </div>
        

    </div>
    
}