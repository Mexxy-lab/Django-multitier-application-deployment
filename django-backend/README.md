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
docker run -d --name django-mysql \
  -e MYSQL_ROOT_PASSWORD=Admin1234 \
  -e MYSQL_DATABASE=django_database \
  -p 3306:3306 \
  -v ./mysql-config/my.cnf:/etc/mysql/conf.d/my.cnf:ro \
  mysql:8.0

docker exec -it django-mysql mysql -uroot -p        | Used to Change MySQL user authentication plugin to mysql_native_password
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'Admin1234';
FLUSH PRIVILEGES;
SELECT user, host, plugin FROM mysql.user WHERE user='root';      | Should output your user, host and plugin as mysql_native_password
```

Alternatively, you can use the docker-compose.yaml file to spin up the mysql container.

```bash
docker-compose up -d
```

Run the application backend

```bash
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser            | Used to create a superuser admin account
```

View container logs if needed

```bash
docker logs -f django-mysql
docker logs <containerName>         | Used to also view logs of mysql container.
```

Test the Mysql connection locally using the below command

```bash
mysql -h 127.0.0.1 -u root -p
mysql -h 127.0.0.1 -P 3306 -u root -p
```

Update the .env file in frontend root directory witht the backend API server URL

- REACT_APP_API_BASE=<http://localhost:8000/api>

Try logging into the frontend of the application locally

```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "pumej", "password": "Emekulus"}'
```

Now you can access the frontend application locally using the URL, login with the superuser you created or you can register a new user from login page. Django would render the backend successfully.

- <http://localhost:3000/>
