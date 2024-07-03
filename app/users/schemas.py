from pydantic import BaseModel, field_validator
import re


class PhoneForm(BaseModel):
    phone: str | None = None
    phone_full: str | None = None

    @field_validator("phone", mode="before")
    def validate_phone(cls, value):
        if value is None or value.strip() == "":
            raise ValueError("Поле 'Телефон' должно быть заполнено")
        return value

    @field_validator("phone_full", mode="before")
    def validate_phone_full(cls, value, values):
        phone = values.data.get("phone")
        if phone and (value is None or not re.match(r"^\+\d{1,14}$", value)):
            raise ValueError("Неверный формат телефона")
        return value
