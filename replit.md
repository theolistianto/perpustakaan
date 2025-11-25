# Perpus - Library Management System

## Overview
Perpus is a Next.js-based library management system that allows administrators to manage books, members, and borrowing transactions. The application includes features for book cataloging, member management, borrowing requests, and return tracking.

**Note:** This application currently uses SQLite for development convenience. For production deployment on Replit (especially autoscale), you should migrate to a persistent external database like PostgreSQL, MySQL, or a managed database service to ensure data persists across deployments and instances.

## Project Structure
- **Framework**: Next.js 15.2.0 with App Router
- **Language**: TypeScript
- **UI**: React 19 with Tailwind CSS
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **UI Components**: Radix UI primitives, custom components in `/components`

## Key Features
- User authentication (Admin/Member roles)
- Book catalog management
- Category and shelf organization
- Borrowing system with status tracking (pending, borrowed, returned)
- Dashboard with statistics and charts
- Member management
- Fine calculation for late returns

## Environment Configuration

### Environment Variables
The following environment variables are configured in Replit's shared environment:
- `DATABASE_URL`: SQLite database connection (file:./dev.db)
- `JWT_SECRET`: Secret key for JWT token signing

You can view/modify these in the Replit Secrets tab.

### Development Setup
1. Dependencies are installed via npm
2. Database migrations are managed via Prisma (SQLite-specific migrations generated)
3. Server runs on port 5000 bound to 0.0.0.0 for Replit compatibility
4. Next.js configured with allowed origins for Replit proxy
5. SQLite database file (dev.db) is excluded from future commits via .gitignore

**Note:** If the SQLite database file is currently tracked in git (from initial setup), you can remove it from version control by running:
```bash
cd perpus && git rm -f prisma/dev.db prisma/dev.db-journal
git commit -m "Remove SQLite database from version control"
```
This is optional but recommended to keep your repository clean.

### Production Deployment Considerations
**Important:** The current SQLite setup is suitable for development but NOT for production autoscale deployments on Replit because:
- SQLite databases are stored locally and will be reset/lost when instances restart or scale
- Each autoscale instance would have its own separate database, causing data inconsistency
- Data will not persist across deployments

**For production, you should:**
1. Set up an external PostgreSQL database (Replit offers managed PostgreSQL via the Database pane)
2. Update `perpus/prisma/schema.prisma` to use `provider = "postgresql"`
3. Update the `DATABASE_URL` environment variable to point to your PostgreSQL connection string
4. Run `npx prisma migrate dev` to regenerate migrations for PostgreSQL
5. The startup scripts will automatically apply migrations on deployment

## Database Schema
- **User**: Stores user credentials and roles
- **Category**: Book categories
- **Shelf**: Physical shelf locations
- **Book**: Book information with stock tracking
- **Borrow**: Borrowing transactions with dates and status

## API Endpoints
- `/api/auth/login`: User authentication with auto-account creation
- `/api/books`: Book management
- `/api/members`: Member management
- `/api/borrow`: Borrowing operations
- `/api/dashboard`: Dashboard statistics
- `/api/seed`: Database seeding (GET request)

## User Roles & Features

### Admin (admin@perpus.id / admin123)
- Full dashboard access
- Add, edit, delete books
- View all members
- Manage borrowing records
- Access settings
- Full navbar with all features

### Member/Visitor (visitor@perpus.id / visitor123)
- Browse book catalog
- View borrowing history
- Limited navbar (only Books and "Peminjaman Saya")
- No admin functions

## Running the Application
The application is configured to run automatically via the Next.js Dev Server workflow on port 5000.

### Startup Process
The application uses a startup script (`scripts/startup.sh`) that:
1. Runs `prisma migrate deploy` to ensure the database schema is up-to-date
2. Starts the Next.js development server on port 5000

This ensures that even on fresh deployments, the database will be properly initialized.

### Login Process
1. Visit: `/auth/login`
2. Select role (Pengunjung/Member or Admin)
3. Enter demo credentials or click demo account cards to auto-fill
4. Click "Masuk" button
5. System auto-creates account on first login if it doesn't exist
6. JWT token is generated and stored in localStorage
7. Role-based redirect happens automatically

### Seeding the Database
To seed the database with sample data, visit: `/api/seed`

This endpoint creates:
- 5 sample categories (Teknologi, Fiksi, Non-Fiksi, Sejarah, Pendidikan)
- 4 sample shelves (Rak A, Rak B, Rak C, Rak D)
- 2 sample books for reference

## Recent Changes (November 25, 2025)

### Book Management
- ✅ Created `/api/seed` endpoint to populate database with sample categories, shelves, and books
- ✅ Fixed "Tambah Buku" form - now works correctly after database seeding
- ✅ Add book form validates foreign keys properly
- ✅ Books can now be created with category and shelf associations

### Authentication System
- ✅ Created professional login page at `/auth/login` with modern UI
- ✅ Implemented 2-role authentication system:
  - **Pengunjung (Member)**: Limited access to books catalog and "Peminjaman Saya"
  - **Admin**: Full access to dashboard, books, members, borrowing, and settings
- ✅ Created demo accounts that auto-create on first login:
  - **Member**: visitor@perpus.id / visitor123
  - **Admin**: admin@perpus.id / admin123
- ✅ Login API auto-creates demo accounts if they don't exist
- ✅ Role-based navbar - different menu items for each role
- ✅ Protected dashboard layout with authentication check
- ✅ Logout functionality that clears localStorage and redirects to home
- ✅ Role stored in localStorage for client-side access
- ✅ Token-based authentication with JWT

### Previous Features
- Created professional landing page at `/` with navbar, hero section, services, and CTA
- Added navbar component with logo, navigation menu, and login button
- Implemented "Tambah Buku" (Add Book) page at `/dashboard/books/tambah`
- Added image upload support for book covers (base64 storage in database)
- Updated book catalog with image thumbnails display
- Updated Books API to handle image data
- Added image field to Book model in Prisma schema
- Created database migration for book image support
- Updated books listing page to fetch and display from API
- Simplified landing page structure for better maintainability
- Migrated from PostgreSQL to SQLite for simplified Replit deployment
- Regenerated Prisma migrations with SQLite-specific syntax (removed PostgreSQL-specific DDL)
- Configured Next.js to run on port 5000 with 0.0.0.0 host binding
- Set up environment variables in Replit shared environment (DATABASE_URL, JWT_SECRET)
- Created fresh SQLite migrations compatible with Replit
- Added startup scripts that automatically run database migrations before server start
- Added comprehensive .gitignore for Node.js/Next.js and excluded SQLite database files
- Updated deployment configuration for autoscale deployment target with production startup script
- Ensured database auto-initialization for fresh deployments

## Project Architecture
- `/perpus/app`: Next.js app directory with routes and API endpoints
- `/perpus/components`: Reusable UI components
- `/perpus/lib`: Utility functions (auth, database, utils)
- `/perpus/prisma`: Database schema and migrations
- `/perpus/public`: Static assets
