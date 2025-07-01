import subprocess
import os

env = os.environ.copy()

with open("classname.txt", "r") as f:
    class_name = f.readline().strip()

print(f"Running manim for class: {class_name}")

with open("render.log", "w") as f:
    subprocess.run(["manim",
    "generated_scene.py",
    class_name,
    "-ql",
    "--output_file", f"{class_name}.mp4"],env=env, stdout=f, stderr=subprocess.STDOUT)

