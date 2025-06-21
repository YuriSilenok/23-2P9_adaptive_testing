"""database discription"""
from datetime import datetime
from peewee import SqliteDatabase, CharField, DateTimeField, BooleanField, Model, ForeignKeyField

from shemas import Roles
from utils import get_password_hash

database = SqliteDatabase('my_database.db')


class Table(Model):
    class Meta:
        database = database


class User(Table):
    username = CharField(unique=True)
    name = CharField()
    telegram_link = CharField()
    password_hash = CharField()
    created_at = DateTimeField(default=datetime.now)
    is_active = BooleanField(default=True)


class Role(Table):
    status=CharField()


class UserRole(Table):
    user = ForeignKeyField(
        User, backref="user_role", on_update="CASCADE", on_delete="CASCADE"
    )
    role = ForeignKeyField(
        Role, backref="user_role", on_update="CASCADE", on_delete="CASCADE"
    )


class UserCourse(Table):
    title = CharField(max_length=30)
    created_by = ForeignKeyField(User, field=User.username)
    is_active = BooleanField(default=True)


class UserTheme(Table):
    by_course = ForeignKeyField(UserCourse)
    created_by = ForeignKeyField(User, field=User.username)
    title = CharField(max_length=60)
    description = CharField(max_length=120)
    is_active = BooleanField(default=True)


# class Poll(Table):
#     title = CharField(unique=True)
#     description = TextField(null=True)
#     created_by = ForeignKeyField(User, field=User.username, backref='polls')
#     created_at = DateTimeField(default=datetime.now)
#     is_active = BooleanField(default=True)

# class Question(Table):
#     number = IntegerField()
#     poll = ForeignKeyField(Poll, backref='questions')
#     text = TextField() 
#     question_type = CharField(default='single_choice')


# class AnswerOption(Table):
#     number = IntegerField()
#     question = ForeignKeyField(Question, backref='answer_options')
#     text = TextField()
#     is_correct = BooleanField(default=False)


# class UserAnswer(Table):
#     user = ForeignKeyField(User, field=User.username, backref='answers')
#     question = ForeignKeyField(Question, backref='user_answers')
#     answer_option = ForeignKeyField(AnswerOption, backref='selected_by')
#     answered_at = DateTimeField(default=datetime.now)


if __name__ == "__main__":
    database.connect()
    database.create_tables([User, Role, UserRole, UserCourse, UserTheme])
    database.close()

    Role.get_or_create(status=Roles.STUDENT)
    teacher_role, _ = Role.get_or_create(status=Roles.TEACHER)

    base_teacher, _ = User.get_or_create(
        username = 'teacher',
        defaults={
            'name': 'teacher',
            'telegram_link': 'https://t.me/teacher_tg.com',
            'password_hash': get_password_hash('12345')
        })
    UserRole.get_or_create(
        user = base_teacher,
        role = teacher_role
    )
