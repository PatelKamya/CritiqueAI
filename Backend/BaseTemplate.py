from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BaseTemplate(BaseModel):
    
    id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    created_by: Optional[str]
    updated_by: Optional[str]
    is_deleted: Optional[bool]