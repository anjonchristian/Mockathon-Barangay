# 1-Day Build Plan: e-Kap MVP

## Product Overview

**e-Kap** is a Barangay Management System with a "Zero-Typing" flow: a resident snaps their National ID or Barangay ID via an Expo mobile app, Gemini 2.5 Flash OCR extracts all fields, the user reviews/corrects on a split-screen, submits a Barangay ID request, and an admin processes it via a web Kanban dashboard.

**Architecture:** Monorepo with `app/` (Expo), `web/` (React+Vite), `backend/` (Express+TypeScript).

---

## MVP Scope (Strict — No Scope Creep)

The MVP is the **exact** end-to-end flow below and nothing more:

| # | Step | Where |
|---|------|-------|
| 1 | Open app → anonymous Firebase auth (zero-typing login) | `app/` |
| 2 | Take photo of National ID or Barangay ID | `app/` |
| 3 | POST image to `/api/ocr` → Gemini extracts name, address, birthdate, gender | `backend/` |
| 4 | Split-screen: ID photo (top) + auto-filled editable fields (bottom) | `app/` |
| 5 | User corrects errors, taps "Submit" | `app/` |
| 6 | POST to `/api/requests` → saved to MongoDB | `backend/` |
| 7 | Web admin fetches queue via `GET /api/requests` → renders Kanban | `web/` |
| 8 | Staff clicks "Approve" / "Reject" → `PATCH /api/requests/:id` | `web/` + `backend/` |

**Total target dwell time for senior user:** Under 45 seconds from camera snap to submission confirmation.

**Strictly excluded from this plan (post-MVP):** Voice dictation, chatbot, emergency alerts, e-Blotter, PSGC integration, multi-document types beyond Barangay ID request, WebRTC video calls (stretch goal only), push notifications, analytics, staff account management.

---

## Phase Breakdown

---

### Phase 0: Foundation & Dependency Setup

**Timeline: 1 hour**
**Agent:** Researcher (for npm/version lookups) + General (for installs)
**Skills to load:** `expo-tailwind-setup`, `tailwind-design-system`

#### Task 0.1 — Install backend dependencies
| Detail | Value |
|--------|-------|
| **Target** | `backend/` |
| **Packages** | `firebase-admin`, `@google/generative-ai`, `mongoose`, `cors`, `dotenv`, `multer` |
| **Dev packages** | `@types/cors`, `@types/multer` |
| **Commands** | `npm install firebase-admin @google/generative-ai mongoose cors dotenv multer` |
| **Time** | 10 min |
| **Deps** | None |

#### Task 0.2 — Install mobile app dependencies
| Detail | Value |
|--------|-------|
| **Target** | `app/` |
| **Packages** | `firebase`, `expo-camera`, `expo-file-system`, `expo-image-manipulator`, `axios`, `react-native-safe-area-context` |
| **Commands** | `npx expo install firebase expo-camera expo-file-system expo-image-manipulator axios react-native-safe-area-context` |
| **Time** | 10 min |
| **Deps** | None |

#### Task 0.3 — Install web dashboard dependencies
| Detail | Value |
|--------|-------|
| **Target** | `web/` |
| **Packages** | `axios`, `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite` |
| **Commands** | `npm install axios lucide-react class-variance-authority clsx tailwind-merge @tailwindcss/vite` |
| **Time** | 10 min |
| **Deps** | None |

#### Task 0.4 — Set up Tailwind CSS v4 in web (for shadcn/ui)
| Detail | Value |
|--------|-------|
| **Target** | `web/` |
| **Skill** | `tailwind-design-system` |
| **Actions** | 1. Create `web/src/index.css` with `@import "tailwindcss"` 2. Update `vite.config.ts` to add `@tailwindcss/vite` plugin 3. Remove old `web/src/App.css` 4. Verify `main.tsx` imports `index.css` |
| **Time** | 10 min |
| **Deps** | Task 0.3 |

#### Task 0.5 — Set up NativeWind + Tailwind in Expo app
| Detail | Value |
|--------|-------|
| **Target** | `app/` |
| **Skill** | `expo-tailwind-setup` |
| **Actions** | Follow the loaded skill to install nativewind, create `global.css`, update `app.json`/`metro.config.js`, and verify `App.tsx` uses a Tailwind class |
| **Time** | 10 min |
| **Deps** | Task 0.2 |

#### Task 0.6 — Initialize shadcn/ui in web workspace
| Detail | Value |
|--------|-------|
| **Target** | `web/` |
| **Skill** | `shadcn` |
| **Actions** | 1. Run `npx shadcn@latest init` (Yes to all defaults, use `@/` alias, neutral color, CSS variables) 2. Verify `web/components.json` and `web/src/lib/utils.ts` are created 3. Add core primitives: `npx shadcn@latest add button card badge dialog select table` |
| **Time** | 10 min |
| **Deps** | Task 0.4 |

#### Task 0.7 — Create `.env` files and Firebase config stubs
| Detail | Value |
|--------|-------|
| **Target** | All workspaces |
| **Actions** | 1. `backend/.env`: `PORT=3000`, `MONGODB_URI=mongodb://localhost:27017/ekap`, `FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json`, `GEMINI_API_KEY=` 2. `app/.env`: `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, etc. 3. `web/.env`: `VITE_API_URL=http://localhost:3000/api` 4. Add `.env` to root `.gitignore` |
| **Time** | 10 min |
| **Deps** | None |

---

### Phase 1: Backend API — Express Server, MongoDB, Gemini OCR

**Timeline: 2 hours**
**Agent:** General (backend-worker)
**Target directory:** `backend/`

#### Task 1.1 — MongoDB connection + Mongoose models

**Files to create:**
- `backend/src/config/db.ts` — Mongoose connection with retry logic
- `backend/src/models/BarangayIDRequest.ts` — Mongoose schema

**Schema contract — `BarangayIDRequest`:**
```typescript
{
  firebaseUid: string;          // From anonymous auth
  fullName: string;             // Required
  address: string;              // Required
  birthDate: string;            // "YYYY-MM-DD"
  gender: "Male" | "Female" | "Other";
  nationality: string;          // Default: "Filipino"
  idType: "national_id" | "barangay_id";
  idNumber: string;
  idPhotoBase64: string;        // Base64 of captured ID image
  status: "pending_review" | "approved" | "rejected";  // Default: pending_review
  staffNotes: string;           // Optional, filled on approve/reject
  createdAt: Date;
  updatedAt: Date;
}
```

**Time:** 20 min
**Deps:** Phase 0

#### Task 1.2 — POST `/api/ocr` — Gemini 2.5 Flash image extraction

**File to create:** `backend/src/routes/ocr.ts`

**Contract:**
```
POST /api/ocr
Content-Type: multipart/form-data
Body: { image: File (JPEG/PNG) }

Response 200:
{
  success: true,
  data: {
    fullName: "Juan Dela Cruz",
    address: "123 Rizal St., Brgy. San Jose, Manila",
    birthDate: "1990-01-15",
    gender: "Male",
    nationality: "Filipino",
    idNumber: "1234-5678-9012",
    idType: "national_id"
  }
}

Response 400:
{ success: false, error: "No image provided" }

Response 502:
{ success: false, error: "Gemini extraction failed" }
```

**System prompt for Gemini:**
```
You are an OCR assistant for Philippine government IDs. Extract the following fields 
as valid JSON (no markdown, no extra text). If a field is unreadable, return null for it.
Fields: fullName, address, birthDate (YYYY-MM-DD), gender (Male/Female/Other/null), 
nationality, idNumber, idType (national_id or barangay_id).
```

**Implementation notes:**
- Use multer with memoryStorage for file upload
- Send image buffer as `inlineData` with `mimeType: "image/jpeg"` to Gemini 1.5 Flash (not 2.5 — use the actual available model name)
- Parse Gemini response JSON, validate fields, return
- Cache identical images (base64 hash) to avoid re-hitting Gemini API

**Time:** 30 min
**Deps:** Task 1.1

#### Task 1.3 — CRUD: POST/GET/PATCH `/api/requests`

**File to create:** `backend/src/routes/requests.ts`

**Contracts:**

```
POST /api/requests
Body: { firebaseUid, fullName, address, birthDate, gender, nationality, idType, idNumber, idPhotoBase64 }
Response 201: { success: true, data: { _id, status, createdAt, ...full doc } }

GET /api/requests?status=pending_review&page=1&limit=20
Response 200: { success: true, data: [...], total: 42, page: 1, limit: 20 }

GET /api/requests/:id
Response 200: { success: true, data: { ...full doc } }

PATCH /api/requests/:id
Body: { status: "approved" | "rejected", staffNotes?: string }
Response 200: { success: true, data: { ...updated doc } }
```

**Implementation notes:**
- No auth middleware for MVP (skip Firebase ID token verification to save time — add comment for post-MVP)
- Use Express router, mount under `/api`
- Validate required fields on POST
- Return proper error codes

**Time:** 30 min
**Deps:** Task 1.1

#### Task 1.4 — WebSocket signaling server for WebRTC (stretch MVP)

**File to create:** `backend/src/ws.ts`

**Implementation notes:**
- Use `ws` library (install: `npm install ws`, `npm install -D @types/ws`)
- Simple WebSocket server on port 3001
- Handle `offer`, `answer`, `ice-candidate` message types
- Broadcast to connected admin clients
- 15s watchdog: if no `answer` received within 15s, emit `watchdog_timeout` to mobile client

**Time:** 20 min
**Deps:** Task 1.1

#### Task 1.5 — POST `/api/watchdog/missed-call` (15s fallback log)

**File to add to:** `backend/src/routes/requests.ts` or a new `backend/src/routes/watchdog.ts`

**Contract:**
```
POST /api/watchdog/missed-call
Body: { firebaseUid: string, requestedAt: string (ISO8601) }
Response 201: { success: true, data: { _id, ... } }
```

**Implementation notes:**
- Create a simple `MissedCallLog` model: `{ firebaseUid, requestedAt, createdAt }`
- Admin dashboard can fetch `GET /api/watchdog/missed-calls` to show unresolved calls

**Time:** 10 min
**Deps:** Task 1.1

#### Task 1.6 — Main server entry point assembly

**File to modify:** `backend/src/index.ts`

**Actions:**
1. Import and call `connectDB()`
2. Mount `ocrRouter` at `/api/ocr`
3. Mount `requestsRouter` at `/api/requests`
4. Mount `watchdogRouter` at `/api/watchdog`
5. Add CORS middleware (allow all origins for hackathon)
6. Add `express.json({ limit: '10mb' })` for large base64 payloads
7. Start WebSocket server (Task 1.4)

**Time:** 10 min
**Deps:** Tasks 1.1–1.5

---

Total Phase 1 estimate: 2 hours

---

### Phase 2: Mobile App — Camera Capture & OCR Submission

**Timeline: 2 hours**
**Agent:** General (frontend-worker)
**Target directory:** `app/`

#### Task 2.1 — Firebase anonymous auth on app launch

**File to create:** `app/src/services/firebase.ts`

```typescript
// Initialize Firebase with config from env
// Call signInAnonymously() on app start
// Export auth state and current user
```

**File to modify:** `app/App.tsx`
- Wrap app in `<AuthProvider>` or call `onAuthStateChanged` at root
- Show loading spinner while auth initializes

**Time:** 20 min
**Deps:** Phase 0 (firebase package installed)

#### Task 2.2 — Camera capture screen

**File to create:** `app/src/screens/CaptureScreen.tsx`

**UI:**
- Full-screen camera preview using `<CameraView>` from `expo-camera`
- Overlay with ID card frame guide (rectangle outline)
- Bottom "Capture ID" button (min 48dp height, high-contrast)
- After capture: show thumbnail preview + "Retake" / "Use Photo" buttons

**Implementation:**
- Request camera permissions
- Use `camera.takePictureAsync()` with `{ base64: true, quality: 0.7 }`
- Pass base64 to next screen via navigation params or context

**Time:** 40 min
**Deps:** Phase 0 (expo-camera installed), Task 2.1

#### Task 2.3 — API service layer

**File to create:** `app/src/services/api.ts`

```typescript
const API_BASE = "http://<YOUR_DEV_IP>:3000/api";

export async function extractOCR(imageBase64: string): Promise<OcrResult>
// POST /api/ocr with multipart form containing the image

export async function submitRequest(data: BarangayIDRequestPayload): Promise<RequestResult>
// POST /api/requests

export async function getRequestStatus(id: string): Promise<RequestResult>
// GET /api/requests/:id
```

**Implementation:**
- Use `axios` with `FormData` for OCR (sends actual JPEG, not base64 string)
- Use `axios` with JSON for submit
- Handle network errors gracefully

**Time:** 15 min
**Deps:** Task 1.2 (OCR endpoint exists)

#### Task 2.4 — Split-screen review screen

**File to create:** `app/src/screens/ReviewScreen.tsx`

**UI layout (vertical split):**
- **Top 40%:** ID photo thumbnail (from captured base64)
- **Bottom 60%:** Scrollable form fields with large labels/inputs:
  - Full Name (editable TextInput, fontSize 18, high contrast)
  - Address (editable TextInput, multiline)
  - Birth Date (editable TextInput, placeholder "YYYY-MM-DD")
  - Gender (editable TextInput or picker)
  - Nationality (editable TextInput, default "Filipino")
  - ID Number (editable, read-only style)
- **Bottom bar:** "Retake Photo" (secondary) + "Submit Request" (primary, green)

**Implementation:**
- Navigation receives `imageBase64` from CaptureScreen
- Call `extractOCR()` on mount (show loading skeleton)
- Auto-fill form fields from OCR response
- User taps "Submit" → calls `submitRequest()` → navigates to status screen

**Accessibility:**
- All touch targets >= 48dp
- Text size >= 16px, labels >= 18px
- High contrast (black on white/cream background)

**Time:** 40 min
**Deps:** Task 2.2, Task 2.3

#### Task 2.5 — Request status screen

**File to create:** `app/src/screens/StatusScreen.tsx`

**UI:**
- Large checkmark or "pending" icon
- "Your Barangay ID Request has been submitted!"
- Request ID displayed
- Current status badge (Pending Review)
- "Track Status" button → polls `GET /api/requests/:id`
- "Done" button → back to home

**Time:** 15 min
**Deps:** Task 2.4

#### Task 2.6 — Navigation setup

**File to create:** `app/src/navigation/AppNavigator.tsx`

**Implementation:**
- Install `@react-navigation/native` and `@react-navigation/native-stack`
- Create stack with: Capture → Review → Status
- Home screen is CaptureScreen for MVP
- No tabs, no drawer, no settings — just the core flow

**Packages:** `npm install @react-navigation/native @react-navigation/native-stack react-native-screens`

**Time:** 10 min
**Deps:** Tasks 2.2, 2.4, 2.5

---

Total Phase 2 estimate: 2 hours

---

### Phase 3: Web Admin Dashboard — Kanban & Request Processing

**Timeline: 2.5 hours**
**Agent:** General (frontend-worker)
**Skill to load:** `tailwind-design-system`, `vercel-react-best-practices`, `shadcn`
**Target directory:** `web/`

#### Task 3.1 — Dashboard layout shell

**File to create:** `web/src/App.tsx` (replace existing)

**UI:**
- Top navbar: "e-Kap Admin" logo/text + request count badge
- Main content area with flex layout
- Three Kanban columns side by side: Pending Review | Approved | Rejected
- Responsive: stack vertically on narrow screens

**Implementation:**
- Use shadcn `Card` components for column containers
- Use CSS Grid or flexbox for columns
- Clean, minimal layout

**Time:** 20 min
**Deps:** Phase 0 (shadcn initialized)

#### Task 3.2 — API service + type definitions

**File to create:** `web/src/lib/api.ts`

```typescript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface BarangayIDRequest {
  _id: string;
  firebaseUid: string;
  fullName: string;
  address: string;
  birthDate: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  idPhotoBase64: string;  // base64 JPEG
  status: "pending_review" | "approved" | "rejected";
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchRequests(status?: string): Promise<BarangayIDRequest[]>
// GET /api/requests?status=<status>&limit=50

export async function updateRequestStatus(id: string, status: string, notes?: string): Promise<BarangayIDRequest>
// PATCH /api/requests/:id { status, staffNotes }
```

**Time:** 10 min
**Deps:** Phase 0

#### Task 3.3 — Kanban column components

**Files to create:**
- `web/src/components/KanbanColumn.tsx`
- `web/src/components/RequestCard.tsx`

**KanbanColumn props:** `title: string`, `status: string`, `requests: BarangayIDRequest[]`, `onStatusChange: (id, newStatus, notes) => void`

**RequestCard props:** `request: BarangayIDRequest`, `onApprove: () => void`, `onReject: () => void`

**Implementation:**
- RequestCard shows: fullName (bold), address (truncated), createdAt (relative time), status badge (colored)
- Card uses shadcn `Card` component
- Clicking card opens detail dialog (Task 3.4)
- "Approve" / "Reject" buttons on each card (or in detail dialog)
- Use `lucide-react` icons (CheckCircle, XCircle, Clock)

**Time:** 40 min
**Deps:** Task 3.2

#### Task 3.4 — Request detail dialog

**File to create:** `web/src/components/RequestDetailDialog.tsx`

**UI (uses shadcn Dialog component):**
- Left: ID photo displayed from base64 (max 300px wide)
- Right: All fields displayed as read-only text
  - Full Name, Address, Birth Date, Gender, Nationality, ID Number, ID Type
- Bottom action bar:
  - "Approve" button (green)
  - "Reject" button (red) with optional notes textarea
  - "Close" button

**Implementation:**
- Use `@radix-ui/react-dialog` via shadcn's `Dialog`
- Large readable text (16px+)
- Notes field appears when "Reject" is first clicked (confirmation step)
- After action: close dialog, refresh Kanban

**Time:** 40 min
**Deps:** Task 3.2

#### Task 3.5 — Missed calls panel (watchdog log)

**File to create:** `web/src/components/MissedCallsPanel.tsx`

**UI:**
- Collapsible panel or sidebar section
- Lists missed call entries from `GET /api/watchdog/missed-calls`
- Each entry: firebaseUid, requestedAt timestamp
- "Dismiss" button

**Time:** 15 min
**Deps:** Task 1.5, Task 3.1

#### Task 3.6 — Auto-polling + state management

**File to modify:** `web/src/App.tsx`

**Implementation:**
- Use `useState` + `useEffect` for request list state
- `setInterval(fetchRequests, 5000)` — polls every 5s for new requests
- After approve/reject: immediately refetch
- Show simple loading state and empty states ("No pending requests 🎉")

**Time:** 15 min
**Deps:** Tasks 3.1–3.5

#### Task 3.7 — Edge: error states, loading skeletons

**Files to modify:** `web/src/App.tsx`, `web/src/components/KanbanColumn.tsx`

**Implementation:**
- Add loading skeleton cards (shadcn `Skeleton` component: `npx shadcn@latest add skeleton`)
- Show toast on error (shadcn `Toast` / `Sonner`: `npm install sonner`)
- Empty state illustrations for each column
- Network error banner

**Time:** 10 min
**Deps:** Task 3.6

---

Total Phase 3 estimate: 2.5 hours

---

### Phase 4: Integration, Testing & Polish

**Timeline: 1.5 hours**
**Agent:** Project Manager (orchestrate) + General (fixes)

#### Task 4.1 — End-to-end dry run

**Actions:**
1. Start MongoDB: `mongod` (or use `mongosh` to verify connection)
2. Start backend: `cd backend && npm run dev`
3. Start web: `cd web && npm run dev`
4. Start app: `cd app && npx expo start`
5. Run through full flow: Open app → Capture ID → OCR → Review → Submit → Admin sees request → Approve → Verify

**Fix any issues found:**
- CORS errors → fix backend CORS config
- Image upload failures → fix multer config
- Navigation crashes → fix route params
- API URL mismatches → fix `.env` values

**Time:** 45 min
**Deps:** All phases 1–3

#### Task 4.2 — Stopwatch test

**Actions:**
1. Prepare 3 test ID images (printed on paper or on another screen)
2. From camera snap to submission confirmation: measure time
3. Must be under 45 seconds per the PRD goal
4. If over: optimize image compression (reduce quality to 0.5), parallelize OCR call with loading UI

**Time:** 15 min
**Deps:** Task 4.1

#### Task 4.3 — Gemini rate-limit caching

**File to modify:** `backend/src/routes/ocr.ts`

**Implementation:**
- Before calling Gemini, compute SHA-256 hash of the image buffer
- Check MongoDB `OcrCache` collection for existing result
- If exists, return cached result immediately
- If not, call Gemini and save to cache

**Create:** `backend/src/models/OcrCache.ts`
```typescript
{ imageHash: string (indexed), result: object, createdAt: Date (TTL index: 1 hour) }
```

**Time:** 15 min
**Deps:** Task 4.1

#### Task 4.4 — Final README update for hackathon demo

**File to create/modify:** `plans/1day-build-plan.md` (this file) → no, create `README.md` at root

**Content:**
- Project name and one-liner
- Architecture diagram (ASCII art)
- Setup instructions (4 steps)
- Demo flow description
- Tech stack badges

**Time:** 15 min
**Deps:** Task 4.1

---

Total Phase 4 estimate: 1.5 hours

---

## Summary Timeline

| Phase | Name | Time | Start | End |
|-------|------|------|-------|-----|
| 0 | Foundation & Deps | 1h | 09:00 | 10:00 |
| 1 | Backend API | 2h | 10:00 | 12:00 |
| 2 | Mobile App Core | 2h | 13:00 | 15:00 |
| 3 | Web Admin Dashboard | 2.5h | 15:00 | 17:30 |
| 4 | Integration & Polish | 1.5h | 17:30 | 19:00 |
| **Total** | | **9h** | 09:00 | 19:00 |

---

## Complete File Manifest

### Backend (`backend/`)
| File | Action | Task |
|------|--------|------|
| `src/index.ts` | Modify | 1.6 |
| `src/config/db.ts` | Create | 1.1 |
| `src/models/BarangayIDRequest.ts` | Create | 1.1 |
| `src/models/OcrCache.ts` | Create | 4.3 |
| `src/models/MissedCallLog.ts` | Create | 1.5 |
| `src/routes/ocr.ts` | Create | 1.2 |
| `src/routes/requests.ts` | Create | 1.3 |
| `src/routes/watchdog.ts` | Create | 1.5 |
| `src/ws.ts` | Create | 1.4 |
| `.env` | Create | 0.7 |
| `package.json` | Modify | 0.1 |

### Mobile App (`app/`)
| File | Action | Task |
|------|--------|------|
| `App.tsx` | Modify | 2.1 |
| `src/services/firebase.ts` | Create | 2.1 |
| `src/services/api.ts` | Create | 2.3 |
| `src/screens/CaptureScreen.tsx` | Create | 2.2 |
| `src/screens/ReviewScreen.tsx` | Create | 2.4 |
| `src/screens/StatusScreen.tsx` | Create | 2.5 |
| `src/navigation/AppNavigator.tsx` | Create | 2.6 |
| `.env` | Create | 0.7 |
| `package.json` | Modify | 0.2 |

### Web Dashboard (`web/`)
| File | Action | Task |
|------|--------|------|
| `src/App.tsx` | Rewrite | 3.1, 3.6 |
| `src/index.css` | Rewrite | 0.4 |
| `src/lib/api.ts` | Create | 3.2 |
| `src/lib/utils.ts` | Created by shadcn init | 0.6 |
| `src/components/KanbanColumn.tsx` | Create | 3.3 |
| `src/components/RequestCard.tsx` | Create | 3.3 |
| `src/components/RequestDetailDialog.tsx` | Create | 3.4 |
| `src/components/MissedCallsPanel.tsx` | Create | 3.5 |
| `vite.config.ts` | Modify | 0.4 |
| `.env` | Create | 0.7 |
| `package.json` | Modify | 0.3 |

---

## Dependency Graph (for parallel execution)

```
Phase 0
  ├── 0.1 (backend deps)
  ├── 0.2 (app deps)
  ├── 0.3 (web deps)
  ├── 0.4 (web tailwind) ── depends on 0.3
  ├── 0.5 (app nativewind) ── depends on 0.2
  ├── 0.6 (shadcn init) ── depends on 0.4
  └── 0.7 (env files) ── independent

Phase 1 ── depends on Phase 0
  ├── 1.1 (mongoose models) ── depends on 0.1
  ├── 1.2 (ocr route) ── depends on 0.1, 1.1
  ├── 1.3 (requests CRUD) ── depends on 0.1, 1.1
  ├── 1.4 (websocket) ── depends on 0.1
  ├── 1.5 (watchdog route) ── depends on 0.1, 1.1
  └── 1.6 (assemble index.ts) ── depends on 1.1-1.5

Phase 2 ── depends on Phase 0, can run parallel with Phase 1
  ├── 2.1 (firebase auth) ── depends on 0.2
  ├── 2.2 (camera screen) ── depends on 0.2
  ├── 2.3 (api service) ── depends on 1.2, 1.3 (needs contract only)
  ├── 2.4 (review screen) ── depends on 2.2, 2.3
  ├── 2.5 (status screen) ── depends on 2.3
  └── 2.6 (navigation) ── depends on 2.2, 2.4, 2.5

Phase 3 ── depends on Phase 0 + Phase 1, can run parallel with Phase 2
  ├── 3.1 (layout shell) ── depends on 0.6
  ├── 3.2 (api types) ── depends on 0.6
  ├── 3.3 (kanban components) ── depends on 3.1, 3.2
  ├── 3.4 (detail dialog) ── depends on 3.1, 3.2
  ├── 3.5 (missed calls panel) ── depends on 1.5, 3.1
  ├── 3.6 (polling) ── depends on 3.3, 3.4
  └── 3.7 (error states) ── depends on 3.6

Phase 4 ── depends on all phases
  ├── 4.1 (E2E dry run)
  ├── 4.2 (stopwatch test)
  ├── 4.3 (rate-limit cache)
  └── 4.4 (README)
```

**Parallelization strategy:**
- Phase 0 tasks can be done in parallel (different workspaces)
- Phase 1 (backend) and Phase 2 (mobile app) can run in parallel once Phase 0 is done — the API contracts are known upfront
- Phase 3 (web) can also start in parallel with Phase 2 once Phase 0 is done
- Phase 4 is fully sequential (must have all pieces)

---

## Stretch Goals (if ahead of schedule)

| Goal | Effort | Description |
|------|--------|-------------|
| WebRTC video call | 1h | Connect mobile + web via WebSocket signaling + `RTCPeerConnection` |
| 15s watchdog UX | 30m | Show "No staff available" alert + auto-submit request via fallback |
| PSGC dropdown | 30m | Replace address text input with Region→Province→City→Barangay select from PSGC API |
| Loading skeletons | 15m | Add `npx shadcn@latest add skeleton` to web for polished loading UX |

---

## Out of Scope (Post-MVP)

- Voice-to-text dictation
- Gemini chatbot/concierge
- e-Blotter / incident reporting
- Emergency alerts / push notifications
- Multi-document types (clearance, indigency)
- Staff account management & RBAC
- Analytics & audit logs
- PSGC integration (unless stretch)
- Production deployment / CI/CD
- End-to-end encryption
- Offline-first support (beyond watchdog)
