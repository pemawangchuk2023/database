# Document Management System (DMS)

## PostgreSQL Setup

### Prerequisites
- PostgreSQL installed (pgAdmin 4)
- Node.js installed

### Database Configuration

1. **Start PostgreSQL Server**
   - Open pgAdmin 4
   - Ensure PostgreSQL server is running
   - Create database named `dms` if it doesn't exist

2. **Environment Variables**
   
   Update `.env` file:
   ```env
   DATABASE_HOST=localhost
   DATABASE_NAME=dms
   DATABASE_USER=postgres
   DATABASE_PASSWORD="Pema@#2025"
   ```

3. **Initialize Database**
   
   Run the SQL schema:
   ```bash
   npm run db:init
   ```
   
   Or manually in pgAdmin 4:
   - Open Query Tool
   - Load and execute `dms.sql`

### Database Schema

The `dms.sql` file contains:
- **Department** - Department management
- **Users** - User accounts with roles (admin, manager, staff)
- **Categories** - Document categories
- **Documents** - Document storage with file metadata
- **Sessions** - Authentication sessions

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Tech Stack
- **Database**: PostgreSQL
- **ORM**: Raw SQL with `pg` client (lightweight)
- **Authentication**: Better-auth
- **Framework**: Next.js 16
