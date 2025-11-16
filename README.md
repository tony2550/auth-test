# 🔐 Auth Testing Platform

A comprehensive authentication testing and comparison platform built with Next.js 16, featuring three different authentication solutions: **Auth.js v5**, **better-auth**, and **Lucia Auth** (custom implementation).

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Authentication Solutions](#-authentication-solutions)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Demo](#-demo)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔒 Three Authentication Implementations
- **Auth.js v5** - Industry-standard auth with 80+ OAuth providers
- **better-auth** - Modern auth with built-in 2FA and email verification
- **Lucia Auth** - Custom session management with Oslo.js cryptography

### 🎯 Core Features
- ✅ Email/Password authentication
- ✅ OAuth (Google & GitHub)
- ✅ JWT & Database sessions
- ✅ Role-based access control (RBAC)
- ✅ Failed login tracking
- ✅ Audit logging
- ✅ CSRF protection
- ✅ Secure HTTP-only cookies
- ✅ Password hashing (bcrypt)
- ✅ TypeScript with full type safety
- ✅ Responsive UI with TailwindCSS

### 📊 Comparison Tools
- Side-by-side feature comparison
- Performance metrics
- Security analysis
- Implementation examples
- Best practices documentation

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database**: [PostgreSQL](https://www.postgresql.org) (Neon/Supabase/RDS)
- **ORM**: [Prisma](https://www.prisma.io)
- **Auth Libraries**:
  - [Auth.js v5](https://authjs.dev) (NextAuth beta)
  - [better-auth](https://better-auth.com)
  - [Oslo.js](https://oslojs.dev) (for Lucia implementation)
- **Styling**: [TailwindCSS](https://tailwindcss.com)
- **Validation**: [Zod](https://zod.dev)
- **Deployment**: [Vercel](https://vercel.com) / AWS EC2

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (or Neon/Supabase account)
- Git
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/auth-test.git
   cd auth-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your values:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   AUTH_SECRET="your-secret-here"
   # ... see Environment Variables section
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Authentication Solutions

### 1. Auth.js v5 (NextAuth)

**Routes:**
- `/auth-js/signin` - Sign in page
- `/auth-js/signup` - Sign up page
- `/auth-js/dashboard` - Protected dashboard

**Features:**
- Multiple OAuth providers (Google, GitHub)
- Credentials provider (email/password)
- JWT-based sessions
- Role-based access control
- Built-in CSRF protection

**Best for:** Enterprise applications, multiple OAuth providers

### 2. better-auth

**Routes:**
- `/better-auth/signin` - Sign in page
- `/better-auth/signup` - Sign up page
- `/better-auth/dashboard` - Protected dashboard

**Features:**
- Social authentication
- Two-factor authentication support
- Email verification
- Modern TypeScript-first API
- Cookie-based sessions

**Best for:** Modern SaaS applications, apps requiring 2FA

### 3. Lucia Auth (Custom)

**Routes:**
- `/lucia/signin` - Sign in page
- `/lucia/signup` - Sign up page
- `/lucia/dashboard` - Protected dashboard

**Features:**
- Custom session management
- Oslo.js cryptographic primitives
- SHA-256 hashed tokens
- Zero external auth dependencies
- Full control over implementation

**Best for:** Learning, custom requirements, minimal dependencies

---

## 📁 Project Structure

```
auth-test/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/
│   │   │   └── page.tsx       # Homepage with comparison
│   │   ├── auth-js/           # Auth.js demo pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── dashboard/
│   │   ├── better-auth/       # better-auth demo pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── dashboard/
│   │   ├── lucia/             # Lucia demo pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── dashboard/
│   │   └── api/               # API routes
│   │       ├── auth/          # Auth.js API
│   │       ├── better-auth/   # better-auth API
│   │       └── lucia/         # Lucia API
│   ├── components/            # React components
│   │   ├── auth/              # Auth-related components
│   │   └── ui/                # UI components
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth-js/          # Auth.js config
│   │   ├── better-auth/      # better-auth config
│   │   ├── lucia/            # Lucia implementation
│   │   ├── db/               # Database client
│   │   └── utils.ts          # Utility functions
│   └── middleware.ts          # Route protection middleware
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration files
├── docs/                      # Documentation
│   ├── SECURITY.md           # Security guidelines
│   ├── AUTH_COMPARISON.md    # Detailed comparison
│   ├── DATABASE.md           # Database documentation
│   └── DEPLOYMENT.md         # Deployment guide
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[SECURITY.md](docs/SECURITY.md)** - Security best practices, password hashing, CSRF protection, and more
- **[AUTH_COMPARISON.md](docs/AUTH_COMPARISON.md)** - Detailed comparison of all three auth solutions
- **[DATABASE.md](docs/DATABASE.md)** - Database schema, migrations, and provider setup
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guides for Vercel and AWS EC2

---

## 🎨 Demo

### Homepage
The landing page showcases all three authentication solutions with:
- Feature comparison table
- Security features overview
- Direct links to each demo
- Tech stack information

### Live Demos
Each authentication solution has complete sign-in, sign-up, and dashboard pages where you can:
- Test authentication flows
- View session information
- Compare implementation details
- Explore security features

---

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Auth.js v5
AUTH_SECRET="your-auth-secret"  # Generate: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# better-auth
BETTER_AUTH_SECRET="your-better-auth-secret"  # Generate: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"

# OAuth - Google (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - GitHub (Optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate Secrets
```bash
openssl rand -base64 32
```

### OAuth Setup
- **Google**: [Google Cloud Console](https://console.cloud.google.com)
- **GitHub**: [GitHub Developer Settings](https://github.com/settings/developers)

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#oauth-configuration) for detailed OAuth setup instructions.

---

## 💾 Database Setup

### Option 1: Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy the connection string
4. Add to `.env.local` as `DATABASE_URL`
5. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Option 2: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection strings from Settings → Database
4. Use **Transaction pooler** for `DATABASE_URL`
5. Use **Direct connection** for `DIRECT_URL`
6. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Option 3: Local PostgreSQL

1. Install PostgreSQL
2. Create database:
   ```bash
   createdb auth_test
   ```
3. Update `.env.local` with local connection string
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

See [DATABASE.md](docs/DATABASE.md) for more details.

---

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev    # Create and apply migration
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio    # Open database GUI

# Type Checking
npm run type-check   # Run TypeScript compiler
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#vercel-deployment) for detailed instructions.

### AWS EC2

1. Launch EC2 instance
2. Install Node.js, PM2, Nginx
3. Clone repository
4. Configure environment
5. Setup SSL with Let's Encrypt

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#aws-ec2-deployment) for detailed instructions.

---

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **CSRF Protection**: Built-in tokens and SameSite cookies
- ✅ **XSS Prevention**: React's automatic escaping + Zod validation
- ✅ **SQL Injection**: Prisma ORM with parameterized queries
- ✅ **Secure Cookies**: HttpOnly, Secure, SameSite attributes
- ✅ **Session Security**: Token-based with SHA-256 hashing
- ✅ **Failed Login Tracking**: Audit logs for security monitoring
- ✅ **Input Validation**: Zod schemas for all user inputs

See [SECURITY.md](docs/SECURITY.md) for comprehensive security documentation.

---

## 📊 Performance

- **Bundle Size**: Optimized with Next.js code splitting
- **Database**: Connection pooling with Prisma
- **Caching**: Next.js automatic caching
- **Edge Runtime**: Compatible with Vercel Edge Functions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🐛 Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Verify connection
npx prisma db pull

# Check environment variables
cat .env.local
```

**Build failures:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**OAuth issues:**
- Verify callback URLs match exactly
- Check client ID and secret
- Ensure OAuth app is enabled

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#troubleshooting) for more solutions.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Auth.js](https://authjs.dev) - Authentication library
- [better-auth](https://better-auth.com) - Modern auth solution
- [Oslo.js](https://oslojs.dev) - Security primitives
- [Prisma](https://www.prisma.io) - Database ORM
- [Vercel](https://vercel.com) - Hosting platform

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🗺 Roadmap

- [ ] Add rate limiting implementation
- [ ] Implement 2FA for Auth.js
- [ ] Add email verification flows
- [ ] Create admin dashboard
- [ ] Add more OAuth providers
- [ ] Implement passwordless authentication
- [ ] Add biometric authentication
- [ ] Create comparison benchmarks
- [ ] Add i18n support
- [ ] Create video tutorials

---

**Built with ❤️ using Next.js and TypeScript**
