import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleOnClick = async () => {
        try {
            const response = await axios.post("http://localhost:8000/signup", 
                { username, password },
                { withCredentials: true }
            );
            console.log("Inserted ID:", response.data.inserted_id);
            navigate("/signin");
        } catch (error) {
            console.error("Signup failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="bg-black h-screen w-screen flex items-center justify-center">
            <div className="border border-white text-white py-8 px-12 rounded-xl">
                <div className="font-bold text-2xl text-center mb-4">Sign Up</div>
                 <div className="text-center mt-6">
                    <button
                        onClick={() => {
                        window.location.href = "http://localhost:8000/login/google";
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl"
                    >
                        Continue with Google
                    </button>
                </div>
                <InputBox text={"Username:"} type={"text"} setter={setUsername} />
                <InputBox text={"Password:"} type={"password"} setter={setPassword} />
                <div className="text-center mt-4">
                    <button 
                        onClick={handleOnClick} 
                        className="bg-white text-black px-6 py-2 rounded-2xl text-xl"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

const InputBox = ({ text, type, setter }) => {
    return (
        <div className="my-2">
            <div className="font-semibold text-xl">{text}</div>
            {/* <div className="border border-white rounded mt-1"> */}
                <input 
                    type={type} 
                    onChange={(e) => setter(e.target.value)} 
                    className="bg-black text-white px-2 py-1 border-1 border-white rounded-xl"
                />
            {/* </div> */}
        </div>
    );
};
