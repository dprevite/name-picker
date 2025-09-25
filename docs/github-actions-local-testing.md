# Testing GitHub Actions Locally

This document provides instructions on how to test our GitHub Actions workflows locally before pushing to GitHub.

## Prerequisites

Before you can test GitHub Actions locally, you'll need to install the required tools.

### 1. Install act (GitHub Actions runner)

`act` is a tool that allows you to run GitHub Actions locally using Docker.

#### macOS (using Homebrew)
```bash
brew install act
```

#### Linux
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

#### Windows
```bash
choco install act-cli
```

### 2. Install Docker

act requires Docker to run. Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).

### 3. Install actionlint

actionlint is used to lint GitHub Actions workflow files.

#### macOS (using Homebrew)
```bash
brew install actionlint
```

#### Linux/macOS (using script)
```bash
bash <(curl https://raw.githubusercontent.com/rhymond/actionlint/main/scripts/download-actionlint.bash)
sudo mv actionlint /usr/local/bin/
```

#### Windows (using Chocolatey)
```bash
choco install actionlint
```

## Testing Workflows Locally

### 1. Test the CI Workflow (Tests)

To run the CI workflow that includes unit tests, build, and e2e tests:

```bash
# Run the full CI workflow
act -W .github/workflows/ci.yml

# Run only specific jobs
act -j test -W .github/workflows/ci.yml

# Run with specific Node.js version
act -j test -W .github/workflows/ci.yml --matrix node-version:20.x
```

### 2. Test the Code Style Workflow

To run the code style checks (lint, format, typecheck):

```bash
# Run the full code style workflow
act -W .github/workflows/code-style.yml

# Run specific job
act -j lint-and-format -W .github/workflows/code-style.yml
```

### 3. Test Workflow Linting

To lint the GitHub Actions workflow files:

```bash
# Run actionlint directly (this is what the workflow does)
actionlint

# Run the workflow lint workflow
act -W .github/workflows/workflow-lint.yml
```

## Manual Testing (Alternative to act)

If you prefer to test the commands manually without Docker/act:

### 1. Test CI Commands

```bash
# Install dependencies
npm ci

# Run unit tests
npm test -- --run --reporter=verbose

# Build project
npm run build

# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run e2e tests
npx playwright test
```

### 2. Test Code Style Commands

```bash
# Type check
npm run typecheck

# Lint check
npm run lint

# Format check
npm run format:check

# Auto-fix linting issues
npm run lint:fix

# Auto-format code
npm run format
```

### 3. Test Workflow Linting

```bash
# Lint all workflow files
actionlint

# Lint specific workflow file
actionlint .github/workflows/ci.yml
```

## Troubleshooting

### act Issues

1. **Docker permission errors**: Make sure Docker is running and your user has permission to use Docker.

2. **Large Docker images**: act downloads large Docker images. Use smaller images:
   ```bash
   act -P ubuntu-latest=catthehacker/ubuntu:act-latest
   ```

3. **Secrets and environment variables**: Create a `.secrets` file for testing:
   ```bash
   echo "GITHUB_TOKEN=your_github_token" > .secrets
   act --secret-file .secrets
   ```

### Workflow Debugging

1. **Enable debug logging**:
   ```bash
   act --verbose
   ```

2. **Run specific steps**:
   ```bash
   act -j job_name --step step_name
   ```

3. **Dry run** (show what would be executed):
   ```bash
   act --dry-run
   ```

## Best Practices

1. **Always test locally** before pushing workflow changes
2. **Use actionlint** to catch syntax errors early
3. **Test on the same Node.js versions** used in CI (18.x, 20.x)
4. **Keep workflows fast** by using appropriate caching
5. **Use matrix builds** for testing multiple environments

## Resources

- [act Documentation](https://github.com/nektos/act)
- [actionlint Documentation](https://github.com/rhymond/actionlint)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)