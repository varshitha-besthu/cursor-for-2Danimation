import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export default function Signup(){
    const navigate = useNavigate();
    const handleOnClick = async() => {
        const response = await axios.post("http://localhost:8000/signup", 
            {
                username : username,
                password: password
            },{
                withCredentials: true
            }
        )
        console.log(response.data.inserted_id)
        navigate("/signin");
    }
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    return (
        <div >
        username: <input type="text" onChange={(e) => setUsername(e.target.value)} />
        password : <input type="text" onChange={(e)=> setPassword(e.target.value)}/>
        <button onClick={handleOnClick}>Signin</button>
        </div>
    )
}