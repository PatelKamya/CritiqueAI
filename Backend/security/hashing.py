from passlib.context import CryptContext
from passlib.exc import UnknownHashError


_pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],
    default="pbkdf2_sha256",
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return _pwd_context.verify(plain_password, hashed_password)
    except (ValueError, UnknownHashError):
        return False


class Hash:
    @staticmethod
    def bcrypt(password: str) -> str:
        return hash_password(password)

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        return verify_password(plain_password, hashed_password)

