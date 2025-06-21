"""python interaction with database"""
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

from db import database, User, UserRole, Role, UserCourse
from utils import get_password_hash
from shemas import UserCreate, Roles, UserOut, Course


@database.atomic()
def create_user(user: UserCreate):
    try:
        currect_user = User.create(
            username=user.username,
            name=user.name,
            telegram_link=user.telegram_link,
            password_hash=get_password_hash(user.password)
        )

        UserRole.create(
            user = currect_user,
            role = Role.get_or_none(Role.status == user.role)
        )

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already registered"
        )

    return "Username registered"


@database.atomic()
def compare_role(username, role: Roles):
    user_role: UserRole = UserRole.get_or_none(UserRole.user == User.get_or_none(User.username == username))

    if not user_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='user not found'
        )
    print(user_role.role.status, role)
    if user_role.role.status == role:
        return True
    
    return False


@database.atomic()
def find_user(username) :
    current_user = User.get_or_none(User.username == username)
    if not current_user:
        raise HTTPException(
            detail='user not finded',
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    user_role = (UserRole.get_or_none(UserRole.user == current_user)).role.status
    return UserOut(
        username=current_user.username,
        name=current_user.name,
        telegram_link=current_user.telegram_link,
        role=user_role
    )


@database.atomic()
def find_password(username):
    current_user = User.get_or_none(User.username == username)

    if current_user:
        return current_user.password_hash
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="user not finded"
    )

# @database.atomic()
# def create_poll(poll: PollCreate, user: UserOut):
#     try:
#         db_poll = Poll.create(
#             title=poll.title,
#             description=poll.description,
#             created_by=user.username
#         )
#         for index, question in enumerate(poll.questions):
#             db_question = Question.create(
#                 poll=db_poll,
#                 text=question.text,
#                 question_type=question.question_type,
#                 number = index
#             )
#             for index, option in enumerate(question.answer_options):
#                 AnswerOption.create(
#                     text=option.text,
#                     is_correct=option.is_correct,
#                     question=db_question,
#                     number = index
#                 )

#     except:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, 
#             detail="poll already registered"
#         )

#     return db_poll.__data__


# @database.atomic()
# def find_poll(poll_id: int):
#     if not Poll.get_or_none(Poll.id == poll_id):
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Poll not found or inactive"
#         )

#     else:
#         return JSONResponse(
#             content='Poll finded'
#         )


# @database.atomic()
# def find_questions(poll_id):
#     poll = Poll.get_or_none(Poll.id == poll_id)

#     if not poll:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Poll not found or inactive"
#         )

#     questions = (
#         Question
#             .select()
#             .where(Question.poll == poll_id)
#             .prefetch(AnswerOption)
#     )

#     response = {
#         'id': poll.id,
#         "title": poll.title,
#         "description": poll.description,
#         "questions": [],
#     }
    
#     for question in questions:
#         q_data = {
#             'id': question.id,
#             "text": question.text,
#             "question_type": question.question_type,
#             "answer_options": [
#                 {
#                     'id': option.id,
#                     "text": option.text
#                 }
#                 for option in question.answer_options
#             ]
#         }
#         response["questions"].append(q_data)

#     return JSONResponse(
#         content=response
#     )


# @database.atomic()
# def submit_poll_answers(
#     poll_id: int,
#     answers_data: PollAnswersSubmit,
#     current_user: UserOut
# ) -> JSONResponse:
#     poll = Poll.get_or_none(Poll.id == poll_id)

#     if not poll:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Опрос не найден или не активен"
#         )

#     existing_answers = UserAnswer.select().where(
#         (UserAnswer.user == current_user.username) &
#         (UserAnswer.question << Question.select().where(Question.poll == poll_id))
#     ).exists()

#     if existing_answers:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,    
#             detail="Вы уже проходили этот опрос"
#         )

#     question_count = Question.select().where(Question.poll == poll_id).count()

#     seen_questions = set()
#     for answer in answers_data.answers:
#         if answer.question_id in seen_questions:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=f"Обнаружены повторяющиеся вопросы (ID: {answer.question_id})"
#             )
#         seen_questions.add(answer.question_id)

#     saved_answers = []

#     for answer in answers_data.answers:
#         question = Question.get_or_none(
#             (Question.id == answer.question_id) &
#             (Question.poll == poll_id)
#         )

#         if not question:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Вопрос не найден"
#             )

#         option_ids = (
#             [answer.selected_option_ids]
#             if isinstance(answer.selected_option_ids, int)
#             else answer.selected_option_ids
#         )

#         if question.question_type == "single_choice" and len(option_ids) > 1:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=f"Вопрос {question.id} допускает только один вариант ответа"
#             )

#         for option_id in option_ids:
#             option = AnswerOption.get_or_none(
#                 (AnswerOption.id == option_id) &
#                 (AnswerOption.question == question)
#             )

#             if not option:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail=f"Вариант ответа не найден{option_id}"
#                 )

#             saved_answers.append(option)

#     if len(saved_answers) != question_count:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Вы ответили не на все вопросы"
#         )

#     serializable_answers = []

#     for option in saved_answers:
#         UserAnswer.create(
#             user=current_user.username,
#             question=question,
#             answer_option=option
#         )

#         serializable_answers.append({
#             'id': option.id,
#             'text': option.text,
#             'question_id': option.question.id,
#         })

#     return JSONResponse(
#         content={
#             'answers': serializable_answers
#         }
#     )


# @database.atomic()
# def check_user_answers_from_db(
#     username: str
# ) -> JSONResponse:
#     try:
#         teacher_polls = (Poll
#                         .select()
#                         .where((Poll.created_by == username) & (Poll.is_active == True))
#                         .order_by(Poll.created_at.desc()))
        
#         result = {
#             "teacher": username,
#             "polls": []
#         }

#         for poll in teacher_polls:
#             questions = (Question
#                         .select()
#                         .where(Question.poll == poll)
#                         .count())

#             user_answers = (
#                 UserAnswer
#                 .select()
#                 .join(Question)
#                 .where(Question.poll == poll)
#             )

#             answers_by_user = {}
#             for answer in user_answers:
#                 if answer.user.username not in answers_by_user:
#                     answers_by_user[answer.user.username] = []
#                 answers_by_user[answer.user.username].append(answer)

#             poll_stats = {
#                 "poll_id": poll.id,
#                 "poll_title": poll.title,
#                 "total_questions": questions,
#                 "answered_users": len(answers_by_user),
#                 "user_stats": []
#             }

#             for student, answers in answers_by_user.items():
#                 correct = sum(1 for a in answers if a.answer_option.is_correct)
#                 total = len(answers)
                
#                 poll_stats["user_stats"].append({
#                     "student": student,
#                     "answered_questions": total,
#                     "correct_answers": correct,
#                     "score": round(correct / questions * 100, 2) if questions > 0 else 0
#                 })

#             result["polls"].append(poll_stats)

#         return JSONResponse(
#             content=result
#         )

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error fetching user answers: {str(e)}"
#         )

@database.atomic()
def course_create(course: Course, user: UserOut):

    if UserCourse.get_or_none(UserCourse.title == course.title, UserCourse.created_by == User.get_or_none(User.username == user.username)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="course already created"
        )
    try:
        data: UserCourse = UserCourse.create(
            title = course.title,
            created_by = user.username,
        )

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Some exc"
        )
    return JSONResponse(
        content={
            "title": data.title,
        }
    )


@database.atomic()
def change_activity_of_course(title: str, user: UserOut):
    current_course = UserCourse.get_or_none(UserCourse.title == title, UserCourse.created_by == User.get_or_none(User.username == user.username))
    if not current_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    try:
        current_course.is_active = not current_course.is_active
        current_course.save()
        return current_course.__data__        
    
    except: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST
        )


@database.atomic()
def get_courses_list(user: UserOut):
    try:
        courses = UserCourse.select().where(UserCourse.created_by == User.get_or_none(User.username == user.username))
        to_return = []
        for course in courses:
            to_return.append(course.__data__)

        return JSONResponse(content=to_return)

    except: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST
        )