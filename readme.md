# CourseCraft - Course Management System

A web-based course management platform for administrators, teachers, and students built with Django REST Framework and React.

---

## Tech Stack

**Backend**
- Python 3.14
- Django 6.0.3
- Django REST Framework
- SimpleJWT (JWT Authentication)
- django-cors-headers

**Database**
- PostgreSQL 15 (running via Docker)

**DevOps**
- Docker & Docker Compose

---

## Project Structure

```
CourseCraft/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── courses/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── manage.py
├── venv/
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.14+
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CourseCraft.git
cd CourseCraft
```

### 2. Start the PostgreSQL database

```bash
docker-compose up -d
```

### 3. Create and activate virtual environment

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up environment variables

Create a `.env` file inside the `backend/` folder:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=coursecraft
DB_USER=coursecraft_user
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

### 6. Run migrations

```bash
cd backend
python manage.py migrate
```

### 7. Start the development server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

---

## User Roles

| Role | Registration | Created By |
|------|-------------|------------|
| Admin | Self-register | Themselves |
| Student | Self-register | Themselves |
| Teacher | Cannot self-register | Admin only |

---

## API Endpoints

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register/` | Register as admin or student | No |
| POST | `/api/users/login/` | Login and get JWT tokens | No |
| POST | `/api/users/token/refresh/` | Refresh access token | No |
| POST | `/api/users/create-teacher/` | Create a teacher account | Admin only |

### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses/` | List all active courses | Yes |
| POST | `/api/courses/` | Create a new course | Admin only |
| GET | `/api/courses/<id>/` | Get course details | Yes |
| PUT | `/api/courses/<id>/` | Update a course | Admin only |
| DELETE | `/api/courses/<id>/` | Deactivate a course | Admin only |
| POST | `/api/courses/enroll/` | Apply for course enrollment | Student only |
| GET | `/api/courses/enrollments/` | List enrollments | Yes (role-filtered) |
| PUT | `/api/courses/enrollments/<id>/` | Approve or reject enrollment | Admin only |

---

## Authentication

This project uses **JWT (JSON Web Tokens)** for authentication.

After logging in, you receive:
- `access` token — include in every request header
- `refresh` token — use to get a new access token when it expires

**How to use the access token in requests:**

```
Authorization: Bearer <your_access_token>
```

---

## Docker Setup

The `docker-compose.yml` sets up a PostgreSQL 15 database:

```yaml
services:
  db:
    image: postgres:15
    container_name: coursecraft_db
    environment:
      POSTGRES_DB: coursecraft
      POSTGRES_USER: coursecraft_user
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Useful Docker commands:**

```bash
docker-compose up -d       # Start database
docker-compose down        # Stop database
docker ps                  # Check running containers
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Debug mode (True/False) |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host (localhost for local dev) |
| `DB_PORT` | Database port (5432) |

> **Note:** Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

## Development Progress

- [x] Docker + PostgreSQL setup
- [x] Django project setup
- [x] Custom User model with roles
- [x] JWT Authentication
- [x] User registration and login
- [x] Admin creates teacher accounts
- [x] Course management (CRUD)
- [x] Course enrollment with prerequisites
- [x] Enrollment approval system
- [ ] Assignments and submissions
- [ ] Grading system
- [ ] Notifications
- [ ] Study materials
- [ ] Frontend (React + Tailwind)
- [ ] Deployment (Docker + Nginx + AWS)