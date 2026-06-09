from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from Database import get_db
from . import crud, schema

router = APIRouter(
    prefix="/User",
    tags=["User"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)


@router.post("/login", status_code=status.HTTP_200_OK)
def login_user(credentials: schema.UserLogin, db: Session = Depends(get_db)):
    return crud.login_user(db=db, credentials=credentials)


