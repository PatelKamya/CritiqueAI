# :::::::::::::::::::::::::::::::::::::: Pydantic ::::::::::::::::::::::::::::::::::::::
# ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

from datetime import datetime
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    created_by: Optional[str]
    updated_by: Optional[str]

    is_deleted: Optional[bool]



#:::::::::::::::::::::::::::::::::::::: Database ::::::::::::::::::::::::::::::::::::::
# ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

from sqlalchemy import Column, DateTime, Boolean, String
from sqlalchemy.orm import as_declarative, declared_attr

# Custom Imports
def get_current_time():
    return datetime.now()


def get_uuid():
    return str(uuid4())

@as_declarative()
class BaseModel:
    __name__: str

    id = Column(String, primary_key= True, unique=True, nullable= False, default= get_uuid)

    created_at = Column(DateTime, default= get_current_time)
    updated_at = Column(DateTime,default= get_current_time, onupdate=get_current_time)


    created_by = Column(String, nullable=False, default="system")
    updated_by = Column(String, nullable=False, default="system")
    is_deleted = Column(Boolean, default= False)

    # Generate __tablename__ automatically if inherited
    @declared_attr
    def __tablename__(cls) -> str:
        name = cls.__name__.lower() + "s"
        return name
