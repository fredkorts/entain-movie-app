# Movie App

A full-stack movie browsing application that allows users to search, discover, and view detailed information about movies. The application features a React frontend with Redux Toolkit Query for state management and an Express backend that interfaces with The Movie Database (TMDB) API.

**Live Demo**: [https://movie-app-entain.vercel.app/](https://movie-app-entain.vercel.app/)

## Features

- Browse popular movies with pagination
- Search movies by title
- View detailed movie information including cast, crew, trailers, and reviews
- Multi-language support (English, Estonian, Russian)
- Dark/Light theme toggle
- Responsive design for mobile, tablet, and desktop
- Accessible UI with WCAG compliance considerations

## API

This application uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) to fetch movie data. TMDB is a community-built movie and TV database with extensive information about films, cast, crew, and multimedia content.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 18.x or higher

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **pnpm**: Version 8.x or higher (package manager)

  - Install globally: `npm install -g pnpm`
  - Verify installation: `pnpm --version`

- **TMDB API Key**: Required for backend functionality
  - Create a free account at [themoviedb.org](https://www.themoviedb.org/)
  - Navigate to Settings > API
  - Request an API key (choose "Developer" option)
  - Copy your API key for use in backend configuration

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie-app-entain
```

### 2. Install Dependencies

This is a pnpm workspace monorepo. Install all dependencies from the root:

```bash
pnpm install
```

This will install dependencies for both backend and frontend workspaces.

### 3. Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add your TMDB API key to the `.env` file:

```
TMDB_API_KEY=your_api_key_here
PORT=3001
```

**Important**: Replace `your_api_key_here` with your actual TMDB API key. The backend will not start without a valid API key.

### 4. Frontend Configuration

The frontend is pre-configured to connect to the backend at `http://localhost:3001/api` during development. No additional configuration is required unless you change the backend port.

If you need to customize the API URL, create a `.env` file in the `frontend/` directory:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Running the Application

### Development Mode

#### Option 1: Run Both Services Concurrently (Recommended)

From the root directory:

```bash
pnpm dev
```

This starts both the backend (port 3001) and frontend (port 5173) simultaneously.

#### Option 2: Run Services Separately

**Backend** (from root):

```bash
pnpm --filter backend dev
```

**Frontend** (from root):

```bash
pnpm --filter frontend dev
```

Or navigate to each directory:

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/movies

## Project Structure

```
movie-app-entain/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── index.ts           # Express app entry point
│   │   ├── controllers/       # Request handlers
│   │   │   └── movies.ts      # Movie detail and list controllers
│   │   ├── routes/            # API route definitions
│   │   │   └── movies.ts      # Movie routes (/movies, /movies/:id)
│   │   ├── services/          # Business logic
│   │   │   └── tmdb.ts        # TMDB API integration
│   │   └── test/              # Test utilities and mocks
│   │       ├── setup.ts       # MSW test configuration
│   │       ├── constants.ts   # Shared test constants
│   │       ├── testUtils.ts   # Test helper functions
│   │       └── mocks/
│   │           ├── handlers.ts # MSW API mock handlers
│   │           └── server.ts   # MSW server instance
│   ├── package.json
│   ├── vitest.config.ts       # Test configuration
│   └── TESTING.md             # Backend testing documentation
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── main.tsx           # Application entry point
│   │   ├── App.tsx            # Root component with theme provider
│   │   ├── router.tsx         # React Router configuration
│   │   ├── features/          # Feature-based organization
│   │   │   └── movies/
│   │   │       ├── api/       # API types
│   │   │       ├── components/# Movie-specific components
│   │   │       └── pages/     # Movie list and detail pages
│   │   ├── shared/            # Reusable components
│   │   │   ├── components/    # Common UI components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   └── layouts/       # Layout components
│   │   ├── store/             # Redux store configuration
│   │   │   ├── index.ts       # Store setup
│   │   │   └── api/
│   │   │       └── moviesApi.ts # RTK Query API definitions
│   │   ├── i18n/              # Internationalization
│   │   │   ├── index.ts       # i18next configuration
│   │   │   └── locales/       # Translation files (en, et, ru)
│   │   ├── styles/            # Global styles and design system
│   │   │   ├── tokens.css     # Design tokens (colors, spacing)
│   │   │   ├── mixins.scss    # Reusable SCSS mixins
│   │   │   └── utilities.css  # Utility classes
│   │   ├── lib/               # Utility functions
│   │   └── test/              # Test setup and mocks
│   │       ├── setup.ts       # Vitest configuration
│   │       └── mocks/         # MSW handlers for frontend tests
│   ├── e2e/                   # End-to-end tests (Playwright)
│   ├── package.json
│   ├── vitest.config.ts       # Unit test configuration
│   └── playwright.config.ts   # E2E test configuration
│
├── api/                        # Vercel serverless functions
│   ├── [...all].js            # Handles /api/movies routes
│   └── movies/
│       └── [id].js            # Handles /api/movies/:id routes
│
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── vercel.json                # Vercel deployment configuration
└── package.json               # Root package.json with workspace scripts
```

## Running Tests

### Backend Tests

The backend uses **Vitest** with **MSW (Mock Service Worker)** for API mocking.

**Run all backend tests**:

```bash
pnpm --filter backend test:run
```

**Run tests in watch mode** (recommended during development):

```bash
pnpm --filter backend test
```

**Run tests with coverage report**:

```bash
pnpm --filter backend test:coverage
```

**Backend test coverage**: 44 tests covering:

- TMDB service layer (pagination, language mapping, error handling)
- Movie detail controller (data transformation, slicing, 404 handling)
- Movie list controller (query parameters, search, pagination)
- Route validation (dual routes, regex patterns, CORS)

Coverage thresholds: 75% statements, 75% lines, 60% functions, 45% branches

### Frontend Tests

The frontend uses **Vitest** for unit tests and **Playwright** for end-to-end tests.

#### Unit Tests

**Run all unit tests**:

```bash
pnpm --filter frontend test:run
```

**Run tests in watch mode**:

```bash
pnpm --filter frontend test
```

**Run tests with coverage report**:

```bash
pnpm --filter frontend test:coverage
```

**Frontend unit test coverage**: 59 tests covering:

- RTK Query API integration
- Custom React hooks (useDebounce, useImageErrorHandling)
- Utility functions (format, translations)
- Redux store integration

Coverage thresholds: 80% lines, 80% functions, 75% branches

#### End-to-End Tests

E2E tests use Playwright to test the full application flow in a real browser.

**Run E2E tests** (headless):

```bash
pnpm --filter frontend test:e2e
```

**Run E2E tests with UI** (interactive mode):

```bash
pnpm --filter frontend test:e2e:ui
```

**Note**: Ensure both backend and frontend are running before executing E2E tests.

### Run All Tests

From the root directory, you can run all tests across both workspaces:

```bash
# Backend tests
pnpm --filter backend test:run

# Frontend unit tests
pnpm --filter frontend test:run

# Frontend E2E tests (requires app running)
pnpm --filter frontend test:e2e
```

## Building for Production

### Build Both Workspaces

From the root directory:

```bash
pnpm build
```

This builds the backend first, then the frontend.

### Build Individual Workspaces

**Backend**:

```bash
pnpm --filter backend build
```

**Frontend**:

```bash
pnpm --filter frontend build
```

The production build outputs are:

- **Backend**: `backend/dist/` (compiled TypeScript)
- **Frontend**: `frontend/dist/` (optimized static assets)

## Deployment

This application is configured for deployment on **Vercel**.

### Vercel Configuration

The `vercel.json` file configures:

- Build command: `pnpm build`
- Output directory: `frontend/dist`
- API routes: Serverless functions in `api/` directory
- Environment variables: `TMDB_API_KEY` must be set in Vercel project settings

### Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts to link your project
4. Add `TMDB_API_KEY` environment variable in Vercel dashboard
5. Deploy: `vercel --prod`

## Environment Variables

### Backend

| Variable       | Required | Description         | Default |
| -------------- | -------- | ------------------- | ------- |
| `TMDB_API_KEY` | Yes      | Your TMDB API key   | -       |
| `PORT`         | No       | Backend server port | 3001    |

### Frontend

| Variable            | Required | Description     | Default                   |
| ------------------- | -------- | --------------- | ------------------------- |
| `VITE_API_BASE_URL` | No       | Backend API URL | http://localhost:3001/api |

## Troubleshooting

### Backend won't start

- Verify `TMDB_API_KEY` is set in `backend/.env`
- Check that port 3001 is not in use: `lsof -i :3001`
- Ensure Node.js version is 18.x or higher

### Frontend can't connect to backend

- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` in frontend `.env` (if customized)
- Check browser console for CORS errors

### Tests failing

- Ensure all dependencies are installed: `pnpm install`
- Clear Vitest cache: `pnpm --filter backend vitest --clearCache`
- For E2E tests, verify both services are running

### Theme not switching properly

- Clear browser cache and localStorage
- Check browser console for errors
- Verify CSS custom properties are loading correctly

## Technologies Used

### Backend

- Node.js & Express
- TypeScript
- Axios (HTTP client)
- Vitest (testing)
- MSW (API mocking)

### Frontend

- React 19
- TypeScript
- Vite (build tool)
- Redux Toolkit Query (state management)
- React Router (routing)
- Ant Design (UI components)
- i18next (internationalization)
- SCSS Modules (styling)
- Vitest (unit testing)
- Playwright (E2E testing)

### Deployment

- Vercel (hosting and serverless functions)

## License

This project is for educational and demonstration purposes.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
