# Database Documentation

## Overview

This project uses **PostgreSQL** as the database with **Prisma ORM** for type-safe database access. The schema is designed to support multiple authentication systems simultaneously.

---

## Table of Contents

1. [Database Provider](#database-provider)
2. [Schema Overview](#schema-overview)
3. [Auth.js Tables](#authjs-tables)
4. [better-auth Tables](#better-auth-tables)
5. [Lucia Tables](#lucia-tables)
6. [Shared Tables](#shared-tables)
7. [Migrations](#migrations)
8. [Database Providers](#database-providers)
9. [Schema Changes Log](#schema-changes-log)

---

## Database Provider

### Recommended: Neon PostgreSQL

**Why Neon?**
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ Branching for development
- ✅ Free tier available
- ✅ Excellent Next.js integration
- ✅ Connection pooling built-in

### Alternative Providers
- **Supabase**: PostgreSQL + Auth + Storage
- **PlanetScale**: MySQL (requires schema adjustments)
- **Railway**: PostgreSQL hosting
- **Vercel Postgres**: PostgreSQL on Vercel
- **AWS RDS**: Production-grade PostgreSQL
- **Self-hosted**: Docker PostgreSQL

---

## Connection Configuration

### Environment Variables

```bash
# Neon PostgreSQL
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

### Prisma Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Why two URLs?**
- `DATABASE_URL`: Used for connection pooling (query engine)
- `DIRECT_URL`: Used for migrations (direct connection)

---

## Schema Overview

The database schema supports three independent authentication systems:

```
┌─────────────────────────────────────────────────────┐
│                   PostgreSQL Database                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Auth.js    │  │ better-auth  │  │   Lucia   │ │
│  │   Tables     │  │    Tables    │  │  Tables   │ │
│  ├──────────────┤  ├──────────────┤  ├───────────┤ │
│  │ users        │  │ better_auth_ │  │ lucia_    │ │
│  │ accounts     │  │ users        │  │ users     │ │
│  │ sessions     │  │ better_auth_ │  │ lucia_    │ │
│  │ verification_│  │ sessions     │  │ sessions  │ │
│  │ tokens       │  │ better_auth_ │  │           │ │
│  │              │  │ accounts     │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │          Shared Audit & Security Tables       │  │
│  ├──────────────────────────────────────────────┤  │
│  │ audit_logs                                    │  │
│  │ failed_logins                                 │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Auth.js Tables

### `users`
Primary user table for Auth.js authentication.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials provider
  role          UserRole  @default(USER)

  accounts      Account[]
  sessions      Session[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `email`: User's email (unique constraint)
- `emailVerified`: Email verification timestamp
- `password`: Hashed password (bcrypt, nullable for OAuth users)
- `role`: User role (USER, ADMIN, MODERATOR)

### `accounts`
OAuth provider connections for users.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

**Purpose:** Links user accounts with OAuth providers (Google, GitHub, etc.)

### `sessions`
Active user sessions for database session strategy.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("sessions")
}
```

### `verification_tokens`
Email verification and magic link tokens.

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

---

## better-auth Tables

### `better_auth_users`

```prisma
model BetterAuthUser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  password  String?
  role      UserRole @default(USER)

  // 2FA Support
  twoFactorEnabled Boolean  @default(false)
  twoFactorSecret  String?

  // Email verification
  emailVerified    Boolean  @default(false)
  verificationToken String?

  betterAuthSessions BetterAuthSession[]
  betterAuthAccounts BetterAuthAccount[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("better_auth_users")
}
```

**Key Differences from Auth.js:**
- `emailVerified` is Boolean instead of DateTime
- `twoFactorEnabled` and `twoFactorSecret` for 2FA
- `verificationToken` for email verification

### `better_auth_sessions`

```prisma
model BetterAuthSession {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?

  user BetterAuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@map("better_auth_sessions")
}
```

**Features:**
- Tracks `ipAddress` and `userAgent` for security
- Cookie-based session token

### `better_auth_accounts`

```prisma
model BetterAuthAccount {
  id                String @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  expiresAt         DateTime?

  user BetterAuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("better_auth_accounts")
}
```

---

## Lucia Tables

### `lucia_users`

```prisma
model LuciaUser {
  id       String   @id @default(cuid())
  email    String   @unique
  name     String?
  password String
  role     UserRole @default(USER)

  luciaSessions LuciaSession[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("lucia_users")
}
```

**Minimalist Design:**
- Required `password` field (no OAuth in this implementation)
- Simple structure for custom session management

### `lucia_sessions`

```prisma
model LuciaSession {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime

  user LuciaUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([userId])
  @@map("lucia_sessions")
}
```

**Key Features:**
- Session ID is SHA-256 hash of the token
- Actual token is never stored in database
- Simple, minimal schema

---

## Shared Tables

### `audit_logs`
Track all security-relevant events across all auth systems.

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  resource  String?
  details   Json?
  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

**Usage Examples:**
- `{ action: "SIGN_IN", resource: "AUTH_JS", userId: "..." }`
- `{ action: "PASSWORD_CHANGE", resource: "USER", userId: "..." }`
- `{ action: "ROLE_CHANGE", details: { from: "USER", to: "ADMIN" } }`

### `failed_logins`
Track failed login attempts for security monitoring.

```prisma
model FailedLogin {
  id        String   @id @default(cuid())
  email     String
  ipAddress String
  userAgent String?
  reason    String?

  createdAt DateTime @default(now())

  @@index([email])
  @@index([ipAddress])
  @@index([createdAt])
  @@map("failed_logins")
}
```

**Purpose:**
- Detect brute force attacks
- Monitor suspicious activity
- Implement rate limiting

---

## Migrations

### Initial Migration

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migration to production
npx prisma migrate deploy
```

### Migration Files Location
```
prisma/
├── schema.prisma
└── migrations/
    ├── 20250116_init/
    │   └── migration.sql
    └── migration_lock.toml
```

### Important Notes
- Always create migrations in development first
- Test migrations on staging before production
- Backup database before applying migrations
- Use `prisma migrate deploy` in production (never `dev`)

---

## Database Providers

### Neon PostgreSQL Setup

1. **Create Neon Project**
   ```bash
   # Sign up at https://neon.tech
   # Create new project
   # Copy connection string
   ```

2. **Configure Environment**
   ```bash
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
   DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
   ```

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Supabase Setup

1. **Create Supabase Project**
   ```bash
   # Sign up at https://supabase.com
   # Create new project
   # Get connection string from Settings > Database
   ```

2. **Connection String Format**
   ```bash
   # Transaction pooler (for Prisma)
   DATABASE_URL="postgresql://postgres.xxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

   # Direct connection (for migrations)
   DIRECT_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
   ```

### AWS RDS Setup

1. **Create RDS Instance**
   - Engine: PostgreSQL 15+
   - Instance class: db.t3.micro (free tier) or higher
   - Storage: 20GB SSD
   - Enable automated backups

2. **Security Group**
   - Allow inbound PostgreSQL (5432) from your IP
   - For production: Use VPC and private subnets

3. **Connection String**
   ```bash
   DATABASE_URL="postgresql://username:password@instance.region.rds.amazonaws.com:5432/dbname"
   ```

---

## Schema Changes Log

### Version 1.0.0 (Initial) - November 2025

**Auth.js Tables:**
- Created `users`, `accounts`, `sessions`, `verification_tokens`
- Added role-based access control (UserRole enum)

**better-auth Tables:**
- Created `better_auth_users`, `better_auth_sessions`, `better_auth_accounts`
- Added 2FA support fields
- Added email verification fields

**Lucia Tables:**
- Created `lucia_users`, `lucia_sessions`
- Minimal schema for custom session management

**Shared Tables:**
- Created `audit_logs` for security event tracking
- Created `failed_logins` for brute force detection

---

## Database Maintenance

### Backup Strategy

**Automated Backups (Recommended):**
- Neon: Automatic backups included
- Supabase: Daily backups on paid plans
- AWS RDS: Configure automated backups

**Manual Backups:**
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

### Performance Optimization

**Indexes:**
```prisma
// Already included in schema
@@index([userId])
@@index([email])
@@index([createdAt])
```

**Connection Pooling:**
- Use `DATABASE_URL` with connection pooler
- Neon and Supabase provide this automatically
- For self-hosted: Use PgBouncer

**Query Optimization:**
```typescript
// Use select to limit fields
const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true, email: true, role: true }
})

// Use include for relations
const user = await prisma.user.findUnique({
  where: { email },
  include: { sessions: true }
})
```

### Monitoring

**Query Monitoring:**
```typescript
// Enable query logging in development
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

**Metrics to Track:**
- Query execution time
- Number of active connections
- Database size growth
- Failed login attempts
- Session count

---

## Switching Database Providers

### From Neon to Supabase

1. Export data from Neon
   ```bash
   pg_dump $NEON_DATABASE_URL > neon_backup.sql
   ```

2. Create Supabase project and get connection string

3. Update `.env`
   ```bash
   DATABASE_URL="postgresql://postgres.xxx:...@pooler.supabase.com:6543/..."
   DIRECT_URL="postgresql://postgres:...@db.xxx.supabase.co:5432/..."
   ```

4. Import data to Supabase
   ```bash
   psql $SUPABASE_DIRECT_URL < neon_backup.sql
   ```

5. Test application thoroughly

### From PostgreSQL to MySQL (PlanetScale)

⚠️ **Not Recommended** - Requires schema changes:
- Remove `@@map` directives
- Change `@default(cuid())` to `@default(uuid())`
- Adjust datetime fields
- Test all queries

---

## Troubleshooting

### Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Migration Conflicts

```bash
# Mark migration as applied (if manually applied)
npx prisma migrate resolve --applied "migration_name"

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back "migration_name"
```

### Schema Drift

```bash
# Check for differences
npx prisma migrate diff

# Generate migration from current database
npx prisma db pull
npx prisma migrate dev --name sync_schema
```

---

## Best Practices

### Development
✅ **DO:**
- Use `prisma migrate dev` for local development
- Run `prisma generate` after schema changes
- Use `prisma studio` to inspect data
- Keep migrations small and focused

❌ **DON'T:**
- Edit migration files manually
- Skip migrations in development
- Use production database for testing

### Production
✅ **DO:**
- Use `prisma migrate deploy` in CI/CD
- Test migrations on staging first
- Backup before migrations
- Monitor query performance
- Use connection pooling

❌ **DON'T:**
- Run `prisma migrate dev` in production
- Skip backups
- Expose database credentials
- Use direct connections (use pooler)

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

---

## Last Updated
November 2025
