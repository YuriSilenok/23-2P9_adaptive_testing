### Первичное развертывание

- `py -3.8 -m venv .venv`
- `.venv\Scripts\activate`
- ` py -m pip install -U pip`
- `pip install -e .`
- создать папку /API/certs/ с файлами для ключей jwt_private.pem | jwt_public.pem
- `cd API`
- `py db.py`

### Очистка БД

- удалить файл `my_database.db`
- `py db.py`

### Запуск

- `py main.py`