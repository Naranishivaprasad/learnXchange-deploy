# LearnXchange — Backend API

A Node.js + Express + MongoDB REST API with Cloudinary media uploads, JWT authentication, and role-based access control.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **File Upload**: Multer → Cloudinary
- **Dev**: Nodemon

---

## Project Structure

```
learnXchange/
├── config/
│   ├── cloudinary.js      # Cloudinary SDK setup
│   ├── multer.js          # Multer disk storage config
│   └── user.js            # MongoDB connection
├── controllers/
│   ├── authcontroller.js
│   ├── admincontroller.js
│   ├── blogcontroller.js
│   ├── jobcontroller.js
│   ├── postcontroller.js
│   └── usercontroller.js
├── middleware/
│   └── authmiddleware.js  # isAuthenticated, isAdmin
├── models/
│   ├── usermodel.js
│   ├── blogmodel.js
│   ├── jobmodel.js
│   └── postmodel.js
├── routes/
│   ├── authrouter.js
│   ├── adminrouter.js
│   ├── blogrouter.js
│   ├── jobrouter.js
│   ├── postrouter.js
│   └── userrouter.js
├── .env                   # ← create from .env.example (never commit)
├── .env.example           # template — safe to commit
├── .gitignore
├── package.json
└── server.js
```

---

## Getting Started (Local)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Then edit .env with your real values
```

### 3. Run the server

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`

---

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/user/...` | User routes | ✅ |
| GET/POST | `/api/post/...` | Post routes | ✅ |
| GET/POST | `/api/blog/...` | Blog routes | ✅ |
| GET/POST | `/api/job/...` | Job routes | ✅ |
| GET/POST | `/api/admin/...` | Admin routes | ✅ Admin |

---

## Deployment

### Railway / Render / Fly.io

1. Push your code to GitHub (**make sure `.env` is in `.gitignore`**)
2. Create a new project on your chosen platform
3. Set all environment variables from `.env.example` in the platform dashboard
4. Set the start command to `npm start`
5. For MongoDB, use a **MongoDB Atlas** connection string for `MONGO_URI`

### Environment Variables to Set in Production

| Variable | Description |
|---|---|
| `PORT` | Port (most platforms set this automatically) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | A long, random secret string |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |

---

## ⚠️ Security Notes

- Never commit your `.env` file — it's in `.gitignore`
- Rotate your `JWT_SECRET` and Cloudinary keys before going live (your current `.env` has real credentials — regenerate them)
- Use MongoDB Atlas for production instead of a local MongoDB instance
