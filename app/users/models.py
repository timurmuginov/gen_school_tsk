from sqlalchemy import Boolean, String
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.sql import expression

from app.database import Base


class Roles(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)

    users = relationship("Users", back_populates="role")

    def __str__(self):
        return f"Роль {self.name}"


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(String(14), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(nullable=True, unique=True)
    name: Mapped[str] = mapped_column(nullable=True)
    hashed_password: Mapped[str] = mapped_column(nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=expression.true()
    )
    is_completed_registration: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=expression.false()
    )

    role = relationship("Roles", back_populates="users")

    def __str__(self):
        return f"Пользователь {self.phone}"
