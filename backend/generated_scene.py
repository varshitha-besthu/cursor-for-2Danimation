from manim import *

class HelloScene(Scene):
    def construct(self):
        hello = Text("Hello, Manim!", font_size=48)
        self.play(Write(hello))
        self.wait(1)
        self.play(FadeOut(hello))