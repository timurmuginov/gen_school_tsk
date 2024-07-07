from contextlib import asynccontextmanager
import time
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from app.users.auth.routes_templates import router as router_users

from app.logger import logger

from app.redis_config import redis_data_client


load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Инициализация подключения к Redis
    try:
        response = await redis_data_client.ping()
        print("Redis PING response:", response)
    except Exception as e:
        print("Error connecting to Redis:", e)

    yield
    # Закрытие подключения к Redis при остановке приложения
    await redis_data_client.close()

app = FastAPI(
    title="Генерация школьных задач",
    version="1",
    root_path="",
    lifespan=lifespan
)

# Подключение статических файлов
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    # При подключении Prometheus + Grafana подобный лог не требуется
    logger.info("Request handling time", extra={
        "process_time": round(process_time, 4)
    })
    return response


# Роутеры
app.include_router(router_users)


@app.get("/")
async def root():
    return {"message": "Hello World"}
