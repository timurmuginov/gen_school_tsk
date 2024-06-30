from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from app.users.routes_templates import router as router_users
load_dotenv()

app = FastAPI(
    title="Генерация школьных задач",
    version="1",
    root_path=""
)

# Подключение статических файлов
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(router_users)


@app.get("/")
async def root():
    return {"message": "Hello World"}
