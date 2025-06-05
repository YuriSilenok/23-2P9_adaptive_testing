"""API templates"""
from enum import Enum
from pydantic import BaseModel, HttpUrl, Field, field_validator


class Roles(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"


class UserBase(BaseModel):
    username: str = Field("your_username", min_length=3, max_length=50)
    name: str = Field("your_name", min_length=2, max_length=100)
    telegram_link: str = "https:t.me//example.com/"
    role: Roles = Roles.STUDENT

    @field_validator('telegram_link')
    def validate_telegram_link(cls, v):
        if "t.me/" not in str(v):
            raise ValueError("Telegram link must contain 't.me/'")
        return v


class UserCreate(UserBase):
    password: str = "your_password"


class UserOut(UserBase):
    pass


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
