# Perpus - Library Management System

## Overview
Perpus is a Next.js-based library management system for managing books, members, and borrowing transactions. It provides features for book cataloging, member management, borrowing requests, and return tracking, with a focus on a streamlined user experience for both administrators and members. The system is connected to Neon PostgreSQL for persistent data storage.

## User Preferences
I want iterative development. Ask before making major changes. I prefer detailed explanations. Do not make changes to the folder `Z`. Do not make changes to the file `Y`. I prefer simple language. I like functional programming.

## System Architecture
The application is built with Next.js 15.2.0 (App Router), TypeScript, React 19, and Tailwind CSS for the UI. It uses Prisma ORM to interact with a PostgreSQL database hosted on Neon. Authentication is JWT-based with bcrypt for password hashing. UI components leverage Radix UI primitives alongside custom components.

**Key Features:**
- User authentication with Admin/Member roles.
- Comprehensive book catalog management, including images, categories, and shelf organization.
- A complete borrowing system with multiple statuses ("Menunggu", "Silahkan ambil di perpustakaan", "Ditolak") and inline UI for borrowing requests directly from book cards.
- Admin dashboard for managing borrowing requests (accept/reject), members, and viewing statistics.
- Fine calculation for late returns with configurable settings.
- Responsive UI with mobile-optimized dashboard layouts (hamburger menu, cards for tables).
- Role-based navigation and protected routes.

**Technical Implementations:**
- Database migrations are managed via Prisma and automatically applied on startup.
- Environment variables (`DATABASE_URL`, `JWT_SECRET`) are configured via Replit Secrets.
- Server runs on port 5000 with 0.0.0.0 binding for Replit compatibility.
- Image uploads for book covers are stored as base64 in the database.
- Auth middleware handles protected routes and redirects, storing intended destinations for post-login navigation.

**UI/UX Decisions:**
- Minimalist and professional UI with clean layouts.
- Favicon and metadata configured for consistent branding.
- Simplified borrowing UI with direct interaction on book cards and clear status indicators.
- Responsive design for optimal viewing across desktop and mobile devices, including card-based layouts for tables on mobile.
- Color-coded badges and icons for statuses and fine indications.

## External Dependencies
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **UI Primitives**: Radix UI