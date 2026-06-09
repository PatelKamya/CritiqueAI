from fastapi import APIRouter, status

from . import crud

router = APIRouter(
    prefix="/super-admin",
    tags=["Super Admin"],
)


@router.post("/tables/create", status_code=status.HTTP_200_OK)
def create_database_tables():
    return crud.create_all_tables()


@router.delete("/tables/delete", status_code=status.HTTP_200_OK)
def delete_database_tables():
    return crud.delete_all_tables()
