# GitHub Actions CI/CD Pipeline

This workflow automatically builds, tests, and deploys the application to GitHub Pages.

## Workflow Triggers

The workflow runs on:
- Push to `master` branch
- Pull requests targeting `master`
- Manual trigger via GitHub Actions UI (workflow_dispatch)

## Workflow Steps

1. **Checkout code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js version 22.19.0 (matches `.nvmrc`)
3. **Setup pnpm** - Installs pnpm version 10.17.1 (matches `packageManager` field)
4. **Install dependencies** - Installs all npm packages with frozen lockfile
5. **Run TypeScript type checking** - Ensures no TypeScript errors
6. **Run linter** - Checks code quality (continues on error)
7. **Run tests** - Executes all unit tests
8. **Build application** - Creates production build
9. **Deploy to GitHub Pages** - Publishes to GitHub Pages (only on push to master)

## GitHub Pages Setup

To enable GitHub Pages deployment:

1. Go to your repository's **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy to `https://[username].github.io/[repository-name]/` (e.g., `https://ilearnnode.github.io/fe-sl/`)

## Required Repository Settings

The workflow requires these permissions (already configured in the workflow):
- `contents: read` - To checkout code
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For GitHub Pages deployment authentication

## Local Testing

You can test the workflow commands locally:

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm run type-check

# Run linter
pnpm run lint

# Run tests
pnpm test run

# Build for production
pnpm run build

# Build with GitHub Pages base path
GITHUB_ACTIONS=true pnpm run build
```

## Important Notes

- **Version Consistency**: The workflow uses pinned versions to ensure reproducible builds:
  - Node.js version is specified in `.nvmrc` and matches the workflow
  - pnpm version is specified in `package.json` `packageManager` field and matches the workflow
  - This eliminates lockfile compatibility issues between local and CI environments
- **Reproducible Builds**: Using exact versions ensures `pnpm install --frozen-lockfile` always works
- **Local Development**: Use `nvm use` (if using nvm) to match the Node.js version locally

## Customization

- To change the deployment branch, modify the `branches` array in the workflow
- To deploy to a custom domain, add a `CNAME` file to the `public` directory
- The base path is automatically detected from the repository name only when building in GitHub Actions
- Local builds and preview use `/` as base path for development convenience