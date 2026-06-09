import json
import logging

import httpx

from Config import settings

logger = logging.getLogger("ai_service")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def review_with_ai(system_prompt: str, user_code: str, language: str) -> dict:
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "openai/gpt-4o",
        "max_tokens": 2000,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Please review this {language} code:\n\n{user_code}"},
        ],
    }

    logger.info("AI job started — model=openai/gpt-4o language=%s", language)

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENROUTER_URL, json=payload, headers=headers)

    if response.status_code != 200:
        detail = "AI review service failed. Please try again later."
        try:
            error_body = response.json()
            if "error" in error_body and "message" in error_body["error"]:
                detail = error_body["error"]["message"]
        except Exception:
            pass
        logger.error("AI job failed — status=%s error=%s", response.status_code, detail)
        raise Exception(detail)

    result = response.json()
    content = result["choices"][0]["message"]["content"]

    try:
        review_data = json.loads(content)
        logger.info("AI job completed successfully — language=%s issues=%d score=%s",
                     language, len(review_data.get("issues", [])), review_data.get("score", "N/A"))
        return review_data
    except (json.JSONDecodeError, KeyError) as e:
        logger.error("AI job parse error — %s", e)
        raise Exception("Invalid response from AI service.")
