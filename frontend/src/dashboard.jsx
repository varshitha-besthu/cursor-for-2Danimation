import axios from "axios";
import { useEffect, useState } from "react";
import VideoPlayer from "./videoplayer";

export default function DashBoard() {
  const [prompt, setPrompt] = useState("");
  const [videos, setVideos] = useState([]); // list of {prompt, url}

  // ✅ Fetch videos on component mount
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

  const handleOnClick = async () => {
    try {
      // Step 1: Generate the video
      const generateRes = await axios.post(
        "http://localhost:8000/generate_video",
        { prompt },
        { withCredentials: true }
      );
      const newUrl = generateRes.data.data.url;

      // Step 2: Add to user's video list
      const addRes = await axios.post(
        "http://localhost:8000/addVideo",
        { prompt, url: newUrl },
        { withCredentials: true }
      );

      // Step 3: Update UI
      setVideos((prev) => [...prev, { prompt, url: newUrl }]);
      setPrompt(""); // clear input
    } catch (err) {
      console.error("Error generating or adding video:", err);
    }
  };

  return (
    <div>
      <h2>Enter a prompt to generate a video</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button onClick={handleOnClick}>Submit</button>

      <h2>Your Videos</h2>
      {videos.length === 0 ? (
        <p>No videos yet</p>
      ) : (
        videos.map((video, index) => (
          <div key={index}>
            <p><strong>{video.prompt}</strong></p>
            <VideoPlayer url={video.url} />
            <hr />
          </div>
        ))
      )}
    </div>
  );
}
