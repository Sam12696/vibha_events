# Project Structure & Architecture

## 📁 Directory Organization

```
vibha_events/
│
├── frontend/                      # React/Vite Frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── vite.config.ts            # Vite configuration
│
├── backend/                      # Express.js Backend
│   ├── src/
│   │   ├── routes/               # API route handlers
│   │   │   └── projectRoutes.ts
│   │   ├── controllers/          # Business logic
│   │   │   └── projectsController.ts
│   │   ├── middleware/           # Express middleware
│   │   │   └── errorHandler.ts
│   │   ├── utils/                # Utility functions
│   │   │   └── projectsService.ts
│   │   ├── data/                 # Data storage
│   │   │   └── projects.json
│   │   └── server.ts             # Main server file
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── .env.example              # Environment template
│
├── shared/                       # Shared Code
│   └── types.ts                  # Common TypeScript types
│
├── docs/                         # Documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── API.md                    # API documentation
│   └── PRE-DEPLOYMENT-CHECKLIST.md
│
├── scripts/                      # Utility scripts
│   └── pre-deploy.js             # Pre-deployment checks
│
├── index.html                    # HTML entry point
├── package.json                  # Root dependencies
├── tsconfig.json                 # Root TypeScript config
├── vite.config.ts                # Vite config
├── server.ts                     # TEMPORARY (being moved to backend)
├── README.md                     # Project overview
└── .env.example                  # Environment template
```

---

## 🎯 Architecture Overview

### MonoRepo Structure
This project uses a **monorepo pattern** with:
- **Frontend**: React/Vite SPA
- **Backend**: Express.js API Server
- **Shared**: Common types and utilities

### Communication Flow
```
Client (Browser)
    ↓ HTTP Requests
API Server (Express)
    ↓ API Routes
Controllers (Business Logic)
    ↓ Service Layer
Data Services (File/Database)
    ↓
Data Storage (JSON/Database)
```

---

## 🗂️ Folder Purposes

### `/frontend`
- React/Vite application
- React components and pages
- User interface and styling
- Client-side routing and state
- **Deploys to**: Vercel/Netlify
- **Runs on**: Port 3000 (dev) or served by Express (prod)

### `/backend`
- Express.js API server
- RESTful API endpoints
- Business logic and data operations
- Server-side validation
- **Runs on**: Port 3000
- **Deployed with**: Frontend (monolith)

### `/shared`
- TypeScript type definitions
- Interfaces used by both frontend and backend
- Constants and enums
- Makes frontend and backend "speak the same language"

### `/docs`
- API documentation
- Deployment guides
- Architecture notes
- Setup instructions

### `/scripts`
- Build automation
- Deployment scripts
- Pre-flight checks
- Maintenance utilities

---

## 🔄 Data Flow

### Portfolio Gallery Request
```
1. Browser: GET /api/projects
2. Backend: Express receives request
3. Controller: getProjects() processes
4. Service: projectsService.getAllProjects()
5. Storage: Read projects.json
6. Return: JSON array to frontend
7. Frontend: Display in gallery
```

### Form Submission Flow
```
1. Frontend: User fills consultation form
2. Validation: Check email, name, date
3. Submit: POST request to backend
4. Backend: Validate again (server-side)
5. Process: Save to database
6. Response: Confirmation to frontend
7. Frontend: Show success message
```

---

## 📦 Dependencies

### Frontend
- **react**: UI library
- **vite**: Build tool
- **tailwindcss**: CSS framework
- **motion**: Animations
- **react-router**: Navigation

### Backend
- **express**: Web framework
- **cors**: Cross-origin support
- **helmet**: Security headers
- **morgan**: HTTP logging
- **typescript**: Type safety

### Shared
- **typescript**: Type definitions

---

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_GA_ID=google-analytics-id
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=debug
```

---

## 📄 File Naming Conventions

### TypeScript Files
- Components: `PascalCase.tsx` (e.g., `Header.tsx`)
- Utilities: `camelCase.ts` (e.g., `projectsService.ts`)
- Types: `camelCase.ts` (e.g., `types.ts`)

### Folders
- All lowercase with hyphens: `my-folder/`
- Descriptive names: `routes/`, `controllers/`, `utils/`

### Classes & Types
- Classes: `PascalCase` (e.g., `class ProjectService`)
- Types: `PascalCase` (e.g., `type PortfolioProject`)
- Interfaces: `PascalCase` (e.g., `interface ApiResponse`)

---

## 🚀 Build & Deployment

### Development
```bash
npm run dev
# Runs backend + frontend together
# Backend: http://localhost:3000
# Frontend served by Vite
```

### Production Build
```bash
npm run build
# Builds frontend to dist/
# Backend ready to serve frontend
```

### Deployment
```bash
npm run pre-deploy
# Runs checks before deployment
npm run deploy
# Deploys to Vercel
```

---

## 🧪 Testing Strategy

### Frontend Testing
- Manual testing on all browsers
- Manual testing on mobile devices
- Lighthouse performance checks

### Backend Testing
- API endpoint testing
- Error handling verification
- Data validation checks

### Pre-Deployment
- Run full checklist
- Test all user flows
- Verify all API endpoints

---

## 📝 Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use proper types)
- All functions typed
- Export types for public APIs

### Code Style
- ESLint configured (when setup)
- Prettier for formatting (when setup)
- 2-space indentation
- Descriptive variable/function names

### Comments
- Explain "why", not "what"
- JSDoc for public functions
- Clarify complex logic
- Document assumptions

### Error Handling
- Try-catch for async operations
- Proper error messages
- Log errors for debugging
- User-friendly error responses

---

## 🔗 Related Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)**: How to deploy to production
- **[API.md](API.md)**: API endpoints documentation
- **[PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md)**: Launch checklist
- **[README.md](../README.md)**: Project overview

---

## 👥 Team Workflows

### Feature Development
```
1. Create feature branch from `develop`
2. Make changes
3. Create PR to `develop`
4. Code review & tests
5. Merge when approved
```

### Release Process
```
1. Create release branch from `develop`
2. Update version numbers
3. Create PR to `main`
4. Final QA testing
5. Merge when approved
6. Deploy to production
```

---

## 🆘 Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

**TypeScript errors?**
```bash
npx tsc --noEmit
# Shows all type errors
```

**Build fails?**
```bash
rm -rf dist node_modules
npm install
npm run build
```

---

**Last Updated**: 2024-01-15
**Maintained by**: Vibha Events Dev Team
