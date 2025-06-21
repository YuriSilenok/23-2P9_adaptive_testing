"""descriptions for all user interactions (API)"""
from pydantic import BaseModel
from fastapi import Depends, APIRouter, HTTPException, status, Cookie, Body, Query 
from fastapi.security import OAuth2PasswordBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from typing import Union

from shemas import (UserCreate, UserOut, Course, Roles)
from crud import find_user, create_user, find_password, compare_role, course_create, change_activity_of_course, get_courses_list
from utils import verify_password, encode_jwt, decode_jwt
from db import User, UserRole, Role, UserCourse


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

    return current_user



async def get_current_user(
    access_token: Union[str, bytes, None] = Cookie(None, include_in_schema=False),
    bearer_token: Union[str, None]= Depends(oauth2_scheme),
) -> Union[str, None]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not validate credentials",
    )
    if not access_token and not bearer_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
            )

    try:
        token = access_token or bearer_token
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        payload = decode_jwt(token=token)
        username: str = payload.get("sub")

        if username is None:
            raise credentials_exception

    except:
        raise credentials_exception

    return username


async def get_current_active_user(
    username: str = Depends(get_current_user)
) -> UserOut:

    user = find_user(username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='could not find user'
        )

    return user


@router.post("/login")
async def login_for_access_token(
    user: UserOut = Depends(validate_auth_user)
) -> JSONResponse:
    jwt_payload = {
        "sub": user.username,
        "username": user.username
    }
    
    token = encode_jwt(jwt_payload)
    response = JSONResponse(
        content={
            'username': user.name, 
            'role': user.role, 
            "token": token
        }
    )

    response.set_cookie(
        key='access_token',
        value=str(token),
        path="/",
        httponly=True,
        max_age=3600*24*30
    )

    return response


@router.get('/users/me')
async def users_me(
    user = Depends(get_current_active_user)
) -> JSONResponse: 
    return JSONResponse(
        content={
            'nick': user.name, 
            'status': user.role, 
        }
    )

@router.post('/logout')
async def logout():
    response = JSONResponse(
        'logout: true'
    )
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
    )
    
    return response


@router.post("/register")
async def register(user: UserCreate) -> str:
    user_data = create_user(user)
    return user_data

# @router.post("/create_poll")
# async def create_full_poll(
#     poll_data: PollCreate,
#     current_user: UserOut = Depends(get_current_active_user)
# ) -> JSONResponse:
#     if compare_role(current_user.username, Roles.STUDENT):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Only teachers can create polls"
#         )

#     db_poll = await create_poll(poll_data, current_user)

#     return db_poll


# @router.get('/ping_poll/{poll_id}')
# async def ping_poll(
#     poll_id: int,
#     current_user: UserOut = Depends(get_current_active_user)
# ) -> JSONResponse:
#     if compare_role(current_user.username, Roles.TEACHER):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Only studens can see questions"
#         )

#     return find_poll(poll_id)


# @router.get("/get_poll/{poll_id}", response_model=PollWithQuestions)
# async def get_poll_questions(
#     poll_id: int,
#     current_user: UserOut = Depends(get_current_active_user)
# ) -> JSONResponse:
#     if compare_role(current_user.username, Roles.TEACHER):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Only studens can see questions"
#         )

#     return await find_questions(poll_id)


# @router.post("/polls/{poll_id}/submit-answers/")
# async def submit_answers(
#     poll_id: int,
#     answers_data: PollAnswersSubmit,
#     current_user: UserOut = Depends(get_current_active_user)
# ) -> JSONResponse:
#     if compare_role(current_user.username, Roles.TEACHER):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Only students can submit answers"
#         )

#     return submit_poll_answers(poll_id, answers_data, current_user)


# @router.get("/polls/check")
# async def check_statistic(
#     current_user: UserOut = Depends(get_current_active_user)
# ) -> JSONResponse:
#     if compare_role(current_user.username, Roles.STUDENT):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN, 
#             detail='Only teachers can see stats'
#         )

#     return check_user_answers_from_db(current_user.username)


@router.post('/course/create')
async def create_course(
    course: Course = Body(),
    current_user: UserOut = Depends(get_current_active_user)
) -> JSONResponse:
    if compare_role(current_user.username, Roles.STUDENT):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can create polls"
        )

    return course_create(course=course, user=current_user)


@router.put('/course/course')
async def change_activity_course(
    title = Query(),
    current_user: UserOut = Depends(get_current_active_user)
) -> JSONResponse:
    if compare_role(current_user.username, Roles.STUDENT):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can create polls"
        )

    return change_activity_of_course(title=title, user=current_user)


@router.get('/course/get')
async def get_courses(
    current_user = Depends(get_current_active_user)
) -> JSONResponse:
    if compare_role(current_user.username, Roles.STUDENT):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can create polls"
        )
    
    return get_courses_list(current_user)
