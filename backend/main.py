from dotenv import load_dotenv #type: ignore
import os
import subprocess
import sys
from fastapi import FastAPI # type: ignore
import re

from openai import OpenAI # type: ignore

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

app = FastAPI()

@app.get("/generate_video")
def generate_video():

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[{"role":"user","content":"You are a Manim expert. Return only valid Manim Community Edition Python code. Do not include any explanations or comments. I want just the code block, nothing else.now create a manim code for the topic explain What is machine learning  "}]
        )
        code = response.choices[0].message.content
        cleaned_code = code.replace("```python", "").replace("```", "").strip()

        with open("generated_scene.py", "w") as f:
            f.write(cleaned_code);

    
        match = re.search(r"class\s+(\w+)\s*\(\s*Scene\s*\):", cleaned_code)
        class_name = match.group(1) if match else "GeneratedScene"
        
        with open("classname.txt", "w") as f:
            f.write(class_name);

        result = subprocess.run(
            [sys.executable, "generate_manim_scene.py"],  # 
            capture_output=True,
            timeout=500,  
            text=True,
            encoding="utf-8",  
            errors="replace"
        )

    except subprocess.TimeoutExpired:
        return {"error": "Rendering timed out."}

    if result.returncode != 0:
        return {"error": result.stderr}

    return {"message": "✅ Video generated"}
