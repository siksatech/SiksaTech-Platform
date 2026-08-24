# SiksaTech Platform

A Turborepo-based monorepo powering [siksatech.in](https://siksatech.in) and [team.siksatech.in](https://team.siksatech.in).

## Architecture

```
siksatech/
├── apps/
│   ├── web/                  ← siksatech.in
│   │   ├── public website
│   │   ├── student dashboard
│   │   ├── parent dashboard
│   │   ├── institution dashboard
│   │   └── teacher dashboard
│   │
│   └── team/                 ← team.siksatech.in
│       ├── team login
│       ├── admin dashboard
│       ├── students
│       ├── institutions
│       ├── curriculum
│       ├── operations
│       └── analytics
│
├── packages/
│   ├── ui/                  ← shared components
│   ├── auth/                ← shared authentication logic
│   ├── database/            ← Supabase types/client
│   └── config/              ← shared configuration
│
├── package.json
├── turbo.json
└── README.md
```

## Apps

### web (`apps/web`)
- **Domain:** `siksatech.in`
- **Port:** 3000
- **Purpose:** Public-facing platform for students, parents, schools, and colleges.
- **Routes:** Home, Learn, Build, Store, Institutions, Verify, Enquiry, Auth, Student Dashboard.

### team (`apps/team`)
- **Domain:** `team.siksatech.in`
- **Port:** 3001
- **Purpose:** Internal admin portal for team operations.
- **Routes:** Team Portal, Curriculum, Inventory, Reviews, Admin Dashboard.

## Packages

### `@siksatech/ui`
Shared React components used across both apps.
- `Navbar`
- `Footer`
- `SiksaTechLogo`

### `@siksatech/auth`
Shared authentication utilities.
- Supabase client initialization
- Login / Register / Logout helpers
- Session management (`getCurrentUser`)

### `@siksatech/database`
Database layer and TypeScript types.
- Supabase CRUD operations (`db` object)
- Domain interfaces (`Banner`, `FAQ`, `Course`, `Project`, `Lead`, etc.)
- Admin role definitions

### `@siksatech/config`
Shared configuration exports (Next.js config, etc.).

## Implementation Plan

### Phase 1: Monorepo Foundation ✅
- [x] Initialize Turborepo with npm workspaces
- [x] Create `apps/web` and `apps/team` directories
- [x] Create `packages/ui`, `packages/auth`, `packages/database`, `packages/config`
- [x] Set up shared `tsconfig.base.json` with path aliases
- [x] Move public site pages to `apps/web`
- [x] Move team portal pages to `apps/team`
- [x] Extract shared components to `packages/ui`
- [x] Extract database layer to `packages/database`
- [x] Remove all dummy/seed/mock data from public site
- [x] Remove admin portal exposure from public site
- [x] Update README with architecture docs

### Phase 2: Environment & Deployment
- [ ] Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel/Netlify for both apps
- [ ] Set up `siksatech.in` domain pointing to `apps/web`
- [ ] Set up `team.siksatech.in` domain pointing to `apps/team`
- [ ] Enable branch protection on GitHub for `master` and `admin` (if needed)

### Phase 3: CI/CD
- [ ] Add GitHub Actions / Vercel integration
- [ ] Run `turbo run build` on PRs
- [ ] Run `turbo run lint` and `turbo run typecheck` on PRs

### Phase 4: Feature Expansion
- [ ] Add parent dashboard routes in `apps/web`
- [ ] Add teacher dashboard routes in `apps/web`
- [ ] Expand `packages/auth` with role-based access control (RBAC)
- [ ] Add unit tests for `packages/database` and `packages/auth`

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 10

### Install Dependencies
```bash
npm install
```

### Development
```bash
# Run both apps simultaneously
npm run dev

# Or run individually
npm run dev -- --filter=web
npm run dev -- --filter=team
```

- Web app: http://localhost:3000
- Team app: http://localhost:3001

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Typecheck
```bash
npm run typecheck
```

## Environment Variables

Create `.env.local` in the repo root or inside each app:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** Supabase
- **Icons:** Lucide React
- **Build System:** Turborepo
- **Package Manager:** npm workspaces

## Branch Strategy

- `master` — Production-ready public site (`siksatech.in`)
- `admin` — Production-ready team portal (`team.siksatech.in`)

## Contributing

1. Create a feature branch from the appropriate base (`master` for public, `admin` for team)
2. Make your changes
3. Run `npm run lint` and `npm run typecheck`
4. Submit a PR
