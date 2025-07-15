from manim import *

class TrigonometryExplanation(Scene):
    def construct(self):
        circle = Circle(radius=2, color=WHITE)
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            axis_config={"color": BLUE},
        )
        
        angle = 45 * DEGREES
        line = Line(ORIGIN, circle.point_at_angle(angle), color=YELLOW)
        arc = Arc(radius=0.5, start_angle=0, angle=angle, color=RED)
        
        dot = Dot(line.get_end(), color=YELLOW)
        x_line = DashedLine(line.get_end(), [line.get_end()[0], 0, 0], color=GREEN)
        y_line = DashedLine(line.get_end(), [0, line.get_end()[1], 0], color=PURPLE)
        
        self.play(Create(axes), Create(circle))
        self.wait(0.5)
        self.play(Create(line), Create(arc), Create(dot))
        self.wait(0.5)
        self.play(Create(x_line), Create(y_line))
        self.wait(2)