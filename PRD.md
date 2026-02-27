# FixMate India – Product Requirements Document (PRD)

## 1. Product Overview

### Product Name
FixMate India

### Product Type
Multi-city service marketplace platform

### Platform Stack
- Backend: Ruby on Rails 8 (API only mode)
- Frontend: Next.js (App Router + TypeScript)
- Database: PostgreSQL
- Authentication: JWT
- Storage: ActiveStorage (for image uploads)
- Target Market: India

---

## 2. Vision

To build a structured, scalable platform that connects customers in Indian cities with verified electricians and plumbers, enabling smooth job booking and management.

---

## 3. Problem Statement (India Context)

In India:

- Skilled workers mostly operate offline.
- No structured digital marketplace for local service providers.
- No standardized job workflow.
- Customers rely on referrals or random contacts.
- No transparency in booking process.

---

## 4. User Roles (Phase 1 – MVP)

### 4.1 Customer
- Register / Login
- Select city
- Search workers by service
- View worker profile
- Submit job request
- Upload problem images
- Track job status
- Receive notifications

### 4.2 Worker
- Register / Login
- Create worker profile
- Add services offered
- Set availability
- Receive job notification (email + in-app)
- Accept / Reject job
- Mark job as completed

> Note: Admin role intentionally excluded in MVP.  
> Admin & verification system will be added in Phase 2.

---

## 5. Geographic Scope (India Based)

### Initial Supported Cities
- Indore
- Mumbai
- Bhopal
- Delhi
- Pune

### Localization
- Currency: INR (₹)
- Phone format: +91 validation
- Timezone: IST (UTC +5:30)
- Language: English (Phase 1)

Future:
- Hindi support
- Tier 2 city expansion

---

## 6. Core Features (MVP Scope)

### 6.1 Authentication
- JWT-based auth
- Role-based access
- Secure password hashing (bcrypt)

---

### 6.2 Worker Profile System

Worker Profile Includes:
- Name
- Experience (years)
- About section
- Hourly rate (INR)
- Services offered
- Availability toggle
- Total completed jobs (auto-updated)
- Rating field (future-ready)

---

### 6.3 Service & Category Structure

Categories:
- Electrician
- Plumber
- Ac repairer

Example Services:
- Fan Repair
- Motor Rewinding 
- Wiring Installation
- Pipe Leakage Repair
- Bathroom Fitting
- Switchboard Installation

---

### 6.4 Worker Search & Filtering

Customer can filter by:
- City
- Category
- Specific Service
- Availability

Results paginated.

---

### 6.5 Job Request System

Customer submits:

- Service selection
- Description
- Image upload (multiple allowed)
- Preferred schedule date/time
- Location details

Job Status Flow:

- pending
- accepted
- rejected
- completed
- cancelled

State transitions controlled at backend level.

---

## 7. Notification System

### 7.1 Email Notification
When job is created:
- Worker receives email with:
  - Job description
  - Schedule
  - Accept link

Rails 8 ActionMailer used.

---

### 7.2 In-App Notification

Notification table stores:
- User reference
- Message
- Read/unread state

Worker dashboard shows unread badge.

---

## 8. Non-Functional Requirements

### 8.1 Performance
- API response < 500ms
- Indexed DB queries
- Pagination enabled

### 8.2 Security
- JWT authentication
- Role validation middleware
- Strong params in controllers
- File type validation for uploads
- Max file size limit

### 8.3 Scalability
- UUID primary keys
- Proper indexing
- Service-based modular architecture
- Clean API versioning (`/api/v1`)

### 8.4 Responsiveness
- Mobile-first design
- Works on:
  - Mobile
  - Tablet
  - Desktop
- No layout breakpoints issue

---

## 9. Database Entities

Tables:

- users
- cities
- categories
- services
- worker_profiles
- worker_services (join table)
- job_requests
- notifications

All foreign keys indexed.

---

## 10. API Structure

Base:
`/api/v1`

### Auth
- POST /auth/register
- POST /auth/login

### Worker
- GET /workers
- GET /workers/:id
- PUT /worker/profile
- PATCH /worker/availability

### Jobs
- POST /jobs
- GET /jobs/my
- PATCH /jobs/:id/accept
- PATCH /jobs/:id/reject
- PATCH /jobs/:id/complete
- PATCH /jobs/:id/cancel

---

## 11. UI/UX Requirements

### Design Principles
- Clean
- Minimal
- Professional
- Not over-designed
- Fast loading

### Worker Card Must Include
- Name
- Experience
- Services list
- Rate (₹/hour)
- Availability badge
- Book Now button

### Booking Form
- Required field validation
- Image preview before upload
- Date-time picker (IST)
- Clear success/error message

---

## 12. Job State Rules

Only Worker Can:
- Accept
- Reject
- Complete

Only Customer Can:
- Cancel (before accepted)

Backend must validate state transitions.

---

## 13. Error Handling Requirements

- Proper HTTP status codes
- Structured JSON error responses
- Graceful UI fallback
- No raw exception messages exposed

---

## 14. Hackathon MVP Completion Criteria

Product is considered ready when:

- Users can register and login
- Worker profile can be created
- Workers appear in city-based search
- Customer can create job with image
- Worker receives email notification
- Worker can accept/reject job
- Job status updates correctly
- Fully responsive UI
- No breaking bugs
- Clean API structure

---

## 15. Future Phase (Post Hackathon)

- Admin role
- Worker verification system
- Ratings & reviews
- Payment gateway (UPI / Razorpay)
- Real-time chat (ActionCable)
- Commission model
- Subscription plans
- Hindi language support

---

END OF PRD