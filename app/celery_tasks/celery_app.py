from celery import Celery
from app.config import settings


celery_app = Celery(
  "celery_tasks",
  broker=(
      f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:"
      f"{settings.REDIS_PORT}"
  ),
  backend=(
      f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:"
      f"{settings.REDIS_PORT}"
  ),
  include=[
      "app.celery_tasks.celery_tasks",
      # "app.celery_tasks.scheduled"
  ],
)

celery_app.conf.result_expires = 420

celery_app.conf.timezone = 'UTC'

# Настройка задачи очистки старых результатов
celery_app.conf.beat_schedule = {
    'backend_cleanup': {
        'task': 'celery.backend_cleanup',
        'schedule': 10.0,  # Интервал в секундах для очистки результатов
    },
}

# Печать конфигурации для проверки
print("Celery Configuration:", celery_app.conf.humanize(with_defaults=False))
