from typing import Optional

from pydantic import BaseModel, EmailStr

from Base import BaseSchema

class SuperAdminBase(BaseModel):
    name: str
    email: EmailStr
    is_active: Optional[bool] = True


class SuperAdminCreate(SuperAdminBase):
    password: str


class SuperAdminUpdate(BaseModel):
    name: str
    email: EmailStr


class SuperAdminPublic(BaseSchema):
    id: str
    name: str
    email: EmailStr
    is_active: bool
