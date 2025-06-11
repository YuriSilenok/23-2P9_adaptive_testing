"""Main.py for API"""
from fastapi import FastAPI, APIRouter
from views import router as auth_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router=auth_router)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=8001,)
