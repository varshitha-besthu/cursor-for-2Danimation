import {Clapperboard, PanelRightClose, SquarePen} from "lucide-react"
import { useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { newChat } from "../store/newchatAtom"
import { convoId } from "../store/conversationIdAtom"
import { v4 as uuidv4 } from 'uuid';
export default function Sidebar(){
    const [sidebar, setSidebar] = useState(true)
    const setNewChat = useSetRecoilState(newChat);
    const newchat = useRecoilValue(newChat);
    const conversationId = useRecoilValue(convoId);
    const setConversationId = useSetRecoilState(convoId);
    
    return <div className={`${sidebar ? "w-[200px] bg-neutral-900" : "w-[30px] bg-neutral-800 border-r-1 border-neutral-600"}  h-screen`}>
        
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
            console.log(id)
        }}>
            <div className="flex items-center">
                <SquarePen size={"14"}/> 
                <div className={`${sidebar ? "pl-2 text-sm" : "hidden"}`}>New Chat</div>
              
            </div>
        </div>
        <div className="cursor-pointer mt-2 px-2 py-1 hover:bg-neutral-800 hover: rounded-xl hover: w-[180px] ">
            <div className="flex items-center">
                <div className={`${sidebar ? "pl-2 text-sm" : "hidden"}`}>Conversation 1</div>
              
            </div>
        </div>
        
    </div>
}