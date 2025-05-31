"""descriptions for all user interactions (API)"""
from pydantic import BaseModel
from fastapi import Depends, APIRouter, HTTPException, status, Cookie, Body 
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse

from shemas import (UserCreate, UserOut)
from crud import find_user, create_user, find_password
from utils import verify_password, encode_jwt, decode_jwt


router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

class AuthUser(BaseModel): 
    username: str
    password: str

async def validate_auth_user(
    user: AuthUser = Body()
) -> UserOut:
    data = await find_user(user.username)
    password_hash = await find_password(user.username)

    if not data or not verify_password(user.password, password_hash):
        raise HTTPException(status_code=401)

    return UserOut(**data)


async def get_current_user(
    token_cookie: str|bytes = Cookie(None, include_in_schema=False),
    token_bearer: str = Depends(oauth2_scheme)
) -> str:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = decode_jwt(token=token_cookie if token_cookie else token_bearer)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

    except:
        raise credentials_exception

    return username


async def get_current_active_user(
    username: str = Depends(get_current_user),
) -> UserOut:
    
    user = await find_user(username)

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
    print(user)
    user_data = await create_user(user)
    return user_data
