import sys
import os
import json
import requests

def main():
    try:
        # Read payload from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input provided on stdin"}), file=sys.stderr)
            sys.exit(1)
            
        params = json.loads(input_data)
        
        # Get configuration
        api_key = os.environ.get("NVIDIA_API_KEY")
        if not api_key:
            print(json.dumps({"error": "NVIDIA_API_KEY environment variable is not set"}), file=sys.stderr)
            sys.exit(1)
            
        invoke_url = params.get("url", "https://integrate.api.nvidia.com/v1/chat/completions")
        stream = params.get("stream", False)
        messages = params.get("messages", [])
        model = params.get("model", "nvidia/nemotron-3-ultra-550b-a55b")
        temperature = params.get("temperature", 1.0)
        top_p = params.get("top_p", 0.95)
        max_tokens = params.get("max_tokens", 16384)
        chat_template_kwargs = params.get("chat_template_kwargs", {"enable_thinking": True})
        reasoning_budget = params.get("reasoning_budget", 16384)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "text/event-stream" if stream else "application/json",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messages": messages,
            "model": model,
            "chat_template_kwargs": chat_template_kwargs,
            "reasoning_budget": reasoning_budget,
            "max_tokens": max_tokens,
            "stream": stream,
            "temperature": temperature,
            "top_p": top_p
        }
        
        # We set a generous timeout because thinking models can take time to think
        response = requests.post(invoke_url, headers=headers, json=payload, stream=stream, timeout=180)
        
        if response.status_code != 200:
            try:
                err_data = response.json()
            except Exception:
                err_data = response.text
            print(json.dumps({"error": f"API returned status {response.status_code}", "details": err_data}), file=sys.stderr)
            sys.exit(1)
            
        if stream:
            for line in response.iter_lines():
                if line:
                    print(line.decode("utf-8"))
        else:
            # Output the JSON response directly
            print(json.dumps(response.json()))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
