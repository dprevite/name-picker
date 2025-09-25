# Automated Releases with GitHub Actions

This project uses GitHub Actions to automatically build, test, and release Docker containers to GitHub Container Registry (GHCR) with semantic versioning.

## How It Works

### 🔄 Automated Workflow

The release process is fully automated through the `.github/workflows/release.yml` workflow:

1. **On every push to `main`**: The workflow runs tests, builds, and potentially releases
2. **Pull requests**: Only run tests (no releases)
3. **Semantic versioning**: Automatically determines version based on commit messages

### 📦 Release Process

#### 1. Tests and Quality Checks
- Runs all tests (`npm test`)
- Performs type checking (`npm run typecheck`)
- Runs linting (`npm run lint`)

#### 2. Semantic Release Analysis
- Analyzes commit messages since the last release
- Determines if a new release is needed
- Calculates the next version number based on commit types

#### 3. Docker Build and Push
- Builds multi-platform Docker image (AMD64 and ARM64)
- Pushes to GitHub Container Registry (`ghcr.io`)
- Tags with semantic version and `latest`

#### 4. Documentation Updates
- Automatically updates `docs/docker.md` with the new version
- Commits the documentation changes

### 🏷️ Semantic Versioning

Version numbers follow [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

| Commit Type | Version Impact | Example |
|-------------|----------------|---------|
| `feat:` | **Minor** version bump | `1.0.0` → `1.1.0` |
| `fix:` | **Patch** version bump | `1.0.0` → `1.0.1` |
| `BREAKING CHANGE:` | **Major** version bump | `1.0.0` → `2.0.0` |
| `docs:`, `style:`, `refactor:`, `test:`, `chore:` | **Patch** version bump | `1.0.0` → `1.0.1` |

### 📝 Commit Message Format

Use [Conventional Commits](https://conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Examples:
```bash
# New feature (minor version)
git commit -m "feat: add dark mode toggle to settings"

# Bug fix (patch version)
git commit -m "fix: resolve shuffle animation timing issue"

# Breaking change (major version)
git commit -m "feat!: redesign user interface

BREAKING CHANGE: removed legacy theme system"

# Documentation (patch version)
git commit -m "docs: update installation instructions"
```

### 📋 Automatic Changelog

Each release automatically generates a `CHANGELOG.md` with:

- ✨ **Features**: New functionality
- 🐛 **Bug Fixes**: Fixed issues
- 📚 **Documentation**: Documentation changes
- 💎 **Styles**: UI/UX improvements
- 📦 **Code Refactoring**: Internal improvements
- 🚀 **Performance**: Performance improvements
- 🚨 **Tests**: Test-related changes
- 🛠 **Build System**: Build/tooling changes
- ⚙️ **CI**: Continuous integration changes
- ♻️ **Chores**: Maintenance tasks
- 🗑 **Reverts**: Reverted changes

### 🐳 Using Released Docker Images

After a release, the Docker image is available at:

```bash
# Latest version
docker run -p 8080:80 ghcr.io/dprevite/name-picker:latest

# Specific version
docker run -p 8080:80 ghcr.io/dprevite/name-picker:v1.0.0

# Major version
docker run -p 8080:80 ghcr.io/dprevite/name-picker:1

# Major.Minor version
docker run -p 8080:80 ghcr.io/dprevite/name-picker:1.0
```

### 🔧 Configuration Files

The release system uses these configuration files:

- **`.github/workflows/release.yml`**: GitHub Actions workflow
- **`.releaserc.json`**: Semantic release configuration
- **`package.json`**: Contains semantic-release dependencies

### 🚀 Triggering a Release

To trigger a release:

1. Make changes following conventional commit format
2. Push to `main` branch
3. GitHub Actions will automatically:
   - Run tests
   - Determine if a release is needed
   - Build and push Docker image (if releasing)
   - Create GitHub release with changelog
   - Update documentation

### 📈 Release Status

Check the status of releases:

- **GitHub Actions**: Go to the "Actions" tab in your repository
- **Releases**: Check the "Releases" section on GitHub
- **Packages**: View Docker images in the "Packages" tab

### 🛠️ Manual Release

If needed, you can manually trigger a release by pushing an empty commit:

```bash
git commit --allow-empty -m "chore: trigger release"
git push
```

## Setup Requirements

To use this system in your own repository:

1. **Enable GitHub Container Registry**: Ensure GHCR is enabled for your account
2. **Repository Permissions**: The `GITHUB_TOKEN` needs write access to packages
3. **Branch Protection**: Consider protecting the `main` branch
4. **Update Configuration**: Update repository URLs in `.releaserc.json`

The system will automatically create the first release when you push the first properly formatted commit to `main`.