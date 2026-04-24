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
│   ├── assignments/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── materials/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── notifications/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── signals.py
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
| POST | `/api/courses/<id>/complete/` | Mark course as completed | Teacher only |
| POST | `/api/courses/enroll/` | Apply for course enrollment | Student only |
| GET | `/api/courses/enrollments/` | List enrollments | Yes (role-filtered) |
| PUT | `/api/courses/enrollments/<id>/` | Approve or reject enrollment | Admin only |

### Assignments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses/<course_id>/assignments/` | List assignments for a course | Yes |
| POST | `/api/courses/<course_id>/assignments/` | Create an assignment | Teacher only |
| GET | `/api/courses/<course_id>/assignments/<id>/` | Get assignment details | Yes |
| PUT | `/api/courses/<course_id>/assignments/<id>/` | Update an assignment | Teacher only |
| DELETE | `/api/courses/<course_id>/assignments/<id>/` | Delete an assignment | Teacher only |

### Submissions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses/<course_id>/assignments/<id>/submissions/` | List submissions | Yes (role-filtered) |
| POST | `/api/courses/<course_id>/assignments/<id>/submissions/` | Submit an assignment | Student only |
| PUT | `/api/courses/<course_id>/assignments/<id>/submissions/<id>/grade/` | Grade a submission | Teacher only |

### Study Materials

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses/<course_id>/materials/` | List materials for a course | Yes |
| POST | `/api/courses/<course_id>/materials/` | Add a material | Teacher only |
| PUT | `/api/courses/<course_id>/materials/<id>/` | Update a material | Teacher only |
| DELETE | `/api/courses/<course_id>/materials/<id>/` | Delete a material | Teacher only |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications/` | Get my notifications | Yes |
| PUT | `/api/notifications/<id>/read/` | Mark notification as read | Yes |
| POST | `/api/notifications/global/` | Send global notification | Admin only |

### Performance

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/performance/` | Get my performance | Student only |
| GET | `/api/performance/<student_id>/` | Get a student's performance | Teacher/Admin only |

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

## Key Features

**Admin**
- Create and manage courses
- Assign teachers to courses
- Create teacher accounts
- Approve or reject student enrollments
- Send global notifications to all users

**Teacher**
- Create assignments inside their courses
- Upload study materials (files or links)
- View and grade student submissions
- Mark a course as completed

**Student**
- Browse and apply for courses
- View study materials of enrolled courses
- Submit assignments (text or file)
- View grades and performance tracking
- Prerequisites system — must complete required courses before enrolling

**Notifications**
- Automatic notifications when a new assignment or material is posted
- Global notifications from admin
- Mark notifications as read

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
      POSTGRES_PASSWORD: coursecraft_pass
    ports:
      - "5430:5432"
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


---

## Development Progress

**Backend**
- [x] Docker + PostgreSQL setup
- [x] Django project setup
- [x] Custom User model with roles
- [x] JWT Authentication
- [x] User registration and login
- [x] Admin creates teacher accounts
- [x] Course management (CRUD)
- [x] Course enrollment with prerequisites
- [x] Enrollment approval system
- [x] Assignments and submissions
- [x] Grading system
- [x] Study materials (files and links)
- [x] Notifications with auto signals
- [x] Course completion
- [x] Student performance tracking

**Frontend**
- [ ] Project setup (React + Tailwind)
- [ ] Auth pages (Login, Register)
- [ ] Admin dashboard and pages
- [ ] Teacher dashboard and pages
- [ ] Student dashboard and pages
- [ ] Notifications page

**Deployment**
- [ ] Nginx configuration
- [ ] AWS deployment
- [ ] Docker production setup