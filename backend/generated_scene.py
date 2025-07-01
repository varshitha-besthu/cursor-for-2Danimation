from manim import *

class MachineLearningExplanation(Scene):
    def construct(self):
        title = Text("Machine Learning", font_size=48).to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        data_points = VGroup(*[
            Dot(point, color=BLUE) for point in [
                np.array([-3, 1, 0]),
                np.array([-2, 2, 0]),
                np.array([-1, 0.5, 0]),
                np.array([1, -1, 0]),
                np.array([2, -0.5, 0]),
                np.array([3, -2, 0])
            ]
        ])

        model = Square(color=RED).scale(1.5).shift(RIGHT*3)
        model_label = Text("Model", color=RED).next_to(model, DOWN)

        self.play(Create(data_points))
        self.wait(0.5)
        self.play(data_points.animate.shift(LEFT*3))
        self.wait()

        self.play(Create(model), Write(model_label))
        self.wait()

        arrows = VGroup(*[
            Arrow(data_point.get_center(), model.get_left(), buff=0.1)
            for data_point in data_points
        ])

        self.play(LaggedStart(*[Create(arrow) for arrow in arrows], lag_ratio=0.2))
        self.wait()

        output = Text("Predictions", color=GREEN).next_to(model, RIGHT*2)
        self.play(Transform(arrows, Arrow(model.get_right(), output.get_left(), color=GREEN).scale(2)))
        self.play(Write(output))
        self.wait(2)

        learning_process = Text("Learns patterns from data", color=YELLOW).next_to(title, DOWN)
        self.play(Write(learning_process))
        self.wait(2)

        self.play(*[FadeOut(mob) for mob in self.mobjects])