# Sports Leagues Viewer

A Vue.js application that displays sports leagues from TheSportsDB API with filtering and badge display functionality.

## Features

- Display sports leagues with name, sport type, and alternate names
- Search leagues by name
- Filter by sport type
- Click on leagues to view season badges
- API response caching to minimize requests
- Responsive design with Tailwind CSS

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Tailwind CSS
- pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## API

- Leagues: https://www.thesportsdb.com/api/v1/json/3/all_leagues.php
- Season Badges: https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id={id}