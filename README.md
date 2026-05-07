# Aparaitech LMS — Full Stack Learning Management System

A full-stack LMS platform built for **Aparaitech Software**, enabling students to browse, enroll in, and complete project-based courses, while educators manage content and track progress through a dedicated dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (email + password) |
| Payments | Razorpay |
| Storage | Cloudinary (images & PDFs) |
| Deployment | Vercel (client + server) |

---

## Project Structure

```
lms_Aparaitech_Software/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AppContext (auth, courses, state)
│   │   ├── pages/
│   │   │   ├── student/     # Home, CourseDetails, Player, MyEnrollments, ...
│   │   │   └── educator/    # Dashboard, AddCourse, EditCourse, AssignCourse, ...
│   │   └── App.jsx
│   └── .env.example
│
├── server/                  # Express backend
│   ├── configs/             # MongoDB, Cloudinary, Multer
│   ├── controllers/         # auth, user, educator, course, razorpay
│   ├── middlewares/         # JWT auth middleware
│   ├── models/              # User, Course, Purchase, CourseProgress
│   ├── routes/              # authRoutes, userRoutes, educatorRoutes, courseRoute
│   ├── seed.js              # Seed users from Excel data
│   ├── seed_users.json      # 75 pre-loaded student accounts
│   └── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account

---

### 1. Clone the repository

```bash
git clone https://github.com/pnaorbitsoftware/lms_Aparaitech_Software.git
cd lms_Aparaitech_Software
```

---

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in your values in .env
npm run server
```

**`server/.env`**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ALLOWED_ORIGINS=http://localhost:5173
```

> Generate a strong JWT secret: `openssl rand -hex 32`

---

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

**`client/.env`**

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

### 4. Seed Student Accounts

To load the 75 pre-registered students from the Excel data into MongoDB:

```bash
cd server
npm run seed
```

This creates accounts for all students with their original passwords. Existing emails are skipped automatically.

---

## Authentication

This project uses **JWT-based email/password authentication** (Clerk has been removed).

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login and receive JWT token |

The token is stored in `localStorage` and sent as `Authorization: Bearer <token>` on all protected requests.

### Roles

| Role | Access |
|---|---|
| `student` | Browse courses, enroll, track progress |
| `educator` | All student access + course management dashboard |
| `admin` | Same as educator |

To promote a user to educator, call:
```
GET /api/educator/update-role
Authorization: Bearer <token>
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login user |

### User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/data` | ✅ | Get current user |
| GET | `/api/user/enrolled-courses` | ✅ | Get enrolled courses |
| POST | `/api/user/update-course-progress` | ✅ | Mark lecture complete |
| POST | `/api/user/get-course-progress` | ✅ | Get course progress |
| POST | `/api/user/add-rating` | ✅ | Rate a course |

### Courses (Public)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/course/all` | ❌ | List all published courses |
| GET | `/api/course/:id` | ❌ | Get course details |

### Educator (Protected — educator/admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/educator/update-role` | Promote self to educator |
| POST | `/api/educator/add-course` | Create new course |
| GET | `/api/educator/courses` | List own courses |
| PUT | `/api/educator/course/:id` | Update course |
| DELETE | `/api/educator/course/:id` | Delete course |
| GET | `/api/educator/dashboard` | Dashboard stats |
| GET | `/api/educator/enrolled-students` | View enrolled students |
| DELETE | `/api/educator/remove-student/:courseId/:studentId` | Remove student access |
| GET | `/api/educator/all-students` | List all students |
| POST | `/api/educator/assign-course` | Manually assign course |

### Payments (Razorpay)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/course/purchase/create-order` | ✅ | Create Razorpay order |
| POST | `/api/course/purchase/verify-payment` | ✅ | Verify and complete payment |

---

## Deployment (Vercel)

Both `client/` and `server/` include `vercel.json` for Vercel deployment.

### Deploy Backend
```bash
cd server
vercel --prod
```
Set all environment variables from `server/.env.example` in Vercel project settings.

### Deploy Frontend
```bash
cd client
vercel --prod
```
Set `VITE_BACKEND_URL` to your deployed backend URL and `VITE_RAZORPAY_KEY_ID`.

---

## Features

**Student**
- Browse and search project-based courses
- Enroll via Razorpay payment
- Watch video lectures with progress tracking
- Download PDF resources
- Rate completed courses
- View all enrolled courses

**Educator / Admin**
- Create and edit courses with video content and PDF attachments
- Upload course thumbnails via Cloudinary
- Assign courses to students manually (free access)
- View enrollment and earnings dashboard
- Remove student access

---

## Scripts

| Location | Command | Description |
|---|---|---|
| `server/` | `npm run server` | Start backend with nodemon |
| `server/` | `npm start` | Start backend (production) |
| `server/` | `npm run seed` | Seed student accounts from Excel |
| `client/` | `npm run dev` | Start frontend dev server |
| `client/` | `npm run build` | Build for production |

---

## License

Private — Aparaitech Software. All rights reserved.
