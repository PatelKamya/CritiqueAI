from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from Base import BaseModel
from Database import engine
from Users import model as user_model  # noqa: F401 - registers User table metadata
from Users.api import router as user_router
from super_admin import model as super_admin_model  # noqa: F401 - registers SuperAdmin table metadata
from super_admin.api import router as super_admin_router
from review.api import router as review_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    BaseModel.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(super_admin_router)
app.include_router(review_router)
