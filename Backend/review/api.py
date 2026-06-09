from fastapi import APIRouter, HTTPException

from review.schema import ReviewRequest, ReviewResponse
from review.service import review_with_ai
from review.utils import SYSTEM_PROMPT

router = APIRouter(
    prefix="/review",
    tags=["Review"],
)


@router.post("/", response_model=ReviewResponse)
async def review_code(request: ReviewRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Please paste code before requesting a review.")

    system_prompt = SYSTEM_PROMPT.replace("{{language}}", request.language)
    system_prompt = system_prompt.replace("{{context}}", request.context)
    system_prompt = system_prompt.replace("{{focus}}", request.focus)
    system_prompt = system_prompt.replace("{{code}}", request.code)

    try:
        review_data = await review_with_ai(system_prompt, request.code, request.language)
        return ReviewResponse(**review_data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
