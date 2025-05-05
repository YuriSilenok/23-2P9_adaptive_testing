from fastapi import FastAPI, APIRouter
from views import router as auth_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router=auth_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True, port=8001)
