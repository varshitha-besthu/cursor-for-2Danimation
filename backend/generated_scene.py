from manim import *

class NeuralNetworkAnimation(Scene):
    def construct(self):
        input_layer = VGroup(
            *[Circle(radius=0.3, color=BLUE).set_fill(BLUE, opacity=0.5) for _ in range(3)]
        ).arrange(DOWN, buff=1)
        
        hidden_layer = VGroup(
            *[Circle(radius=0.3, color=GREEN).set_fill(GREEN, opacity=0.5) for _ in range(4)]
        ).arrange(DOWN, buff=0.6).shift(RIGHT * 2)
        
        output_layer = VGroup(
            *[Circle(radius=0.3, color=RED).set_fill(RED, opacity=0.5) for _ in range(2)]
        ).arrange(DOWN, buff=1.5).shift(RIGHT * 4)
        
        input_label = Text("Input Layer").next_to(input_layer, UP)
        hidden_label = Text("Hidden Layer").next_to(hidden_layer, UP)
        output_label = Text("Output Layer").next_to(output_layer, UP)
        
        self.play(
            LaggedStart(
                *[FadeIn(circle) for circle in input_layer],
                *[FadeIn(circle) for circle in hidden_layer],
                *[FadeIn(circle) for circle in output_layer],
                lag_ratio=0.2
            )
        )
        self.play(
            Write(input_label),
            Write(hidden_label),
            Write(output_label)
        )
        
        connections = []
        for in_node in input_layer:
            for h_node in hidden_layer:
                connections.append(Line(in_node, h_node, stroke_width=1, color=WHITE))
        
        for h_node in hidden_layer:
            for out_node in output_layer:
                connections.append(Line(h_node, out_node, stroke_width=1, color=WHITE))
        
        self.play(
            LaggedStart(
                *[Create(connection) for connection in connections],
                lag_ratio=0.05
            )
        )
        
        self.wait(2)