from dotenv import load_dotenv #type: ignore
import os
import subprocess
import sys
from fastapi import FastAPI # type: ignore
import re
from router.user import userRouter
from openai import OpenAI # type: ignore
from fastapi.middleware.cors import CORSMiddleware
# from router.upload import router as uploadRouter
from libs.cloudinary import upload_video
from starlette.concurrency import run_in_threadpool
from pydantic import BaseModel

 
class PromptRequest(BaseModel):
    prompt: str

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

app = FastAPI()
origins = [
     "http://localhost:5173",
]
app.include_router(userRouter)
# app.include_router(uploadRouter)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)
   
@app.post("/generate_video")
async def generate_video(promptRequest: PromptRequest):
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat-v3-0324:free",
            messages=[{"role":"user","content":f"You are a Manim expert. Return only valid Manim Community Edition Python code. Do not include any explanations or comments. I want just the code block, nothing else. Avoid using any external libraries like scipy, numpy, or networkx. Use only core Manim features. Keep the code minimal, with one class .Add import statment for manim. Now create a Manim animation to explain {promptRequest.prompt}."}]
        )
        code = response.choices[0].message.content
        cleaned_code = code.replace("```python", "").replace("```", "").strip()

        with open("generated_scene.py", "w", encoding="utf-8") as f:
            f.write(cleaned_code);
        match = re.search(r"class\s+(\w+)\s*\(\s*Scene\s*\):", cleaned_code)
        class_name = match.group(1) if match else "GeneratedScene"
        # class_name="HelloScene"
        # class_name="HelloWorld"
        with open("classname.txt", "w") as f:
            f.write(class_name);
        print("About to start rendering...")

        # result = subprocess.run(
        #     [sys.executable, "generate_manim_scene.py"],  # 
        #     capture_output=True,
        #     timeout=500,  
        #     text=True,
        #     encoding="utf-8",  
        #     errors="replace"
        # )
        result = await run_in_threadpool(render_video_sync)
    
        with open("classname.txt", "r", encoding="utf-8") as f:
            class_name = f.readline().strip()

        video_path = rf"C:\Users\varsh\Desktop\2D-animations-video\backend\media\videos\generated_scene\480p15\{class_name}.mp4"

        if not os.path.exists(video_path):
            return {"error": "Video file not found."}
        url = upload_video(video_path)
        # return {"data": {"url": url}} 
        
    except subprocess.TimeoutExpired:
        return {"error": "Rendering timed out."}

    if result.returncode != 0:
        return {"error": result.stderr}

    return {"message": "✅ Video generated" , "data" : {"url": url}};

def render_video_sync():
    print("Started to run the generate_manim_scene")
    result = subprocess.run(
            [sys.executable, "generate_manim_scene.py"],  # 
            capture_output=True,
            timeout=500,  
            text=True,
            encoding="utf-8",  
            errors="replace"
        )
    # print("Runned the generate_manim_scene")
    return result
