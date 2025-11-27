# Perpus - Library Management System

## Overview
Perpus is a Next.js-based library management system that allows administrators to manage books, members, and borrowing transactions. The application includes features for book cataloging, member management, borrowing requests, and return tracking.

**Database:** Connected to Neon PostgreSQL for persistent data storage across deployments.

## Project Structure
- **Framework**: Next.js 15.2.0 with App Router
- **Language**: TypeScript
- **UI**: React 19 with Tailwind CSS
- **Database**: PostgreSQL via Neon (via Prisma ORM)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **UI Components**: Radix UI primitives, custom components in `/components`

## Key Features
- User authentication (Admin/Member roles)
- Book catalog management with image support
- Category and shelf organization
- Complete borrowing system with status tracking:
  - **"Menunggu"** - Pending approval from admin
  - **"Silahkan ambil di perpustakaan"** - Approved, ready to pick up
  - **"Ditolak"** - Rejected by admin
- Inline borrowing UI directly on book cards
- User borrow request tracking with status indicators
- Admin borrowing request management dashboard with Accept/Reject buttons
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
2. Database migrations are managed via Prisma (PostgreSQL migrations)
3. Server runs on port 5000 bound to 0.0.0.0 for Replit compatibility
4. Next.js configured with allowed origins for Replit proxy
5. Connected to Neon PostgreSQL database for persistent data storage

### Database Configuration
- **Provider**: PostgreSQL (via Neon)
- **Environment Variable**: `DATABASE_URL` contains the PostgreSQL connection string
- **Migrations**: Stored in `prisma/migrations/` directory
- **Automatic Migration**: Startup script runs `prisma migrate deploy` to ensure schema is up-to-date

## Database Schema
- **User**: Stores user credentials and roles
- **Category**: Book categories
- **Shelf**: Physical shelf locations
- **Book**: Book information with stock tracking
- **Borrow**: Borrowing transactions with dates and status

## API Endpoints
- `/api/auth/login`: User authentication with auto-account creation
- `/api/books`: Book management and listing (includes category and shelf data)
- `/api/books/[id]`: Get book details with category and shelf info
- `/api/members`: Member management
- `/api/borrow/request`: Create new borrow request (POST)
- `/api/borrow/request/[id]`: Delete or update borrow request (DELETE, PATCH)
- `/api/borrow/user-requests`: Get current user's borrow requests (GET)
- `/api/borrow/all-requests`: Get all pending requests (Admin only)
- `/api/dashboard`: Dashboard statistics
- `/api/seed`: Database seeding (GET request)

## User Roles & Features

### Admin (admin@perpus.id / admin123)
- Full dashboard access
- Add, edit, delete books
- View all members
- **Manage borrowing requests** - View all pending requests via `/dashboard/borrow`, approve (status → "approved"), or reject (status → "rejected")
- Access settings
- Full navbar with all features

### Member/Visitor (visitor@perpus.id / visitor123)
- Browse book catalog with search and category filters
- **View book cards** with stock information
- **Request Borrowing** - Click "Ajukan Peminjaman" button on book card → confirm in modal → request created
- **View borrowing requests** - Table shows all requests with statuses and cancel option for pending requests
- View borrowing history with status tracking:
  - "Menunggu" (Pending admin approval)
  - "Silahkan ambil di perpustakaan" (Approved, ready to pick up)
  - "Ditolak" (Rejected by admin)
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

### Borrowing Workflow (Member)
1. **Member views Katalog Buku** → See books in grid with "Ajukan Peminjaman" button
2. **Member clicks "Ajukan Peminjaman"** → Modal appears with book details (Judul, Pengarang, Kategori, Rak)
3. **Member clicks "Pinjam"** → Request created with status "pending"
4. **Table appears below** → Shows request with status "Menunggu" and "Batal" button
5. **Member sees update** → When admin approves, status changes to "Silahkan ambil di perpustakaan"

### Borrowing Workflow (Admin)
1. **Admin views `/dashboard/borrow`** → See all pending requests with book info, user name, user email
2. **Admin clicks "Terima"** → Request approved, status becomes "approved"
3. **Member sees update** → Status changes to "Silahkan ambil di perpustakaan" in their table
4. **Admin can also click "Tolak"** → Reject the request, status becomes "rejected"

### Seeding the Database
To seed the database with sample data, visit: `/api/seed`

This endpoint creates:
- 5 sample categories (Teknologi, Fiksi, Non-Fiksi, Sejarah, Pendidikan)
- 4 sample shelves (Rak A, Rak B, Rak C, Rak D)
- 2 sample books for reference

## Recent Changes (November 27, 2025)

### Navbar Menu Enhancement (Guest Users) ✅
- ✅ **Navbar Menu When Not Logged In** - Updated to show public navigation:
  - Beranda (Home)
  - Tentang Kami (About Us)
  - Panduan (Guide/Example page with fine examples)
  - Buku (Books catalog)
  - Cara Meminjam (How to Borrow)
- ✅ **Admin Menu** - Setting, Cara Meminjam, Buku
- ✅ **Member Menu** - Peminjaman Saya, Cara Meminjam, Buku

### Riwayat Peminjaman Card UI Upgrade ✅
- ✅ **Simple Card Layout** (`/dashboard/borrow` tab "Riwayat Peminjaman"):
  - Clean card-based UI (responsive desktop + mobile)
  - Info per card: ID Peminjaman, Judul Buku, Pengarang, Status
  - Status: Badge warna dengan "Dipinjam" (kuning) atau "Dikembalikan" (hijau)
  - Tanggal: Waktu Awal Peminjaman, Batas Pengembalian, Denda
  - **Denda otomatis Rp 0 ketika "Dikembalikan"** (tidak perlu kalkulasi)
  - Button Delete: Hapus riwayat dengan konfirmasi
  - Color coding denda: Merah (ada denda), Hijau (Rp 0), Abu-abu (tidak ada)
  - Grid layout responsive: 1 kolom mobile, 3 kolom top info, 4 kolom bottom info di desktop

### Comprehensive Fine (Denda) System ✅
- ✅ **FineSettings Model** - Added database table for managing denda configurations
- ✅ **Fine Settings API** (`/api/fine-settings`) - GET and PATCH endpoints to manage denda settings
- ✅ **Calculate Fine API** (`/api/borrow/calculate-fine`) - Calculate denda berdasarkan keterlambatan
- ✅ **Denda Settings Page** (`/dashboard/settings/denda`) - Admin dapat mengatur:
  - Denda per 7 hari (Rp 100 - Rp 100.000, default: Rp 1.000)
  - Maksimal denda (Rp 100.000 - Rp 1.000.000, default: Rp 50.000)
  - Settings disimpan ke database (bukan localStorage)
- ✅ **Denda Column di Table Peminjam** - `/dashboard/peminjam` menampilkan kolom "Denda" dengan:
  - Perhitungan otomatis: (Hari Terlambat ÷ 7) × Denda per 7 hari
  - Maksimal denda tidak boleh lebih dari setting
  - Denda Rp 0 jika buku sudah dikembalikan (returnDate ada)
  - Color coding: Merah (ada denda) / Hijau (tidak ada)
  - Responsive desktop table + mobile cards
- ✅ **Contoh Halaman Denda** (`/contoh-denda`) - Halaman public menunjukkan contoh table dengan denda
- ✅ **Admin Navbar** - "Cara Meminjam" ditambahkan ke menu admin
- ✅ **Mobile Dark Mode Toggle** - Dark mode toggle sekarang tersedia di mobile menu hamburger
- ✅ **Text Change** - "Tentang Kami" → "PERPUSTAKAAN"
- ✅ **Port Configuration** - Server running di port 5000 dengan proper host binding

## Recent Changes (November 26, 2025)

### Navbar & Borrow Table Visibility Fixes ✅
- ✅ Navbar now displays on homepage (/)
- ✅ Removed "Beranda" text from navbar menu
- ✅ "Setting" menu only visible for admin users
- ✅ Fixed table visibility on `/dashboard/borrow` for member/visitor - table persists across page navigation
- ✅ Fixed fetch functions in borrow page to properly pass email parameter from localStorage
- ✅ Added proper loading state management on borrow page

### Mobile Responsive Dashboard ✅
- ✅ Added hamburger menu (☰) button on mobile devices (hidden on desktop)
- ✅ Sidebar now slides in/out on mobile with overlay
- ✅ Dashboard tables converted to card layout on mobile devices:
  - `/dashboard/borrow` - Borrowing requests show as cards with all details
  - `/dashboard/peminjam` - Borrower management shows as cards with action buttons stacked vertically
  - Cards display: Request ID, Book title, Author, Status, User info, and action buttons
  - Desktop view maintains full tables for better data visibility
  - Mobile view optimized for single-column touch-friendly layout
- ✅ Added responsive icon section on landing page with statistics (Users, Books, Visitors, Borrowings)
- ✅ Updated footer with improved "Kontak Kami" section and social media icons

### Previous Implementation (November 25, 2025)

### Simplified Borrowing UI Implementation ✅
- ✅ Added "Ajukan Peminjaman" button directly on book cards
- ✅ Created confirmation modal showing book details (Judul, Pengarang, Kategori, Rak)
- ✅ Inline borrow request table appears below books showing:
  - Request ID
  - Book title and author
  - Status with color-coded badges (Menunggu, Silahkan ambil, Ditolak)
  - Cancel button for pending requests
- ✅ Status display with icons (Clock for pending, CheckCircle for approved, XCircle for rejected)
- ✅ Updated `/api/books` to include category and shelf relationships
- ✅ Updated `/api/borrow/user-requests` to fetch book relationships with category/shelf

### Previous Implementation
- ✅ Created book detail pages with Like, Share, Request Borrowing buttons (now replaced with simpler UI)
- ✅ Created API endpoints for borrowing functionality
- ✅ Implemented admin panel for managing borrow requests
- ✅ Created professional landing page at `/` with navbar, hero section, services, and CTA
- ✅ Added navbar component with logo, navigation menu, and login button
- ✅ Implemented "Tambah Buku" (Add Book) page at `/dashboard/books/tambah`
- ✅ Added image upload support for book covers (base64 storage in database)
- ✅ Updated book catalog with image thumbnails display
- ✅ Migrated from PostgreSQL to SQLite for simplified Replit deployment
- ✅ Configured Next.js to run on port 5000 with 0.0.0.0 host binding
- ✅ Created fresh SQLite migrations compatible with Replit
- ✅ Added startup scripts that automatically run database migrations before server start
- ✅ Created comprehensive .gitignore for Node.js/Next.js and excluded SQLite database files
- ✅ Created professional login page at `/auth/login` with 2-role authentication system
- ✅ Implemented demo accounts with auto-account creation on first login
- ✅ Created role-based navbar with different menu items for admin and member
- ✅ Protected dashboard layout with authentication check
- ✅ Added logout functionality that clears localStorage and redirects to home

## Project Architecture
- `/perpus/app`: Next.js app directory with routes and API endpoints
- `/perpus/components`: Reusable UI components
- `/perpus/lib`: Utility functions (auth, database, utils)
- `/perpus/prisma`: Database schema and migrations
- `/perpus/public`: Static assets

## Testing
API endpoints verified and tested:
- Login: ✅ Creates user and returns JWT token
- Book listing: ✅ Returns all books with category and shelf info
- Book details: ✅ Returns single book with relationships
- Borrow request creation: ✅ Creates request with pending status
- User requests: ✅ Returns filtered user's requests with relationships
- All requests (admin): ✅ Returns all pending requests
- Status update: ✅ Updates request status (pending → approved → "Silahkan ambil di perpustakaan")
- Modal confirmation: ✅ Shows book details with category and shelf
