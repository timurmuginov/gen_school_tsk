from redis.asyncio import Redis
from app.config import settings

# Создание глобального клиента Redis
redis_data_client = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    password=settings.REDIS_PASSWORD
)
