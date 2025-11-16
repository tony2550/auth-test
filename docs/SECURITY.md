# Security Documentation

## Overview

This document outlines the security measures, best practices, and considerations implemented in this authentication testing platform.

## Table of Contents

1. [Password Security](#password-security)
2. [Session Management](#session-management)
3. [CSRF Protection](#csrf-protection)
4. [XSS Prevention](#xss-prevention)
5. [SQL Injection Prevention](#sql-injection-prevention)
6. [Rate Limiting & Brute Force Protection](#rate-limiting--brute-force-protection)
7. [Secure Headers](#secure-headers)
8. [Environment Variables](#environment-variables)
9. [Database Security](#database-security)
10. [OAuth Security](#oauth-security)

---

## Password Security

### Hashing Algorithm
- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Library**: `bcryptjs`

```typescript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 10)

// Password verification
const isValid = await bcrypt.compare(password, hashedPassword)
```

### Password Requirements
- Minimum length: 6 characters (configurable)
- Passwords are never stored or transmitted in plain text
- Passwords are never logged or included in error messages

### Best Practices
✅ **DO**:
- Enforce minimum password length (6+ characters recommended)
- Use bcrypt or argon2 for password hashing
- Salt passwords automatically (bcrypt does this)
- Validate password strength on the client and server

❌ **DON'T**:
- Store passwords in plain text
- Log passwords
- Send passwords in URL parameters
- Use weak hashing algorithms (MD5, SHA1)

---

## Session Management

### Auth.js v5 Sessions
- **Strategy**: JWT (JSON Web Tokens)
- **Storage**: HTTP-only cookies
- **Expiration**: 30 days
- **Secret**: Environment variable `AUTH_SECRET`

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### better-auth Sessions
- **Strategy**: Cookie-based
- **Expiration**: 7 days
- **Update Age**: 1 day (session refreshes every day)
- **Cookie Prefix**: `better-auth`

### Lucia Sessions
- **Strategy**: Custom session tokens
- **Token Generation**: Base32-encoded 20-byte random values
- **Token Storage**: SHA-256 hash of token stored in database
- **Expiration**: 30 days with automatic extension
- **Extension**: Sessions extend if more than 15 days remain

```typescript
// Session token generation
const bytes = new Uint8Array(20)
crypto.getRandomValues(bytes)
const token = encodeBase32LowerCaseNoPadding(bytes)

// Token hashing before storage
const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
```

### Cookie Security
All sessions use secure cookie configurations:

```typescript
{
  httpOnly: true,           // Prevents JavaScript access
  secure: true,             // HTTPS only (production)
  sameSite: "lax",          // CSRF protection
  path: "/",
  expires: expiresAt
}
```

---

## CSRF Protection

### Auth.js
- Built-in CSRF protection using tokens
- CSRF tokens automatically validated on state-changing requests

### better-auth
- Built-in CSRF protection
- Double-submit cookie pattern

### Lucia (Custom)
- Implemented via `sameSite: "lax"` cookie attribute
- Additional CSRF tokens can be implemented for sensitive operations

### Recommendations
- Use `sameSite: "lax"` or `"strict"` for cookies
- Verify origin header for critical operations
- Implement CSRF tokens for state-changing operations

---

## XSS Prevention

### Input Validation
- All user inputs are validated using Zod schemas
- Email validation ensures proper format
- Password length requirements enforced

```typescript
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
```

### Output Encoding
- React automatically escapes JSX content
- User-generated content is sanitized before rendering
- `dangerouslySetInnerHTML` is avoided

### Content Security Policy (Recommended)
Add CSP headers in `next.config.ts`:

```typescript
headers: async () => [{
  source: "/(.*)",
  headers: [
    {
      key: "Content-Security-Policy",
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
    }
  ]
}]
```

---

## SQL Injection Prevention

### Prisma ORM
- All database queries use Prisma ORM
- Parameterized queries prevent SQL injection
- No raw SQL queries are used

```typescript
// Safe query with Prisma
const user = await prisma.user.findUnique({
  where: { email: validatedData.email }
})
```

### Best Practices
✅ **DO**:
- Use ORM for all database operations
- Validate and sanitize user inputs
- Use parameterized queries

❌ **DON'T**:
- Concatenate user input into SQL queries
- Use raw SQL without parameterization

---

## Rate Limiting & Brute Force Protection

### Failed Login Tracking
All authentication methods track failed login attempts:

```typescript
await prisma.failedLogin.create({
  data: {
    email,
    ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    userAgent: request.headers.get("user-agent") || undefined,
    reason: "Invalid password",
  },
})
```

### Audit Logging
Comprehensive audit logs for security events:

```typescript
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: "SIGN_IN",
    resource: "AUTH",
    details: { method: "credentials" },
    ipAddress,
    userAgent,
  },
})
```

### Recommended Implementation
Implement rate limiting using libraries like `@upstash/ratelimit`:

```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

// In route handler
const { success } = await ratelimit.limit(identifier)
if (!success) {
  return new Response("Too many requests", { status: 429 })
}
```

---

## Secure Headers

### Recommended Headers
Add these headers to your Next.js application:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
]
```

---

## Environment Variables

### Critical Variables
Never commit these to version control:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth Secrets
AUTH_SECRET="..." # Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="..."

# OAuth Credentials
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Best Practices
✅ **DO**:
- Use `.env.local` for local development
- Add `.env*` to `.gitignore`
- Use different secrets for development/production
- Rotate secrets regularly
- Use environment variable management (Vercel, AWS Secrets Manager)

❌ **DON'T**:
- Commit `.env` files
- Share secrets in code or documentation
- Use weak or predictable secrets
- Reuse secrets across environments

---

## Database Security

### Connection Security
- Use SSL/TLS for database connections
- Configure `sslmode=require` in connection string
- Use connection pooling (Prisma handles this)

```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### Access Control
- Use principle of least privilege
- Create separate database users for different environments
- Restrict database user permissions

### Data Encryption
- Encrypt sensitive data at rest
- Use database-level encryption (PostgreSQL Transparent Data Encryption)
- Encrypt backups

---

## OAuth Security

### Configuration
```typescript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
}
```

### Best Practices
✅ **DO**:
- Validate redirect URIs
- Use state parameter to prevent CSRF
- Verify OAuth tokens
- Store OAuth tokens securely
- Use HTTPS for redirect URIs

❌ **DON'T**:
- Allow open redirects
- Store OAuth secrets client-side
- Skip token verification

---

## Security Checklist

### Development
- [ ] Use HTTPS in production
- [ ] Enable secure cookies in production
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Validate all user inputs
- [ ] Sanitize outputs
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection
- [ ] Implement audit logging

### Production
- [ ] Rotate secrets regularly
- [ ] Monitor failed login attempts
- [ ] Set up error tracking (Sentry)
- [ ] Enable database backups
- [ ] Configure WAF (Web Application Firewall)
- [ ] Set up DDoS protection
- [ ] Implement IP whitelisting for admin routes
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Penetration testing

---

## Vulnerability Reporting

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

### Responsible Disclosure
1. Report vulnerability privately
2. Allow time for fix (90 days)
3. Coordinate public disclosure

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [Prisma Security](https://www.prisma.io/docs/guides/security)
- [Auth.js Security](https://authjs.dev/guides/basics/security)

---

## Last Updated
November 2025
