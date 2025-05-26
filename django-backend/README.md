# Running the Django-backend application locally

To run the backend locally follow the below steps

---

## 🚀 Steps to Launch application backend locally

- Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

</details>

```cmd
% .venv\Scripts\activate.bat
```

</details>

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Make sure to spin up the mysql container or service locally also. This will let Django running locally connect to MySQL at 127.0.0.1.

```bash
docker run -d \
  --name django-mysql \
  -e MYSQL_ROOT_PASSWORD=Admin1234 \
  -e MYSQL_DATABASE=django_database \
  -p 3306:3306 \
  mysql:8.0
```

Run the application backend

```bash
python3 manage.py runserver
```

Test the Mysql connection locally using the below command

```bash
mysql -h 127.0.0.1 -u root -p
```
