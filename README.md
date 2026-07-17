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

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

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
│   ├── courses/
│   ├── assignments/
│   ├── materials/
│   ├── notifications/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Application views
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── TSNotifications.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── AdminCourses.jsx
│   │   │   │   ├── AdminNotifications.jsx
│   │   │   │   ├── LoginAdmin.jsx
│   │   │   │   ├── ManageEnrollments.jsx
│   │   │   │   ├── ManageTeachers.jsx
│   │   │   │   └── RegisterAdmin.jsx
│   │   │   ├── teacher/
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── TeacherCourses.jsx
│   │   │   │   ├── TeacherAssignments.jsx
│   │   │   │   ├── TeacherMaterials.jsx
│   │   │   │   └── TeacherSubmissions.jsx
│   │   │   └── student/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── StudentAssignments.jsx
│   │   │       ├── StudentMaterials.jsx
│   │   │       ├── StudentPerformance.jsx
│   │   │       ├── BrowseCourses.jsx
│   │   │       └── StudentsCourses.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── venv/
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.14+
- Node.js 18+
- Docker Desktop
- Git

### Backend Setup

#### 1. Clone the repository

```bash
git clone https://github.com/Rumon27/Course-Craft.git
cd coursecraft
```

#### 2. Start the PostgreSQL database

```bash
docker-compose up -d
```

#### 3. Create and activate virtual environment

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

#### 4. Install dependencies

```bash
pip install -r requirements.txt
```

#### 5. Set up environment variables

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

#### 6. Run migrations

```bash
cd backend
python manage.py migrate
```

#### 7. Start the backend server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

---

### Frontend Setup

#### 1. Navigate to frontend folder

```bash
cd frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Start the development server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## User Roles

| Role | Registration | Created By |
|------|--------------|------------|
| Admin | `/admin/register` | Themselves |
| Student | `/register` | Themselves |
| Teacher | Cannot self-register | Admin only |

---

## API Endpoints

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
| POST | `/api/users/register/` | Register as admin or student | No |
| POST | `/api/users/login/` | Login and get JWT tokens | No |
| POST | `/api/users/token/refresh/` | Refresh access token | No |
| POST | `/api/users/create-teacher/` | Create a teacher account | Admin only |
| GET | `/api/users/teachers/` | List all teachers | Admin only |

### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
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
|--------|----------|--------------|----------------|
| GET | `/api/courses/<course_id>/assignments/` | List assignments for a course | Yes |
| POST | `/api/courses/<course_id>/assignments/` | Create an assignment | Teacher only |
| GET | `/api/courses/<course_id>/assignments/<id>/` | Get assignment details | Yes |
| PUT | `/api/courses/<course_id>/assignments/<id>/` | Update an assignment | Teacher only |
| DELETE | `/api/courses/<course_id>/assignments/<id>/` | Delete an assignment | Teacher only |

### Submissions

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
| GET | `/api/courses/<course_id>/assignments/<id>/submissions/` | List submissions | Yes (role-filtered) |
| POST | `/api/courses/<course_id>/assignments/<id>/submissions/` | Submit an assignment | Student only |
| PUT | `/api/courses/<course_id>/assignments/<id>/submissions/<id>/grade/` | Grade a submission | Teacher only |

### Study Materials

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
| GET | `/api/courses/<course_id>/materials/` | List materials for a course | Yes |
| POST | `/api/courses/<course_id>/materials/` | Add a material | Teacher only |
| PUT | `/api/courses/<course_id>/materials/<id>/` | Update a material | Teacher only |
| DELETE | `/api/courses/<course_id>/materials/<id>/` | Delete a material | Teacher only |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
| GET | `/api/notifications/` | Get my notifications | Yes |
| PUT | `/api/notifications/<id>/read/` | Mark notification as read | Yes |
| POST | `/api/notifications/global/` | Send global notification | Admin only |

### Performance

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
| GET | `/api/performance/` | Get my performance | Student only |
| GET | `/api/performance/<student_id>/` | Get a student's performance | Teacher/Admin only |

---

## Authentication

This project uses **JWT (JSON Web Tokens)** for authentication.

After logging in, you receive:
- `access` token — include in every request header
- `refresh` token — use to get a new access token when it expires

Tokens are automatically managed by the Axios interceptor in `frontend/src/api/axios.js`.

---

## Docker Setup

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
|----------|--------------|
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
- [x] Project setup (React + Vite + Tailwind)
- [x] Axios setup with JWT interceptor
- [x] Auth context and protected routes
- [x] Login & Register pages
- [x] Admin dashboard, courses, teachers, enrollments, notifications
- [x] Teacher dashboard, courses, assignments, materials, grading
- [x] Student dashboard, browse/enroll, assignments, materials, performance
- [x] Shared notifications page

**Deployment**
- [ ] Nginx configuration
- [ ] AWS deployment
- [ ] Docker production setup