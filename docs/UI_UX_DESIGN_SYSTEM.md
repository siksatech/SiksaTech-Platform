# SiksaTech Official UI/UX Design System & Mobile-First Standards

This document establishes the official visual language, color tokens, typography rules, and responsive mobile-first guidelines for the entire SiksaTech platform (`siksatech.in` and `team.siksatech.in`).

---

## 1. The 3-Color Canonical Palette

To ensure consistent brand identity, high contrast, and an engineering-grade aesthetic, only **3 primary colors** are permitted across the design system:

| Role | Color Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- | :--- |
| **Primary Base** | **Obsidian Navy** | `#0A0F1D` / `#0F172A` | Deep contrast, technical authority, hero backdrops, dark surfaces, text in light mode. |
| **Accent Action** | **Electric Blue** | `#2563EB` / `#38BDF8` | Circuit energy, active focus, primary buttons, badges, links, progress indicators. |
| **Canvas** | **Clean White & Slate** | `#FFFFFF` / `#F8FAFC` | Glare-free learning workspace, readable course cards, breadboard documentation. |

### Secondary Neutral Modifiers (Borders & Micro-Text)
- **Border Slate**: `#E2E8F0` (light mode) / `#1E293B` (dark mode)
- **Muted Text Slate**: `#64748B` (light mode) / `#94A3B8` (dark mode)

---

## 2. Design Ideology: *\"Maker-Tech Neo-Clean\"*

- **Tactile Hardware Precision**:
  - Cards use subtle `1px` borders (`border-slate-200` or `border-slate-800`) with smooth rounded corners (`rounded-xl` or `rounded-2xl`).
  - Elevated shadows are subtle (`shadow-sm` on rest, `shadow-md` on hover).
- **Subtle Engineering Grid**:
  - Technical background patterns evoke circuit breadboards and PCB schematics without distracting from text.
- **Monospace Micro-Badges**:
  - Metadata badges (e.g. `CLASS 8–10`, `ARDUINO`, `DOA 14-DAY`) utilize uppercase monospace typography (`font-mono text-[10px] tracking-wider uppercase`).
- **Zero Visual Noise**:
  - No harsh rainbow gradients. Accent color usage is strictly reserved for actionable or status-critical elements.

---

## 3. Mobile-First Responsive Framework

1. **Touch Ergonomics**:
   - Minimum clickable target size: `44px x 44px`.
   - Form inputs use generous padding (`px-4 py-3 text-sm`) to prevent mobile keyboard zoom issues.
2. **Dynamic Banner Carousel**:
   - Desktop: Predefined crisp `21:7` panoramic aspect ratio.
   - Mobile: Reflows gracefully to `16:9` with responsive typography scaling (`text-xl` on mobile &rarr; `text-4xl` on desktop).
3. **Responsive Navigation**:
   - Mobile: Full-height sliding drawer menu with hamburger toggle and quick-action bottom bar.
   - Desktop: Sticky glassmorphic navbar (`backdrop-blur-md bg-white/95`) with direct horizontal links.
4. **Fluid Stacking Rules**:
   - `grid-cols-1` on mobile (<640px).
   - `sm:grid-cols-2` on tablets (640px–1024px).
   - `lg:grid-cols-3` or `lg:grid-cols-4` on desktops (&ge;1024px).

---

## 4. Engineering Rule for Future AI Agents & Developers

> **MANDATORY**: Any new UI component, modal, banner, or landing page must strictly use the 3-color palette (Obsidian Navy `#0F172A`, Electric Blue `#2563EB`, Canvas `#FFFFFF`/`#F8FAFC`) and must be fully responsive on viewport widths down to 320px.
