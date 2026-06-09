from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from responses import ResponseModel, ErrorResponseModel
from security.hashing import hash_password, verify_password
from security.token import create_access_token

from . import model, schema


def create_user(db: Session, user: schema.UserCreate):
    try:
        email = str(user.email).lower()
        existing_user = (
            db.query(model.User)
            .filter(model.User.email == email, model.User.is_deleted.is_(False))
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=jsonable_encoder(
                    ErrorResponseModel(
                        status_code=400,
                        message="User already exists",
                        error="User already exists",
                    )
                ),
            )

        hashed_password = hash_password(user.password)
        db_user = model.User(
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            email=email,
            password=hashed_password,
            created_by=user.first_name,
            updated_by=user.first_name,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return ResponseModel(
            status_code=201,
            message="User created successfully",
            data=schema.UserPublic.model_validate(db_user),
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=jsonable_encoder(
                ErrorResponseModel(
                    status_code=500,
                    message=str(e),
                    error="Internal server error",
                )
            ),
        )


def get_user_by_email(db: Session, email: str) -> model.User | None:
    return (
        db.query(model.User)
        .filter(
            model.User.email == email.lower(),
            model.User.is_deleted.is_(False),
        )
        .first()
    )


def login_user(db: Session, credentials: schema.UserLogin):
    try:
        db_user = get_user_by_email(db, credentials.email)
        if not db_user:
            raise HTTPException(
                status_code=401,
                detail=jsonable_encoder(
                    ErrorResponseModel(
                        status_code=401,
                        message="Invalid email or password",
                        error="Unauthorized",
                    )
                ),
            )
        if not db_user.is_active:
            raise HTTPException(
                status_code=403,
                detail=jsonable_encoder(
                    ErrorResponseModel(
                        status_code=403,
                        message="Account is inactive",
                        error="Forbidden",
                    )
                ),
            )
        if not verify_password(credentials.password, db_user.password):
            raise HTTPException(
                status_code=401,
                detail=jsonable_encoder(
                    ErrorResponseModel(
                        status_code=401,
                        message="Invalid email or password",
                        error="Unauthorized",
                    )
                ),
            )

        access_token = create_access_token(
            data={
                "sub": db_user.email,
                "user_id": str(db_user.id),
            }
        )

        return ResponseModel(
            status_code=200,
            message="Login successful",
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": schema.UserPublic.model_validate(db_user),
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=jsonable_encoder(
                ErrorResponseModel(
                    status_code=500,
                    message=str(e),
                    error="Internal server error",
                )
            ),
        )
