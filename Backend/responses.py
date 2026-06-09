from __future__ import annotations

import logging
from datetime import date, datetime, time
from typing import Any
from uuid import UUID

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)



GENERIC_MESSAGES ={
    400: "Please check your input and try again.",
    401: "You are not authorized to perform this action.",
    403: "You are not authorized to perform this action.",
    404: "The requested resource was not found.",
    408: "Request timed out. Please check your connection.",
    422: "Please check your input and try again.",
    500: "Something went wrong on our end. Please try again later.",
    502: "Something went wrong on our end. Please try again later.",
    503: "Something went wrong on our end. Please try again later.",
    504: "Request timed out. Please check your connection.",   
}


def _clean_obj_dict(d: dict) -> dict:
    return {k: v for k, v in d.items() if not str(k).startswith("_")}


def _to_primitive(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    if hasattr(value, "model_dump"):
        return value.model_dump()
    if hasattr(value, "dict") and callable(getattr(value, "dict")):
        return value.dict()
    if hasattr(value, "__dict__"):
        return _clean_obj_dict(value.__dict__)
    return value


def _sanitize_message(message: str | None, status_code: int) -> str:
    default_message = GENERIC_MESSAGES.get(status_code) or (
        GENERIC_MESSAGES[500] if status_code >= 500 else "Please try again."
    )
    normalized_message = str(message or "").strip()

    if status_code >= 500:
        return default_message
    if status_code in {401, 403, 404, 408, 422, 504}:
        return default_message
    if not normalized_message:
        return default_message
    return normalized_message


class ApiResponse(BaseModel):
    success: bool
    data: Any = None
    message: str
    status_code: int = Field(default=200, exclude=True)

    def get(self, key: str, default: Any = None) -> Any:
        if key == "code":
            return self.status_code
        return getattr(self, key, default)


def ResponseModel(data: Any = None, message: str | None = None, status_code: int = 200) -> ApiResponse:
    if isinstance(data, list):
        data = [_to_primitive(item) for item in data]
    else:
        data = _to_primitive(data)

    return ApiResponse(
        success=True,
        data=data,
        message=str(message or "Success"),
        status_code=status_code,
    )


def ErrorResponseModel(
    error: str | None = None,
    message: str | None = None,
    status_code: int = 404,
) -> ApiResponse:
    if status_code >= 500:
        logger.error("API error response generated: %s | %s", error or "error", message or "")

    return ApiResponse(
        success=False,
        data=None,
        message=_sanitize_message(message, status_code),
        status_code=status_code,
    )


def response_status(payload: Any, fallback_status: int = 200) -> int:
    if hasattr(payload, "status_code"):
        return int(getattr(payload, "status_code", fallback_status) or fallback_status)
    if isinstance(payload, dict):
        return int(payload.get("code") or payload.get("status_code") or fallback_status)
    return fallback_status


def json_response(payload: Any, fallback_status: int = 200) -> JSONResponse:
    return JSONResponse(
        status_code=response_status(payload, fallback_status),
        content=jsonable_encoder(payload),
    )
