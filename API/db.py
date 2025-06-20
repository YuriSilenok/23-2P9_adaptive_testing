"""database discription"""
from datetime import datetime
from peewee import SqliteDatabase, CharField, DateTimeField, BooleanField, Model, ForeignKeyField

from shemas import Roles
from utils import get_password_hash

database = SqliteDatabase('my_database.db')


class BaseModel(Model):
    class Meta:
        database = database


class User(BaseModel):
    username = CharField(unique=True)
    name = CharField()
    telegram_link = CharField()
    password_hash = CharField()
    created_at = DateTimeField(default=datetime.now)
    is_active = BooleanField(default=True)


class Role(BaseModel):
    name=CharField()


class UserRole(BaseModel):
    user = ForeignKeyField(
        User, backref="user_role", on_update="CASCADE", on_delete="CASCADE"
    )
    role = ForeignKeyField(
        Role, backref="user_role", on_update="CASCADE", on_delete="CASCADE"
    )


if __name__ == "__main__":
    database.connect()
    database.create_tables([User, Role, UserRole])
    database.close()

    Role.get_or_create(name=Roles.STUDENT)
    teacher_role, _ = Role.get_or_create(name=Roles.TEACHER)

    base_teacher, _ = User.get_or_create(
        username = 'teacher',
        name = 'teacher',
        telegram_link = "https:t.me//base_teacher.com/",
        password_hash = get_password_hash('12345')
    )
    UserRole.get_or_create(
        user = base_teacher,
        role = teacher_role
    )
