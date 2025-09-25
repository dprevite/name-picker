# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server (Vite 7 on port 5173)
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run preview` - Preview production build locally
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint code quality checks
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run tests in watch mode with Vitest 3
- `npm run test:ui` - Launch Vitest UI for visual test running
- `npm run test:coverage` - Generate test coverage reports
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright with UI mode
- Run single test file: `npx vitest src/App.test.tsx`
- Run tests matching pattern: `npx vitest --grep "shuffle"`

### Docker & Deployment
- `docker build -t name-shuffle-app .` - Build Docker image locally
- `docker run -p 8080:80 name-shuffle-app` - Run container locally
- `docker-compose up -d` - Run with Docker Compose
- Production images: `ghcr.io/your-username/name-shuffle-app:latest`

## Architecture Overview

This is a **Name Shuffle App** - a React 19 single-page application for randomly selecting names from a list with enhanced animations, persistent storage, and automated CI/CD.

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
The enhanced shuffle feature has a sophisticated 2-second animation sequence:
1. Click shuffle → show spinning circle cycling through all user icons + emoji icons every 100ms
2. After 2000ms → select random person, stop cycling
3. Selected person displays with bounce-and-grow animation and name appears as chevron below avatar
4. Background color effect applies to both main area (opacity-10) and sidebar (opacity-15) matching person's color

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

## CI/CD & Release System

### Automated Workflow (.github/workflows/release.yml)
- **Push to main**: Runs tests, builds, and potentially releases
- **Pull requests**: Runs quality checks only (tests, lint, typecheck)
- **Semantic versioning**: Automatically determines version from conventional commit messages
- **Multi-platform builds**: Docker images for AMD64 and ARM64
- **GHCR publishing**: Images pushed to GitHub Container Registry with semantic tags

### Commit Message Format
Use conventional commits for automated versioning:
- `feat:` → Minor version bump (1.0.0 → 1.1.0)
- `fix:` → Patch version bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` → Patch version bump

### Release Automation
- **Changelog generation**: Automatic CHANGELOG.md with categorized sections
- **GitHub releases**: Created with semantic version tags
- **Docker tags**: `latest`, `v1.2.3`, `1`, `1.2` for flexible deployment
- **Documentation updates**: docker.md automatically updated with new version numbers

### Quality Gates
All releases require passing:
- Unit tests (Vitest)
- End-to-end tests (Playwright)
- TypeScript compilation
- ESLint code quality
- Build process completion

## Docker Deployment

### Production Image
- **Multi-stage build**: Node.js builder → Nginx runtime (~25MB final size)
- **Security**: Non-root user, security headers, minimal attack surface
- **Performance**: Gzip compression, static asset caching, SPA routing support
- **Health checks**: Built-in container health monitoring

### Development vs Production
- **Development**: Use `npm run dev` for hot reloading
- **Production**: Use Docker image for consistent deployment
- **Local testing**: `npm run build && npm run preview` to test production build