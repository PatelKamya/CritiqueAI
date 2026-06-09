from typing import List, Optional

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator


class ReviewRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    language: str = "text"
    context: str = ""
    focus: str = Field(
        default="general",
        validation_alias=AliasChoices("focus", "focusOn", "focus_on", "Focus On"),
    )
    code: str = ""

    @field_validator("language", "context", "focus", "code", mode="before")
    @classmethod
    def normalize_text_fields(cls, value):
        if value is None:
            return ""
        return str(value)


class Issue(BaseModel):
    id: str
    severity: str
    category: str
    title: str
    description: str
    line_hint: Optional[str] = None
    suggestion: str


class ReviewResponse(BaseModel):
    summary: str
    score: int
    issues: List[Issue]
    positives: List[str]
