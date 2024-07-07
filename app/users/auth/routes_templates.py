from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import ValidationError

from app.users.schemas import PhoneForm

from app.celery_tasks.celery_tasks import send_sms_code_for_verification


router = APIRouter(
  prefix="",
  tags=["Фронтенд"]
)

templates = Jinja2Templates(directory="app/templates")


# Отображение странцы регистрации
@router.get("/register", response_class=HTMLResponse)
async def read_registration_phone(request: Request):
    return templates.TemplateResponse(
        "registration_step_1.html", {
            "request": request,
            "hide_header": True,
            "hide_footer": True,
        }
    )


# Регистрация Шаг 1: Ввод номера телефона
@router.post("/register", response_class=HTMLResponse)
async def submit_phone(
    request: Request,
    phone: str = Form(None),
    phone_full: str = Form(None)
):
    errors = []

    # Валидация формы
    try:
        form_data = PhoneForm(phone=phone, phone_full=phone_full)
        # для отладки
        print(form_data)
    except ValidationError as e:
        for error in e.errors():
            msg = error["msg"].replace("Value error, ", "", 1)
            errors.append({"msg": msg})
        return templates.TemplateResponse(
            "registration_step_1.html",
            {
                "request": request,
                "errors": errors,
                "hide_header": True,
                "hide_footer": True,
                "phone": phone,
                "phone_full": phone_full
            }
        )
        # end: Валидация формы

    # Отправляем смс и перенаправляем на страницу верификации
    print("OK1")
    send_sms_code_for_verification.delay("777", "333")
    print("OK2")

    return templates.TemplateResponse(
        "registration_step_1.html", {
            "request": request,
            "hide_header": True,
            "hide_footer": True,
        }
    )
