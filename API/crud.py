"""python interaction with database"""
from fastapi import HTTPException

from db import database, User
from utils import get_password_hash
from shemas import UserCreate


@database.atomic()
async def create_user(user: UserCreate):
    try:
        currect_user = User.create(
            username=user.username,
            name=user.name,
            telegram_link=user.telegram_link,
            password_hash=get_password_hash(user.password),
            role=user.role)

    except:
        raise HTTPException(status_code=400, detail="Username already registered")

    return "Username registered"


@database.atomic()
async def find_user(username) :
    user = User.select().where(User.username == username)

    for i in user:
        return {
            "id": i.id,
            "username": i.username,
            "name": i.name,
            "telegram_link": i.telegram_link,
            "is_active": i.is_active,
            "role": i.role
        }

    raise HTTPException(
        detail='user not finded',
        status_code=404
    )


@database.atomic()
async def find_password(username):
    user = User.select().where(User.username == username)

    for i in user:
        return i.password_hash
