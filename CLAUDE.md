# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server (Vite on port 5173)
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run tests in watch mode with Vitest
- `npm run test:ui` - Launch Vitest UI for visual test running
- `npm run test:coverage` - Generate test coverage reports
- Run single test file: `npx vitest src/App.test.tsx`
- Run tests matching pattern: `npx vitest --grep "shuffle"`

## Architecture Overview

This is a **Name Shuffle App** - a React 19 single-page application for randomly selecting names from a list with persistent storage and animations.

### Core Architecture Patterns

**State Management:**
- Uses React's built-in state management (useState, useEffect)
- localStorage integration for persistence with automatic save/load
- No external state management library - keeps it simple for the app's scope

**Component Structure:**
- `App.tsx` - Main application logic containing all business logic
- `components/ui/` - Reusable shadcn/ui components (Button, Input)
- `lib/utils.ts` - Contains the `cn()` utility for conditional classes

**Data Flow:**
1. Names are stored in component state as `Person[]` objects with `{id, name, color, icon}`
2. Colors and icons are randomly assigned from predefined arrays (`COLORS`, `ICONS`)
3. localStorage automatically syncs with state changes via useEffect
4. Shuffle animation uses setTimeout-based state transitions for the 2-second dice animation

### Key Technical Details

**Tailwind CSS 4.1 Configuration:**
- Uses the new `@tailwindcss/vite` plugin (not PostCSS)
- Custom animations defined in `tailwind.config.js`: `spin-slow`, `bounce-in`, `fade-in`
- CSS variables system in `index.css` supports light/dark themes

**TypeScript Patterns:**
- Interface `Person` defines the core data structure
- Full type safety with proper prop types for all components
- Path aliases configured (`@/` maps to `src/`)

**Testing Architecture:**
- Vitest 3.0 with React Testing Library 16.1 and jsdom 25
- Tests mock localStorage, crypto.randomUUID, and use proper async patterns
- Comprehensive coverage including user interactions, animations, and edge cases

## Project-Specific Context

### Animation System
The shuffle feature has a specific 2-second animation sequence:
1. Click shuffle → show spinning dice (🎲) with "Shuffling..." text
2. After 2000ms → select random person, hide spinner
3. After additional 100ms → show selected person with bounce-in animation

### Data Persistence
- Uses localStorage key: `'nameShuffle-people'`
- Automatically loads on mount and saves on every state change
- Handles edge cases like selecting someone who gets deleted

### Color/Icon System
- 12 predefined colors in `COLORS` array (Tailwind bg- classes)
- 12 emoji icons in `ICONS` array (person-related emojis)
- Random assignment happens only on name creation, then persists

### Component Testing Patterns
- Mock crypto.randomUUID with predictable values for testing
- Mock localStorage with vi.fn() for all CRUD operations
- Use waitFor() for async operations like shuffle animations
- Test both happy path and edge cases (empty names, deletions, etc.)

### shadcn/ui Integration
- Button component supports multiple variants: default, destructive, outline, secondary, ghost, link
- Size variants: default, sm, lg, icon
- Input component follows standard form patterns with forwarded refs
- Both components use class-variance-authority for type-safe variants