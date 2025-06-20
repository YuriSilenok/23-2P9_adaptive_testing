"""python interaction with database"""
from fastapi import HTTPException, status

from db import database, User, UserRole, Role
from utils import get_password_hash
from shemas import UserCreate, Roles, UserOut


@database.atomic()
def create_user(user: UserCreate):
    try:
        currect_user = User.create(
            username=user.username,
            name=user.name,
            telegram_link=user.telegram_link,
            password_hash=get_password_hash(user.password)
        )

        UserRole.create(
            user = currect_user,
            role = Role.get_or_none(Role.name == user.role)
        )

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already registered"
        )

    return "Username registered"


@database.atomic()
def find_user(username) :
    current_user = User.get_or_none(User.username == username)
    user_role = (UserRole.get_or_none(user = current_user)).role.name
    if current_user:
        return UserOut(
            username=current_user.username,
            name=current_user.name,
            telegram_link=current_user.telegram_link,
            role=user_role
        )

    raise HTTPException(
        detail='user not finded',
        status_code=status.HTTP_404_NOT_FOUND
    )


@database.atomic()
def find_password(username):
    current_user = User.get_or_none(User.username == username)

    if current_user:
        return current_user.password_hash
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="user not finded"
    )
