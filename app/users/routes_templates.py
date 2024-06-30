from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


router = APIRouter(
  prefix="",
  tags=["Фронтенд"]
)

templates = Jinja2Templates(directory="app/templates")


@router.get("/register", response_class=HTMLResponse)
async def read_registration_phone(request: Request):
    return templates.TemplateResponse(
        "registration_step_1.html", {
            "request": request,
            "hide_header": True,
            "hide_footer": True,
        }
    )
