"""descriptions for all user interactions (API)"""
from pydantic import BaseModel
from fastapi import Depends, APIRouter, HTTPException, status, Cookie, Body 
from fastapi.security import OAuth2PasswordBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse

from shemas import (UserCreate, UserOut)
from crud import find_user, create_user, find_password
from utils import verify_password, encode_jwt, decode_jwt
from db import User, UserRole, Role


router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login", 
    auto_error=False
)

class AuthUser(BaseModel): 
    username: str
    password: str

async def validate_auth_user(
    user: AuthUser = Body()
) -> UserOut:
    current_user = find_user(user.username)
    password_hash = find_password(user.username)

    if not current_user or not verify_password(user.password, password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return UserOut(**current_user)


async def get_current_user(
    access_token: str|bytes = Cookie(None, include_in_schema=False),
    bearer_token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
) -> str:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = decode_jwt(token=access_token if access_token else bearer_token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

    except:
        raise credentials_exception

    return username


async def get_current_active_user(
    username: str = Depends(get_current_user),
) -> UserOut:
    
    user = find_user(username)

    if not user:
        raise HTTPException(
            status_code=403,
            detail='cannot find user'
        )

    if user["is_active"]:
        return UserOut(**user)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="user inactive"
    )


@router.post("/login")
async def login_for_access_token(
    user: UserCreate = Depends(validate_auth_user)
) -> JSONResponse:
    jwt_payload = {
        "sub": user.username,
        "username": user.username
    }
    token = encode_jwt(jwt_payload)
    response = JSONResponse(content={'username': user.name, 'role': user.role})
    response.set_cookie(
        key='access_token',
        value=token,
        path="/",
        httponly=True,
        max_age=3600*24*30
    )

    return  response


@router.post("/register")
async def register(user: UserCreate) -> str:
    user_data = create_user(user)
    return user_data
