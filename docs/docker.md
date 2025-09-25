# Docker Build Guide

This document explains how to build and run the Name Shuffle App using Docker with multi-stage builds for optimal image size and security.

## Quick Start

```bash
# Build the Docker image
docker build -t name-shuffle-app .

# Run the container
docker run -p 8080:80 name-shuffle-app
```

The application will be available at http://localhost:8080

## Multi-Stage Build Architecture

The Dockerfile uses a two-stage build process to minimize the final image size:

### Stage 1: Builder (`node:20-alpine`)
- Installs all dependencies (including dev dependencies)
- Copies source code
- Runs the TypeScript compilation and Vite build process
- Produces the optimized static assets in `/dist`

### Stage 2: Runtime (`nginx:1.25-alpine`)
- Copies only the built static assets from the builder stage
- Configures nginx for single-page application routing
- Includes security headers and performance optimizations
- Final image size: ~25MB (compared to ~300MB+ with Node.js runtime)

## Build Commands

### Standard Build
```bash
docker build -t name-shuffle-app .
```

### Build with Custom Tag
```bash
docker build -t name-shuffle-app:v1.0.0 .
```

### Build with Build Arguments (if needed)
```bash
docker build --build-arg NODE_ENV=production -t name-shuffle-app .
```

## Running the Container

### Basic Run
```bash
docker run -p 8080:80 name-shuffle-app
```

### Run in Detached Mode
```bash
docker run -d -p 8080:80 --name name-shuffle name-shuffle-app
```

### Run with Custom Port
```bash
docker run -p 3000:80 name-shuffle-app
```

## Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with Docker Compose:
```bash
docker-compose up -d
```

## Nginx Configuration

The Dockerfile includes a custom nginx configuration that provides:

- **SPA Routing**: Handles client-side routing by falling back to `index.html`
- **Gzip Compression**: Reduces bandwidth usage for text assets
- **Static Asset Caching**: Sets appropriate cache headers for performance
- **Security Headers**: Includes basic security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)

## Health Checks

The container includes a health check that:
- Runs every 30 seconds
- Times out after 3 seconds
- Allows 5 seconds for startup
- Fails after 3 consecutive failures

Check container health:
```bash
docker ps  # Look for "healthy" status
docker inspect name-shuffle-app  # Detailed health info
```

## Image Optimization Features

- **Alpine Linux Base**: Minimal attack surface and smaller size
- **Multi-stage Build**: Excludes build tools and dependencies from final image
- **Layer Caching**: Optimized layer ordering for faster rebuilds
- **No Root User**: Nginx runs as non-root user by default

## Troubleshooting

### Container Won't Start
```bash
# Check container logs
docker logs name-shuffle-app

# Run interactively for debugging
docker run -it --rm -p 8080:80 name-shuffle-app /bin/sh
```

### Build Fails
```bash
# Build with verbose output
docker build --progress=plain -t name-shuffle-app .

# Build without cache
docker build --no-cache -t name-shuffle-app .
```

### Application Not Loading
1. Check if the container is running: `docker ps`
2. Verify port mapping is correct
3. Check browser console for errors
4. Inspect nginx logs: `docker logs name-shuffle-app`

## Development vs Production

This Dockerfile is optimized for production. For development:

```bash
# Use the development server instead
npm run dev
```

Or create a separate `Dockerfile.dev` for development with hot reloading.

## Security Considerations

- Uses non-root user (nginx default)
- Includes security headers
- Minimal attack surface with Alpine base
- No sensitive information in image layers
- Health checks for container monitoring