import requests
import logging
import json
from typing import Dict, Any
from mistralai import Mistral
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseProvider:
    def __init__(self, config, context=None, metadata=None):
        if isinstance(config, str):
            self.config = json.loads(config)
        else:
            self.config = config.copy() if config else {}  
        self.context = context.copy() if context else {}
        self.metadata = metadata.copy() if metadata else {}
        self.timeout = 30

    def _make_request(self, url: str, headers: Dict, payload: Dict) -> Dict:
        resp = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()

class MistralProvider(BaseProvider):
    def __init__(self, config, context=None, metadata=None):
        super().__init__(config, context, metadata)
        api_key = self.config.get("api_key") or os.environ.get("mistral_api_key")
        self.client = Mistral(api_key=api_key)

    def evaluate(self, prompt: Any) -> str:
        if isinstance(prompt, dict):
            if "prompt" in prompt and isinstance(prompt["prompt"], str):
                actual_prompt = prompt["prompt"]
                logger.info(f"Using prompt['prompt']: {actual_prompt!r}")
            elif "input" in prompt and isinstance(prompt["input"], str):
                actual_prompt = prompt["input"]
                logger.info(f"Using prompt['input']: {actual_prompt!r}")
            else:
                values = [v for v in prompt.values() if isinstance(v, str) and v.strip()]
                if values:
                    actual_prompt = values[0]
                    logger.info(f"Using first non-empty string from prompt dict: {actual_prompt!r}")
        elif isinstance(prompt, str):
            actual_prompt = prompt
            logger.info(f"Using prompt as string: {actual_prompt!r}")

        messages = [{"role": "user", "content": actual_prompt}]
        logger.info(f"Sending messages to Mistral: {messages}")

        response = self.client.chat.complete(
            model=self.config.get("model", "mistral-medium-latest"),
            messages=messages
        )
        logger.info(f"Response content: {response.choices[0].message.content!r}")
        return response.choices[0].message.content

def mistral_handler(config, prompt, context=None, metadata=None):
    provider = MistralProvider(config, context, metadata)
    output = provider.evaluate(prompt)
    return {"output": output}
