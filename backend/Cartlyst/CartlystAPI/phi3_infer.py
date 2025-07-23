import sys
from ctransformers import AutoModelForCausalLM

MODEL_PATH = "./models/phi-3-mini-4k-instruct.Q4_K_M.gguf"
llm = AutoModelForCausalLM.from_pretrained(MODEL_PATH, model_type="phi3", gpu_layers=0)

if __name__ == "__main__":
    prompt = sys.stdin.read()
    response = llm(prompt, max_new_tokens=128, temperature=0.7)
    print(response) 