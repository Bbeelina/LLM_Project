import requests
import logging
import json
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseProvider:
    def __init__(self, config, context=None, metadata=None):
        if isinstance(config, str):
            try:
                config = json.loads(config)
            except json.JSONDecodeError:
                logger.warning("Config is not valid JSON, treating as string")
                config = {"raw_config": config}
        
        self.config = config if isinstance(config, dict) else {}
        self.context = context or {}
        self.metadata = metadata or {}
        self.timeout = 30

    def _make_request(self, url: str, headers: Dict, payload: Dict) -> Dict:
        resp = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()

class MistralProvider(BaseProvider):
    def evaluate(self, prompt: str, **_):
        resp = self._make_request(
            "https://api.mistral.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.config.get('api_key','')}"
            },
            payload={
                "model": self.config.get("model"),
                "messages":[{"role":"user","content":prompt}],
                "temperature": self.config.get("temperature",0.7)
            }
        )
        return {"output": resp["choices"][0]["message"]["content"]}

class ClaudeProvider(BaseProvider):
    def evaluate(self, prompt: str, **_):
        resp = self._make_request(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": self.config.get("api_key",""),
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            payload={
                "model": self.config.get("model"),
                "max_tokens": 1000,
                "temperature": self.config.get("temperature",0.7),
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        if 'content' in resp and len(resp['content']) > 0:
            return {"output": resp['content'][0]['text']}
        return {"output": ""}

class GroqProvider(BaseProvider):
    def evaluate(self, prompt: str, **_):
        resp = self._make_request(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.config.get('api_key','')}"
            },
            payload={
                "model": self.config.get("model"),
                "messages":[{"role":"user","content":prompt}]
            }
        )
        return {"output": resp["choices"][0]["message"]["content"]}


def mistral_handler(config, prompt, context=None, metadata=None):
    provider = MistralProvider(config, {}, {})
    text = provider.evaluate(prompt)
    return {"output": text}

def claude_handler(config, prompt, context=None, metadata=None):
    provider = ClaudeProvider(config, {}, {})
    result = provider.evaluate(prompt)
    return {"output": result["output"]}

def groq_handler(config, prompt, context=None, metadata=None):
    provider = GroqProvider(config, {}, {})
    text = provider.evaluate(prompt)
    return {"output": text}