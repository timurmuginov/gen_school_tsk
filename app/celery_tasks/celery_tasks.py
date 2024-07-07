from app.celery_tasks.celery_app import celery_app


@celery_app.task
def send_sms_code_for_verification(phone: str, sms_code: str):
    print(phone, sms_code)
    return "OK"
