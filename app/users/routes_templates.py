from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


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


# Регистрация Шаг 1
@router.post("/register", response_class=HTMLResponse)
async def submit_phone(
    request: Request,
    phone: str = Form(),
    phone_full: str = Form()
):
    print("Phone = ", phone)
    print("Phone Full = ", phone_full)

    # далее отправка смс итд

    return templates.TemplateResponse(
        "registration_step_1.html", {
            "request": request,
            "hide_header": True,
            "hide_footer": True,
        }
    )
