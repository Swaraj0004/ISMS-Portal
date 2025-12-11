# 🧾 Internship Management Platform – Project Documentation

## 📘 Overview

The **Internship Management Platform** is a web-based system that simplifies the process of internship management between **admins**, **managers**, and **interns**.

It provides a complete lifecycle — from **application and interview** to **project assignment and certification** — with automated email and PDF generation workflows.

## 🧩 System Roles

### 👤 Admin

- Manages all users (Managers, Interns).
- Creates and assigns projects.
- Verifies documents.
- Sends offer letters and certificates.
- Monitors overall activity.

### 👨‍💼 Manager

- Assigned to one or more projects.
- Monitors intern progress and performance.
- Updates project status and intern reports.

### 🎓 Intern

- Applies for internships directly from landing page.
- Appears for interview.
- Uploads documents for verification.
- Gets assigned to a project under a manager.
- Receives offer letter and certificate.

## ⚙️ Tech Stack

| Layer                | Technology                                | Purpose                                          |
| -------------------- | ----------------------------------------- | ------------------------------------------------ |
| **Frontend**         | Next.js (App Router)                      | Server-side rendering, API integration           |
| **UI Library**       | React + Tailwind CSS                      | Component-based responsive design                |
| **Language**         | TypeScript                                | Type safety across frontend and backend          |
| **Database**         | MongoDB                                   | Stores users, projects, applications, and status |
| **Search / Chatbot** | Fuse.js                                   | Fuzzy search-based chatbot responses             |
| **PDF Generation**   | pdf-lib                                   | Create and format Offer Letters & Certificates   |
| **Email Service**    | Nodemailer                                | Send system emails to users                      |
| **Authentication**   | (Optional JWT or NextAuth if implemented) | Secure user login system                         |
| **Deployment**       | (e.g., Vercel, Render, or VPS)            | Hosting frontend & backend together              |

## 🧠 System Architecture

```
                      ┌────────────────────┐
                      │     Landing Page   │
                      │ (Intern applies)   │
                      └────────┬───────────┘
                               │
                               ▼
                     ┌─────────────────────┐
                     │   Interview Process │
                     └────────┬────────────┘
                               │
                     ┌─────────────────────┐
                     │ Document Verification│
                     └────────┬────────────┘
                               │
                     ┌─────────────────────┐
                     │ Assign to Project   │
                     │ under Manager       │
                     └────────┬────────────┘
                               │
        ┌────────────────────────────┐
        │ Offer Letter (PDF + Email) │
        └────────┬───────────────────┘
                 │
        ┌────────────────────────────┐
        │ Intern Work Monitoring     │
        └────────┬───────────────────┘
                 │
        ┌────────────────────────────┐
        │ Completion Certificate     │
        │ (PDF + Email)              │
        └────────────────────────────┘
```

## 🗂️ Folder Structure (Simplified)

```
/app
 ┣ /api
 ┃ ┣ /intern
 ┃ ┣ /manager
 ┃ ┣ /project
 ┃ ┗ /auth
 ┣ /dashboard
 ┣ /landing
 ┣ /login
 ┗ /utils

/components
 ┣ /common
 ┣ /forms
 ┗ /landing

/lib
 ┣ dbConnect.ts       → MongoDB connection handler
 ┣ offerLetter.ts     → PDF generator (Offer Letter)
 ┣ certificate.ts     → PDF generator (Certificate)
 ┗ sendMail.ts        → Nodemailer setup

/models
 ┣ Intern.ts
 ┣ Manager.ts
 ┗ Project.ts

/public
 ┣ /assets
 ┗ /logos

/styles
 ┗ globals.css

/types
 ┗ index.d.ts

```

## 🧱 Major Features

### 1. 📝 Internship Application

- Interns can apply from the landing page.
- Data stored in MongoDB (`Intern` collection).
- Admin receives the application for interview processing.

### 2. 💬 Fuse.js Chatbot

- Provides predefined responses to FAQs.
- Uses Fuse.js for fuzzy text matching.
- Example: `“How to apply?”` → responds with application steps.

### 3. 🧾 Offer Letter Generation

- Once intern passes interview and verification:

  - Offer Letter is generated using **pdf-lib**.
  - Automatically emailed via **Nodemailer**.

- PDF includes intern details, position, and joining date.

### 4. 📬 Email Integration

- Uses **Nodemailer** with SMTP configuration.
- Sends:

  - Offer Letter
  - Welcome Mail
  - Completion Certificate

### 5. 🧰 Project Assignment

- Admin assigns interns to projects.
- Each project has a **Manager** reference.
- MongoDB relations handled using `.populate()`.

### 6. 📊 Manager Dashboard

- Manager can:

  - View assigned interns.
  - Track progress & update status.

### 7. 🎖️ Completion Certificate

- Auto-generated PDF via **pdf-lib** on completion.
- Includes intern name, duration, project, and signature.
- Sent via **Nodemailer**.

## 🧠 Database Design (Simplified Schema)

### `Intern`

```ts
{
  fullName: String,
  email: String,
  phone: String,
  college: String,
  course: String,
  department: String,
  semester: String,
  status: String,
  project: { type: ObjectId, ref: "Project" },
  manager: { type: ObjectId, ref: "Manager" },
  documents: [String],
  offerLetterUrl: String,
  certificateUrl: String
}
```

### `Manager`

```ts
{
  name: String,
  email: String,
  phone: String,
  department: String,
  projects: [{ type: ObjectId, ref: "Project" }]
}
```

### `Project`

```ts
{
  name: String,
  description: String,
  manager: { type: ObjectId, ref: "Manager" },
  interns: [{ type: ObjectId, ref: "Intern" }]
}
```

## 🧮 API Routes (Next.js App Router)

| Route                  | Method       | Description               |
| ---------------------- | ------------ | ------------------------- |
| `/api/intern`          | GET/POST/PUT | CRUD for interns          |
| `/api/manager`         | GET/POST     | Fetch managers or create  |
| `/api/project`         | GET/POST     | Manage projects           |
| `/api/auth/login`      | POST         | User authentication       |
| `/api/mail/send`       | POST         | Send custom mail          |
| `/api/pdf/offer`       | POST         | Generate offer letter PDF |
| `/api/pdf/certificate` | POST         | Generate certificate PDF  |

## 🔐 Security Notes

- Input validation (frontend + backend)
- Sensitive credentials stored in `.env`
- Emails use secure SMTP or OAuth2
- Optional JWT-based authentication for multi-user dashboard

## 🚀 Deployment Notes

- **Frontend + Backend:** Hosted together on Vercel or Render.
- **Database:** MongoDB Atlas or self-hosted MongoDB.
- **Email:** Gmail SMTP or professional service (e.g., Brevo, SendGrid).
- **Environment Variables:**

  ```
  MONGODB_URI=
  SMTP_HOST=
  SMTP_PORT=
  SMTP_USER=
  SMTP_PASS=
  BASE_URL=
  ```

## 👨‍💻 Developer Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas / Local instance

### Installation

```bash
git clone <repo-url>
cd internship-platform
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit → [http://localhost:3000](http://localhost:3000)

## 🧾 Future Improvements

- Add JWT-based Authentication
- Role-based Authorization Middleware
- Real-time status updates via WebSocket
- Automated reminders for interns
- Analytics dashboard for admin

## 📚 Summary

| Feature  | Tools Used               |
| -------- | ------------------------ |
| Frontend | Next.js, React, Tailwind |
| Backend  | Next.js App Router       |
| Database | MongoDB                  |
| PDF      | pdf-lib                  |
| Mail     | Nodemailer               |
| Chatbot  | Fuse.js                  |
| Language | TypeScript               |
"# ISMS-Portal" 
"# ISMS-Portal" 
