# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
# Start development server with hot reload (using Node.js --watch flag)
npm run dev

# Start production server
npm run start
```

### Code Quality
```bash
# Run ESLint to check for code issues
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

### Database Operations
```bash
# Generate new database migration based on schema changes
npm run db:generate

# Run pending migrations against the database
npm run db:migrate

# Open Drizzle Studio for database exploration and management
npm run db:studio
```

## Project Architecture

### Technology Stack
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with migrations
- **Validation**: Zod schemas
- **Authentication**: JWT tokens with cookie-parser
- **Logging**: Winston with file and console transports
- **Security**: Helmet for security headers, CORS enabled

### Directory Structure
The project follows a modular architecture with path mapping imports:
- `#config/*` → Configuration files (database, logger)
- `#models/*` → Drizzle ORM database models
- `#controllers/*` → Express route handlers
- `#middleware/*` → Custom middleware functions
- `#routes/*` → Express route definitions
- `#services/*` → Business logic services
- `#utils/*` → Utility functions (JWT, cookies, formatting)
- `#validation/*` → Zod validation schemas

### Key Components

#### Database Layer
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Automatic migration generation and execution via `drizzle-kit`
- **Models**: Currently has `users` table with authentication fields

#### Authentication System
- **JWT Implementation**: Custom JWT utility with sign/verify functions and 1-day expiration
- **User Model**: Supports name, email, password (bcrypt hashed), role (user/admin), timestamps
- **Complete Auth Flow**: Routes → Controllers → Services architecture implemented
- **Routes**: POST /api/auth/sign-up, /sign-in, /sign-out with proper error handling
- **Protected Routes**: GET /api/auth/profile, /admin with authentication middleware
- **Validation**: Zod schemas for signup/signin with comprehensive validation
- **Password Security**: bcrypt hashing with salt rounds of 10
- **Session Management**: HTTP-only cookies with secure settings

#### Logging & Monitoring
- **Winston Logger**: Structured JSON logging with file rotation
- **Log Levels**: Configurable via LOG_LEVEL environment variable
- **Health Check**: `/health` endpoint with uptime and timestamp
- **Request Logging**: Morgan middleware integrated with Winston

#### Security Features
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing enabled
- **Cookie Parser**: Secure cookie handling
- **Environment Variables**: Sensitive data in .env file

## Database Schema Management

The project uses Drizzle ORM with PostgreSQL. Database schema is defined in `src/models/` and migrations are auto-generated.

### Working with Database Changes
1. Modify schema files in `src/models/`
2. Run `npm run db:generate` to create migration files
3. Run `npm run db:migrate` to apply changes to database
4. Use `npm run db:studio` to visually inspect database

### Current Schema
- **users table**: id (serial), name (varchar), email (unique varchar), password (varchar), role (varchar with default 'user'), created_at/updated_at (timestamps)

## Code Style & Standards

### ESLint Configuration
- **Indentation**: 2 spaces with proper switch case handling
- **Quotes**: Single quotes enforced
- **Semicolons**: Required
- **Variables**: Prefer const, no var allowed
- **Functions**: Arrow functions preferred
- **Unused variables**: Error (except with underscore prefix)

### Import Path Conventions
Use the configured path mappings (e.g., `#config/logger.js`) instead of relative paths for cleaner imports.

## Environment Configuration

Key environment variables (see .env):
- `PORT`: Server port (default: 8000)
- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Winston log level (default: info)
- `JWT_SECRET`: JWT signing secret
- `DATABASE_URL`: PostgreSQL connection string

## Development Notes

### Current Implementation Status
- ✅ Complete Express server setup with middleware
- ✅ Full authentication system: signup, signin, signout with JWT
- ✅ Database schema and connection with Drizzle ORM
- ✅ Password hashing with bcrypt
- ✅ Authentication middleware for protected routes
- ✅ Role-based access control (user/admin)
- ✅ Comprehensive logging and security middleware
- ❌ No test suite currently implemented
- ❌ No password reset functionality

### Development Workflow
1. Start with `npm run dev` for hot-reloading development
2. Make schema changes in models, then generate/run migrations
3. Use path imports for cleaner code organization
4. Follow ESLint rules and format with Prettier
5. Check logs in `logs/` directory for debugging