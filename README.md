# e-Kap -- Barangay Management System

A "Zero-Typing" Barangay ID request system. Residents snap their ID via a mobile app, Gemini AI extracts all fields, users review/correct, and admins process via a web Kanban dashboard.

## Architecture

```
+-----------------+     +------------------+     +------------------+
|  Mobile App     |---->|  Backend API     |---->|  Web Dashboard   |
|  (Expo/React    |     |  (Express/TS)    |     |  (React/Vite)    |
|   Native)       |     |                  |     |                  |
|                 |     |  MongoDB         |     |  Kanban Board    |
|  Camera -> OCR  |     |  Mongoose        |     |  Approve/Reject  |
|  Review -> Submit|    |  Gemini 2.0 Flash|     |  Missed Calls    |
|  Anonymous Auth |     |  WebSocket (WS)  |     |                  |
+-----------------+     +------------------+     +------------------+
```

## Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| **Mobile** | Expo SDK 56, React Native 0.85, TypeScript, NativeWind v5, Firebase Auth |
| **Web**    | React 19, Vite 8, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend**| Express 5, TypeScript, Mongoose 9, Gemini 2.0 Flash, WebSocket (ws) |
| **Database**| MongoDB                                              |
| **AI**     | Google Gemini 2.0 Flash (OCR extraction)             |

## Prerequisites

- Node.js 20+
- MongoDB (running locally or remote URI)
- Firebase project (for anonymous authentication)
- Google Gemini API key

## Setup

### 1. Clone and Install Dependencies

```bash
# Install backend deps
cd backend && npm install

# Install mobile app deps
cd app && npx expo install

# Install web dashboard deps
cd web && npm install
```

### 2. Configure Environment Variables

**`backend/.env`**:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ekap
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
```

**`app/.env`**:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**`web/.env`**:
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Start MongoDB

```bash
mongod
```

### 4. Start the Backend

```bash
cd backend
npm run dev
```

### 5. Start the Web Dashboard

```bash
cd web
npm run dev
```

### 6. Start the Mobile App

```bash
cd app
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

## Demo Flow

1. **Open the app** -- Anonymous Firebase sign-in (automatic)
2. **Capture your ID** -- Point camera at National ID or Barangay ID
3. **Review and Correct** -- Gemini AI auto-fills name, address, birth date, gender
4. **Submit** -- Request sent to backend, saved in MongoDB
5. **Admin reviews** -- Open web dashboard, see request in "Pending Review" column
6. **Approve/Reject** -- Staff clicks Approve or Reject, status updates in real-time

**Target dwell time:** Under 45 seconds from camera snap to submission confirmation.

## API Endpoints

| Method | Endpoint                       | Description                              |
|--------|--------------------------------|------------------------------------------|
| GET    | `/`                            | Health check                             |
| POST   | `/api/ocr`                     | Upload ID image -> Gemini OCR extraction |
| POST   | `/api/requests`                | Create barangay ID request               |
| GET    | `/api/requests`                | List requests (?status=&page=&limit=)    |
| GET    | `/api/requests/:id`            | Get single request                       |
| PATCH  | `/api/requests/:id`            | Update request status (approve/reject)   |
| POST   | `/api/watchdog/missed-call`    | Log missed call                          |
| GET    | `/api/watchdog/missed-calls`   | List missed calls                        |
| WS     | `ws://localhost:3001`          | WebSocket signaling                      |

## Project Structure

```
E:.
+---app/                          # Expo React Native mobile app
|   +---src/
|   |   +---navigation/
|   |   |   +---AppNavigator.tsx   # Stack navigator: Capture -> Review -> Status
|   |   +---screens/
|   |   |   +---CaptureScreen.tsx  # Camera capture with ID frame overlay
|   |   |   +---ReviewScreen.tsx   # Split-screen: photo top, editable fields bottom
|   |   |   +---StatusScreen.tsx   # Submission confirmation and status polling
|   |   +---services/
|   |   |   +---api.ts             # Axios API client for backend endpoints
|   |   |   +---firebase.ts        # Firebase initialization and anonymous auth
|   |   +---tw/
|   |   |   +---index.tsx          # Tailwind CSS-wrapped React Native components
|   |   +---global.css             # NativeWind global styles
|   +---App.tsx                    # Entry point with auth init and navigator
+---backend/                       # Express + TypeScript API server
|   +---src/
|   |   +---config/
|   |   |   +---db.ts              # MongoDB connection with retry logic
|   |   +---models/
|   |   |   +---BarangayIDRequest.ts  # Mongoose schema for ID requests
|   |   |   +---MissedCallLog.ts      # Mongoose schema for watchdog logs
|   |   |   +---OcrCache.ts           # Mongoose schema for OCR result cache (TTL: 1h)
|   |   +---routes/
|   |   |   +---ocr.ts             # POST /api/ocr - Gemini 2.0 Flash extraction
|   |   |   +---requests.ts        # CRUD: POST/GET/PATCH /api/requests
|   |   |   +---watchdog.ts        # POST/GET /api/watchdog/missed-call(s)
|   |   +---index.ts               # Server entry point, mounts all routes
|   |   +---ws.ts                  # WebSocket server (port 3001) for signaling
|   +---.env                       # Backend environment configuration
+---web/                           # React + Vite admin dashboard
|   +---src/
|   |   +---components/
|   |   |   +---ui/                # shadcn primitives
|   |   |   |   +---badge.tsx
|   |   |   |   +---button.tsx
|   |   |   |   +---card.tsx
|   |   |   |   +---dialog.tsx
|   |   |   |   +---select.tsx
|   |   |   |   +---skeleton.tsx
|   |   |   |   +---sonner.tsx
|   |   |   |   +---table.tsx
|   |   |   |   +---textarea.tsx
|   |   |   +---KanbanColumn.tsx       # Kanban column component
|   |   |   +---MissedCallsPanel.tsx   # Watchdog missed calls panel
|   |   |   +---RequestDetailDialog.tsx # Request detail dialog with approve/reject
|   |   +---lib/
|   |   |   +---api.ts             # API client and type definitions
|   |   |   +---utils.ts           # Utility functions (shadcn cn helper)
|   |   +---App.tsx                # Dashboard with Kanban layout and polling
|   |   +---index.css              # Tailwind CSS v4 entry point
|   |   +---main.tsx               # React DOM entry point
|   +---.env                       # Web environment configuration
+---plans/                         # Build plan, PRD, MVP definition
+---agent-logs/                    # Development orchestration logs
```

## Commit History

```
5402363 Phase 3c: Loading skeletons + Toast notifications
52eb886 Phase 2b: Review screen + Status screen + Navigation / Phase 3b: Kanban + Dialog + Missed calls
0136506 Phase 2a: Firebase auth + Camera capture + API service / Phase 3a: Dashboard layout + API types
62cf953 Implement Phases 0-1: Foundation setup + Backend API
6e07b15 change of plan
4095b35 test...
059eb44 produced mvp md
bce4708 created plans folder
b5741fe removed researched-features
730ca8b updated prd
```

## License

MIT
