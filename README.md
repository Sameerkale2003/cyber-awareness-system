# 🛡️ Cyber Awareness System

> **Stay Safe. Stay Secure. Protect Your Digital Identity.**

A full-stack, production-quality Cyber Awareness Platform built with **Django REST API** (backend) and **React + Vite** (frontend). Educate users about password hygiene, personal data protection, phishing awareness, and online safety through interactive modules, quizzes, and gamification.

---

## 🚀 Features

### 🎓 Learning Modules
- **6 Categories**: Password Security, Personal Data Protection, Cyber Safety, Phishing Awareness, Social Media Safety, Network Security
- **8+ Modules** with multiple lessons per module
- Difficulty levels: Beginner, Intermediate, Advanced
- Progress tracking per module

### 📝 Interactive Quizzes
- Multiple choice and True/False questions
- Timed quizzes with countdown timer
- Instant feedback with explanations
- Score tracking and history
- Points awarded on completion

### 💡 Cyber Safety Tips
- 15+ actionable cyber safety tips
- Category filtering
- Tip of the Day feature
- Password Hygiene, Personal Data Protection, and more

### 🏆 Gamification
- Points system (view module = 5pts, complete = 20pts, pass quiz = 50pts)
- Badges & Achievements
- Global Leaderboard (Weekly / Monthly / All Time)
- Daily Streak tracking

### 📊 Dashboard
- Real-time statistics
- Progress charts (Chart.js / ApexCharts)
- Activity feed
- Personalized learning recommendations

### 🔐 Authentication
- JWT-based authentication (access + refresh tokens)
- User registration with validation
- Secure login/logout
- Profile management with avatar upload
- Change password

### 🤝 Safety Pledge
- Take the Community Safety Pledge
- Share your commitment
- Track pledge statistics

---

## 🏗️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Bootstrap 5, Framer Motion      |
| Backend    | Python 3.11+, Django 4.2, Django REST Framework |
| Database   | SQLite3 (built-in)                              |
| Auth       | JWT (djangorestframework-simplejwt)             |
| API Docs   | drf-spectacular (Swagger UI)                    |
| Charts     | Chart.js, ApexCharts                            |
| Icons      | Bootstrap Icons, Font Awesome 6                 |

---

## 📁 Project Structure

```
cyber-awareness-system/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── setup.bat              # One-click setup script
│   ├── config/                # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/              # User auth & profiles
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── learning/              # Modules, lessons, tips
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── management/commands/populate_data.py
│   ├── quizzes/               # Quizzes & results
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   └── progress/              # User progress & achievements
│       ├── models.py
│       ├── serializers.py
│       └── views.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── context/           # React Context (Auth, Theme)
│       ├── services/          # API service layer
│       ├── hooks/             # Custom React hooks
│       ├── layouts/           # Page layouts
│       ├── components/        # Reusable UI components
│       └── pages/             # Page components
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+

### Backend Setup

```bash
cd backend

# Run the automated setup script (Windows)
setup.bat

# OR manually:
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py populate_data   # Seeds initial content
python manage.py createsuperuser

python manage.py runserver       # Starts at http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

# Run the automated setup script (Windows)
run.bat

# OR manually:
npm install
npm run dev     # Starts at http://localhost:5173
```

### Access the Application
| URL                              | Description               |
|----------------------------------|---------------------------|
| http://localhost:5173            | React Frontend            |
| http://localhost:8000/admin/     | Django Admin Panel        |
| http://localhost:8000/api/docs/  | Swagger API Documentation |

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `Admin@123`

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| POST   | `/api/auth/register/`         | Register new user      |
| POST   | `/api/auth/login/`            | Login (returns JWT)    |
| POST   | `/api/auth/logout/`           | Logout                 |
| GET    | `/api/auth/profile/`          | Get user profile       |
| PUT    | `/api/auth/profile/`          | Update profile         |
| POST   | `/api/auth/change-password/`  | Change password        |
| GET    | `/api/auth/stats/`            | User statistics        |

### Learning
| Method | Endpoint                        | Description           |
|--------|---------------------------------|-----------------------|
| GET    | `/api/learning/categories/`     | All categories        |
| GET    | `/api/learning/modules/`        | All modules           |
| GET    | `/api/learning/modules/{id}/`   | Module detail         |
| GET    | `/api/learning/tips/`           | All cyber tips        |
| POST   | `/api/learning/pledge/`         | Take safety pledge    |

### Quizzes
| Method | Endpoint                         | Description          |
|--------|----------------------------------|----------------------|
| GET    | `/api/quizzes/`                  | All quizzes          |
| GET    | `/api/quizzes/{id}/`             | Quiz with questions  |
| POST   | `/api/quizzes/{id}/submit/`      | Submit quiz          |
| GET    | `/api/quizzes/leaderboard/`      | Quiz leaderboard     |

### Progress
| Method | Endpoint                      | Description             |
|--------|-------------------------------|-------------------------|
| GET    | `/api/progress/dashboard/`    | Dashboard stats         |
| GET    | `/api/progress/`              | User progress           |
| GET    | `/api/progress/activity/`     | Activity feed           |
| GET    | `/api/progress/leaderboard/`  | Overall leaderboard     |

---

## 🎨 Design System

| Token             | Value      | Usage                   |
|-------------------|------------|-------------------------|
| `--primary`       | `#1a1a2e`  | Main background         |
| `--secondary`     | `#16213e`  | Card backgrounds        |
| `--accent`        | `#0f3460`  | Borders, accents        |
| `--highlight`     | `#e94560`  | CTAs, alerts            |
| `--success`       | `#00d4aa`  | Success states          |
| `--text-primary`  | `#ffffff`  | Primary text            |
| `--text-muted`    | `#94a3b8`  | Secondary text          |

---

## 🛡️ Security Features

- JWT authentication with token refresh
- CORS configuration
- Password strength validation
- SQL injection protection (Django ORM)
- XSS protection via React's JSX escaping
- HTTP-only token storage considerations

---

## 📸 Screenshots

> *Login Page • Dashboard • Learning Hub • Quiz • Leaderboard*

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>🔒 Password Hygiene & Personal Data Protection Campaign</strong><br/>
  <em>Think Before You Click • Protect Your Data • Stay Secure</em>
</div>
