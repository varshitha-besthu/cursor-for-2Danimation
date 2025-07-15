import axios from "axios";
import { useState } from "react"
import VideoPlayer from "./videoplayer";

export default function DashBoard(){
    const [prompt, setPrompt] = useState("");
    const [url, setUrl] = useState("");
    const handleOnClick = async() => {
        console.log(prompt)
        const response = await axios.post("http://127.0.0.1:8000/generate_video", {
            prompt: prompt
        })
        setUrl(response.data.data.url)
        console.log(url)
    }
    return <div>
        Enter the prompt!! <br />
        <input type="text" onChange={(e) => setPrompt(e.target.value) }/>
        <button onClick={handleOnClick}> Submit </button>
        <VideoPlayer url = {url}/>
    </div>
}