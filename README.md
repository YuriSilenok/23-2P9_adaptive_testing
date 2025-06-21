### Первичное развертывание

- `py -3.8 -m venv .venv`
- `.venv\Scripts\activate`
- `pip install -e .`
- `cd /API`
- `py /db.py`
- создать папку /API/certs/ с ключами jwt_private.pem | jwt_public.pem

### Очистка БД

- удалить файл `my_database.db`
- `py /db.py`

### Запуск

- `py /main.py`