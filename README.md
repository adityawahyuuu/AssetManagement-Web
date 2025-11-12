# AssetManagement-Web

A Next.js web application for managing dorm assets. This client application consumes the AssetManagement-API backend.

---

## Initial Setup & Configuration

### Installation Instructions

**Prerequisites:**
- Node.js 18+ and npm 9+
- AssetManagement-API backend running and accessible
- Git

**Step 1: Clone and Install**
```bash
git clone https://github.com/your-org/AssetManagement-Web.git
cd AssetManagement-Web
npm install
```

**Step 2: Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or next available port).

**Step 3: Build for Production**
```bash
npm run build
npm start
```

### Environment Variable Setup (.env.local Creation)

**Step 1: Create `.env.local` file**
```bash
cp .env.example .env.local
```

**Step 2: Edit `.env.local` with required configuration:**

```env
# ==================== REQUIRED ====================

# Backend API Base URL
# Development: http://localhost:5080 (HTTP)
# Development HTTPS: https://localhost:5080 (requires self-signed cert handling)
# Production: https://your-api-domain.com (HTTPS REQUIRED)
NEXT_PUBLIC_API_URL=http://localhost:5080

# ==================== OPTIONAL ====================

# Token expiration time in minutes (default: 10)
NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES=10

# Default items per page (default: 10, max: 100)
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10

# Enable debug mode for development (default: false)
NEXT_PUBLIC_DEBUG_MODE=true

# For local HTTPS with self-signed certificates (DEVELOPMENT ONLY)
# NODE_TLS_REJECT_UNAUTHORIZED=0
```

**Important Notes:**
- All `NEXT_PUBLIC_*` variables are exposed to the browser (safe for URLs only)
- Never put secrets or sensitive credentials in `NEXT_PUBLIC_*` variables
- The frontend uses Next.js API routes (`/api/*`) as a proxy to the backend API
- In production, `NEXT_PUBLIC_API_URL` must use HTTPS
- For local HTTPS development, see the self-signed certificate solutions below

**HTTP vs HTTPS Protocol:**

| Environment | Protocol | URL Example | When to Use |
|-------------|----------|-------------|------------|
| Local Dev | HTTP | `http://localhost:5080` | Standard local development (simple) |
| Local Dev | HTTPS | `https://localhost:5080` | Testing HTTPS features locally |
| Production | HTTPS | `https://api.yourdomain.com` | **Required for production** |

**Self-Signed Certificate Issues (Local HTTPS):**

If using HTTPS locally with self-signed certificates, you'll get SSL errors. Use one of these solutions:

1. **Quick Fix (Development Only):**
   ```bash
   NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
   ```
   ⚠️ WARNING: Never use this in production!

2. **Recommended (Scoped to Development):**
   - Add to `.env.local`:
     ```bash
     NODE_TLS_REJECT_UNAUTHORIZED=0
     NODE_ENV=development
     ```

3. **Proper Solution (Most Secure):**
   - Generate trusted certificate using mkcert:
     ```bash
     brew install mkcert  # macOS
     choco install mkcert  # Windows
     apt install mkcert   # Linux
     mkcert -install
     mkcert localhost 127.0.0.1 ::1
     ```
   - Configure your backend API to use these certificates

### Technology Stack Information

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Data Fetching:** SWR
- **Charts:** Recharts
- **Icons:** Lucide React
- **Testing:** Jest + React Testing Library
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel
- **Database:** Managed by backend API

---

## Development & Testing

### Understand Overall Testing Approach

The project uses a **testing pyramid** approach:

```
         /\
        /E2E\        ← End-to-end tests (Playwright) - Main user workflows
       /------\
      / Integ  \     ← Integration tests - Component & API interactions
     /----------\
    /   Unit     \   ← Unit tests - Utilities, helpers, validation (97+ tests)
   /--------------\
```

**Test Pyramid Breakdown:**

1. **Unit Tests (Bottom - Most):**
   - Test utilities in `lib/` directory
   - Test validation schemas
   - Test helper functions
   - **Tools:** Jest
   - **Target:** 100% coverage for critical utilities
   - **Examples:** `lib/auth.test.ts`, `lib/api.test.ts`

2. **Integration Tests (Middle):**
   - Test components with mocked APIs
   - Test API routes
   - Test data flows
   - **Tools:** React Testing Library + Jest
   - **Target:** 80%+ coverage
   - **Examples:** Form components, page components

3. **E2E Tests (Top - Fewer):**
   - Test complete user workflows
   - Authentication flow, CRUD operations
   - **Tools:** Playwright (planned)
   - **Focus:** Critical business workflows only

**Running Tests:**

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# CI mode (used in GitHub Actions)
npm run test:ci
```

**Coverage Requirements:**
- Global: 80% minimum
- lib/ directory: 90% minimum
- Critical utilities (auth.ts, api.ts): 100%

**Test File Structure:**
```
__tests__/
├── lib/
│   ├── auth.test.ts          # Authentication utilities (27 tests)
│   └── api.test.ts           # API client (32 tests)
├── components/               # Component tests
│   ├── ui/
│   │   ├── button.test.tsx   # Button component (18 tests)
│   │   └── card.test.tsx     # Card component (20 tests)
│   └── forms/
│       └── room-form.test.tsx # Form tests
```

**Writing Tests - Example Pattern:**

```typescript
// Unit Test Example (Jest)
describe('getAuthToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return token from localStorage', () => {
    localStorage.setItem('authToken', 'test-token-123')
    expect(getAuthToken()).toBe('test-token-123')
  })

  it('should return null when token does not exist', () => {
    expect(getAuthToken()).toBeNull()
  })
})

// Component Test Example (React Testing Library)
describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should call onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**Before Committing Code:**
```bash
# 1. Run linter
npm run lint

# 2. Run type check
npx tsc --noEmit

# 3. Run all tests
npm test

# 4. Check coverage
npm run test:coverage

# 5. Build application
npm run build
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

The repository uses **GitHub Actions** for automated continuous integration and deployment.

**How It Works:**

1. **You push code** → GitHub receives push
2. **CI pipeline triggers** → Automatically runs checks
3. **All checks must pass** → Before merging to main
4. **On merge to main** → Deployment pipeline triggers
5. **Deploy to Vercel** → Application goes live

### CI Pipeline Workflow (`ci.yml`)

**Triggers:** Every push to any branch, every pull request

**Jobs (run in parallel for speed):**

```
install (2-3 min)
  ├─> lint (1-2 min)          → Check code style with ESLint
  ├─> test (3-5 min)          → Run 97+ tests with Jest
  ├─> typecheck (2-3 min)     → Check TypeScript types
  ├─> security (2-3 min)      → Scan for vulnerabilities
  └─> build (5-10 min)        → Build for production
       └─> performance (2-3 min) → Check bundle size
            └─> ci-success      → Final status check
```

**What Gets Checked:**
- ✅ Code style (ESLint)
- ✅ Type safety (TypeScript)
- ✅ All tests pass
- ✅ Test coverage ≥ 80%
- ✅ Security vulnerabilities
- ✅ Build succeeds
- ✅ Bundle size within limits

**Total Runtime:** ~10-15 minutes

**Required Status Checks to Merge:**
- CI Success ✅
- Lint Code ✅
- Run Tests ✅
- Type Check ✅

### Deployment Pipeline Workflow (`deploy.yml`)

**Triggers:** Push to `main` branch, manual dispatch

**Jobs (run sequentially):**

```
pre-deploy (5-10 min)
  └─> deploy (5-10 min)      → Deploy to Vercel
       └─> verify (5-10 min) → Health checks & smoke tests
            ├─> notify       → Success notification
            └─> rollback     → If verification fails
```

**What Happens:**
1. **Pre-deployment:** Validation, tests, build
2. **Deploy:** Push to Vercel
3. **Verification:** Health checks, API tests
4. **Rollback:** Automatic rollback if verification fails

**Total Runtime:** ~15-25 minutes from push to live

### Additional Workflows

**Security Scanning (`security.yml`):**
- Runs daily at 2 AM UTC
- Checks dependency vulnerabilities
- CodeQL analysis
- Secret detection
- License compliance

**PR Automation (`pr-automation.yml`):**
- Auto-labels PRs (size, type, component)
- Validates PR title format
- Comments with test results
- Assigns reviewers

---

## Deployment

### Step-by-Step: Integrate GitHub with Vercel

#### Step 1: Create Vercel Account & Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select repository and click "Import"

#### Step 2: Configure Vercel Project

In Vercel Dashboard, set these build settings:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm ci
```

#### Step 3: Add Environment Variables in Vercel

Go to **Settings → Environment Variables**

**For Production:**
```
NEXT_PUBLIC_API_URL = https://your-production-api.com
NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES = 15
NEXT_PUBLIC_DEFAULT_PAGE_SIZE = 20
NODE_TLS_REJECT_UNAUTHORIZED = 1
```

**For Preview/Development:**
```
NEXT_PUBLIC_API_URL = https://your-staging-api.com
NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES = 10
NEXT_PUBLIC_DEFAULT_PAGE_SIZE = 10
```

#### Step 4: Get Vercel Credentials for GitHub Actions

**Get Vercel Token:**
1. Go to [Vercel Tokens](https://vercel.com/account/tokens)
2. Create new token
3. Copy the token

**Get Org ID and Project ID:**
```bash
# In your local project directory
vercel link
# Follow prompts
cat .vercel/project.json
# You'll see:
# {
#   "orgId": "team_xxxxx",
#   "projectId": "prj_xxxxx"
# }
```

#### Step 5: Add GitHub Secrets

Go to **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

```
VERCEL_TOKEN = <your-token-from-step-4>
VERCEL_ORG_ID = team_xxxxx
VERCEL_PROJECT_ID = prj_xxxxx
PRODUCTION_URL = https://your-app.vercel.app
NEXT_PUBLIC_API_URL = https://your-production-api.com
```

#### Step 6: GitHub Actions Workflows Setup

1. Create `.github/workflows/` directory if it doesn't exist
2. Create these workflow files:

**`.github/workflows/ci.yml`** - Runs on every PR and push

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main, development]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci

  lint:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:ci

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  ci-success:
    needs: [lint, test, build]
    runs-on: ubuntu-latest
    if: success()
    steps:
      - run: echo "✅ All CI checks passed"
```

**`.github/workflows/deploy.yml`** - Runs on push to main

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  pre-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build

  deploy:
    needs: pre-deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true

  verify:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - run: |
          sleep 30
          curl -f ${{ secrets.PRODUCTION_URL }} || exit 1
```

#### Step 7: Configure Branch Protection Rules (Recommended)

1. Go to **GitHub Repository → Settings → Branches**
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select required checks:
   - Lint Code
   - Run Tests
   - Type Check
   - Build

#### Step 8: Complete Development Workflow

**For Every Feature:**

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop and test locally:**
   ```bash
   npm run dev
   npm test
   npm run lint
   ```

3. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request on GitHub:**
   - Describe your changes
   - Reference any issues
   - Wait for CI pipeline to complete

5. **Get code review approval:**
   - Reviewer checks CI passed
   - Reviewer approves changes

6. **Merge to main:**
   - All CI checks must pass
   - Deployment pipeline triggers automatically
   - Application deploys to Vercel in ~15-25 minutes

**Monitoring Deployment:**

- Watch GitHub Actions tab for workflow progress
- Check Vercel Deployments tab
- Verify health checks pass
- Monitor for any errors in deployment logs

#### Step 9: Troubleshooting

**Tests fail in CI but pass locally:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run CI mode tests
npm run test:ci

# Match Node version
node --version  # Should match workflow (18.x)
```

**Build fails in Vercel:**
- Check environment variables in Vercel dashboard
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check `NEXT_PUBLIC_API_URL` uses HTTPS in production
- View detailed logs in Vercel dashboard

**Health checks fail (triggers rollback):**
- Verify backend API is accessible
- Check CORS settings on backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Test API endpoint manually:
  ```bash
  curl https://your-production-url/api/health
  ```

**Deployment quota exceeded:**
- Upgrade Vercel plan, or
- Optimize build time:
  - Remove unused dependencies
  - Use dynamic imports for large components
  - Optimize images before committing

#### Step 10: Post-Deployment

After successful deployment:

1. ✅ Test application in production
2. ✅ Verify all features work
3. ✅ Check browser console for errors
4. ✅ Test authentication flow
5. ✅ Test API endpoints
6. ✅ Monitor error logs
7. ✅ Notify team of deployment

---

## Available Scripts

```bash
npm run dev           # Start development server (port 3001)
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Run ESLint
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # CI mode (single run with coverage)
```

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes (proxy to backend)
│   └── (pages)         # Page components
├── components/         # React components
│   ├── dashboard/      # Dashboard components
│   ├── layouts/        # Layout components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and helpers
│   ├── api.ts          # API client
│   ├── auth.ts         # Authentication helpers
│   └── constants.ts    # Configuration constants
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── styles/             # Global styles
├── public/             # Static assets
├── __tests__/          # Test files
└── .github/workflows/  # GitHub Actions workflows
```

## Features

- User authentication (register/login/logout)
- Email verification with OTP
- Password reset flow
- Dashboard with analytics
- Room management (CRUD)
- Asset management (CRUD)
- Pagination and filtering
- Responsive design
- Dark mode support

## Troubleshooting

### Build Errors

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues

1. Check `NEXT_PUBLIC_API_URL` in `.env.local`:
   ```bash
   cat .env.local | grep NEXT_PUBLIC_API_URL
   ```

2. Verify backend API is running:
   ```bash
   curl http://localhost:5080/api/health
   ```

3. Test Next.js proxy:
   ```bash
   curl http://localhost:3001/api/rooms
   ```

### Environment Variable Not Updating

Restart the development server:
```bash
# Stop: Ctrl+C
npm run dev
```

### Authentication Errors

- Check token in localStorage: `localStorage.getItem('authToken')`
- Check token expiration: `localStorage.getItem('authTokenExpiration')`
- Ensure backend allows credentials in CORS
- Verify token hasn't expired

---


## Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured in Vercel
- [ ] Backend API accessible from deployment environment
- [ ] CORS configured on backend for frontend domain
- [ ] SSL/TLS certificates configured (HTTPS)
- [ ] Token expiration aligned between frontend and backend
- [ ] Error monitoring/logging set up
- [ ] Health check endpoint working

## Support & Resources

- **Next.js:** https://nextjs.org/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Jest:** https://jestjs.io/docs/getting-started
- **React Testing Library:** https://testing-library.com/react
- **GitHub Actions:** https://docs.github.com/en/actions
- **Vercel:** https://vercel.com/docs
