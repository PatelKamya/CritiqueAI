from Database import engine
from Base import BaseModel
from responses import ResponseModel


def create_all_tables():
    BaseModel.metadata.create_all(bind=engine)
    return ResponseModel(
        message="All database tables created successfully",
        status_code=200,
    )


def delete_all_tables():
    BaseModel.metadata.drop_all(bind=engine)
    return ResponseModel(
        message="All database tables deleted successfully",
        status_code=200,
    )
