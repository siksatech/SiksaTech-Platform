<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SiksaTech Agent Guidelines & Architecture Manual

This document serves as the canonical guideline for AI agents and developers working on the **SiksaTech Platform**.

---

## 1. Monorepo Architecture Overview

SiksaTech is structured as a **Turborepo monorepo** managed via npm workspaces:

```text
SiksaTech/
├── apps/
│   ├── web/           # Public Student & Institutional Portal (siksatech.in) [Next.js 16, Port 3000]
│   └── team/          # Internal Operations, Curriculum & Triage Portal (team.siksatech.in) [Next.js 16, Port 3001]
├── packages/
│   ├── ui/            # Shared UI Component Library (Navbar, Footer, SiksaTechLogo)
│   ├── database/      # Unified Supabase Client, Mock Fallbacks, Schema & Query Models
│   ├── auth/          # Authentication re-exports and session helpers
│   └── config/        # Global Site Constants & Domain Configuration
├── docs/              # Architectural Specifications & Design Guidelines
├── .agents/
│   └── rules/         # Agent rule files (UI/UX design system specifications)
├── AGENTS.md          # This canonical guidelines file
├── turbo.json         # Turborepo task pipeline configuration
└── package.json       # Monorepo workspaces root configuration
```

---

## 2. Technology Stack & Modern Conventions

1. **Framework**: Next.js 16 (Turbopack, App Router)
2. **Runtime**: React 19 (Async parameters with `use(params)`, pure component renderers)
3. **Styling**: Tailwind CSS v4 with `@theme` token definitions
4. **Icons**: Lucide React (`lucide-react`)
5. **Data Layer**: `@siksatech/database` (Supabase JS v2 with graceful fallback to typed mock datasets when credentials are not configured)
6. **Package Manager**: npm workspaces (`npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`)

---

## 3. UI/UX Design System Rules

All frontend components and pages across both portals must strictly follow these rules:

1. **Max 3 Primary Colors**:
   - **Obsidian Navy (`#0A0F1D` / `#0F172A`)**: Primary base for dark mode/backdrops, deep headers, and technical panels.
   - **Electric Blue (`#2563EB` / `#38BDF8`)**: Primary interactive accents, active states, circuit glows, and key CTA buttons.
   - **Clean White/Slate (`#FFFFFF` / `#F8FAFC`)**: Pedagogical reading canvas, content card backgrounds, and crisp text contrast.
2. **Design Philosophy**: *"Maker-Tech Neo-Clean"* (1px crisp borders, tactile cards, monospace badges, breadboard grids).
3. **Mobile Responsiveness**:
   - Minimum 44px touch targets on buttons and mobile menu items.
   - Mobile-first layouts using single-column stacking (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
   - Responsive banner aspect ratios (`21:7` desktop / `16:9` mobile).
   - Collapsible mobile drawer navigation in shared Navbar.
4. **JSX Typography Hygiene**:
   - Always escape naked single quotes (`&apos;`) and double quotes (`&quot;`).

---

## 4. Key Workflows & Commands

- **Start Development**: `npm run dev` (spawns both `apps/web` on `:3000` and `apps/team` on `:3001`)
- **Production Build**: `npm run build` (Turbopack static generation & page compilation across monorepo)
- **Type Checking**: `npm run typecheck` (`tsc --noEmit` across all apps & packages)
- **Code Linting**: `npm run lint` (`eslint .` flat config with Next.js 16 and TypeScript rules)

---

## 5. Coding & Database Principles

- **Graceful Fallbacks**: Never assume live Supabase credentials exist. All functions in `@siksatech/database` provide robust mock fallbacks (`DEMO_PATHS`, `DEMO_COURSES`, `DEMO_PROJECTS`, `DEMO_BANNERS`, `DEMO_CERTIFICATES`).
- **Single Source of Truth**: Shared UI components live in `packages/ui`. Shared business logic and data access live in `packages/database`.
- **Pure Rendering**: Avoid calling impure functions (`Math.random()`, `Date.now()`) directly inside JSX rendering passes.
