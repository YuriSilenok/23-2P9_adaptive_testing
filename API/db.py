"""database discription"""
from datetime import datetime
from peewee import SqliteDatabase, CharField, DateTimeField, BooleanField, Model

database = SqliteDatabase('my_database.db')


class BaseModel(Model):
    class Meta:
        database = database


class User(BaseModel):
    username = CharField(unique=True)
    name = CharField()
    telegram_link = CharField()
    password_hash = CharField()
    role = CharField()
    created_at = DateTimeField(default=datetime.now)
    is_active = BooleanField(default=True)

    def is_teacher(self):
        return self.role == 'teacher'


if __name__ == "__main__":
    database.connect()
    database.drop_tables([User])
    database.create_tables([User])
    database.close()
