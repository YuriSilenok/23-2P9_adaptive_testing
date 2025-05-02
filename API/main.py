from fastapi import FastAPI,APIRouter
from views import router as auth_router


app = FastAPI()

app.include_router(router=auth_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True, port=8001)

