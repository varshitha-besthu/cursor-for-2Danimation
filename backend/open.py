from openai import OpenAI # type: ignore

client = OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-r1:free",
    messages=[{"role":"user","content":"You are a Manim expert. Return only valid Manim Community Edition Python code. Do not include any explanations or comments. I want just the code block, nothing else.now create a manim code for  the topic is neural networks. make the code as possible as less and the content should be quality"}]
)
print(response.choices[0].message.content)
