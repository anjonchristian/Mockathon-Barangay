# Development Plan: e-Kap MVP

> **Project:** e-Kap — A Monorepo Cloud-Based Barangay Management and Citizen Service Portal
> **Hackathon:** Mockathon
> **Timeline:** 10 Days

---

## 1. MVP Goal & Core Hypothesis

### Goal
Build a **functional end-to-end prototype** that validates whether multimodal AI extraction (Gemini 2.5 Flash OCR) combined with accessible mobile-first UI can eliminate the typing barrier for elderly/senior citizens when requesting a Barangay ID document.

### Target Users (MVP Scope)
- **Resident ("Lolo Jaime", Age 68):** A senior citizen with a budget smartphone, low visual acuity, and extreme friction with typing on mobile keyboards.
- **Barangay Secretary ("Ana", Age 26):** A single administrative staff member processing document requests, managing escalations, and reviewing missed connections through a web dashboard.

### Primary Hypothesis
> By leveraging **Gemini 2.5 Flash** to extract name and address from a physical Barangay ID photo, we bypass manual keyboard input and reduce document request submission time from **3+ minutes to under 45 seconds**.

### Secondary Hypothesis
> A **15-second client-side watchdog** allows WebRTC call failures to gracefully degrade into an async HTTP logging channel, ensuring citizen requests are never lost even when no staff is online.

### Success Metrics
| Metric | Target |
|---|---|
| Submission time (camera snap → checkout) | ≤ 45 seconds for ≥ 85% of attempts |
| Gemini OCR field accuracy | ≥ 90% valid JSON extraction on baseline test cards |
| WebRTC graceful degradation | 100% of unanswered calls → persistent DB row in missed-call registry |

---

## 2. Development Phases Overview

| Phase | Days | Theme | Primary Deliverable |
|---|---|---|---|
| **Phase 1** | 1–3 | Foundations, Storage & Intelligent Intake | Backend API + Expo auth + Gemini OCR endpoint + camera capture |
| **Phase 2** | 4–7 | Split Viewports, Web Tables & Real-Time Media | App review UI + ID issuance flow + Web admin Kanban + WebRTC signaling |
| **Phase 3** | 8–10 | Watchdog Fallbacks, Accessibility & Launch | 15s fallback timer + missed-call dashboard + accessibility audit + E2E tests |

---

## 3. Phase 1: Foundations, Storage & Intelligent Intake (Days 1–3)

### Objective
Establish the entire infrastructure backbone: bootstrapped monorepo, MongoDB schema, Firebase Auth, Gemini OCR pipeline, and the camera intake screen on the mobile app.

### 3.1 Task Inventory

#### T1.1 — Monorepo Workspace & Tooling Configuration
| Field | Value |
|---|---|
| **Target dir** | `/` (root) |
| **Dependencies** | None |
| **Skills** | None (basic config) |
| **Sub-agent type** | `backend-worker` (for configs), `frontend-worker` (for client configs) |

**Actions:**
- Verify all three `package.json` files have correct project names (`e-kap-web`, `e-kap-app`, `e-kap-backend`)
- Add shared root-level scripts (dev, build, lint) or a root `package.json` with workspaces config if desired
- Remove boilerplate files from `web/` (e.g., `App.css`, stray `.oxlintrc.json` if unused) and `app/` (stray `LICENSE`)
- Standardize TypeScript configs: verify `backend/tsconfig.json` uses `moduleResolution: "bundler"`, `app/tsconfig.json` extends `expo/tsconfig.base`
- Add `.env.example` file at root documenting required env vars (see T1.6, T1.7)

**Acceptance Criteria:**
- `npm run dev` (or equivalent) works in each sub-directory without errors
- TypeScript compiles cleanly in all three directories
- Root directory is clean and organized

---

#### T1.2 — Backend Express Bootstrapping & Middleware
| Field | Value |
|---|---|
| **Target dir** | `backend/` |
| **Dependencies** | T1.1 |
| **Skills** | `workers-best-practices` (Express patterns) |
| **Sub-agent type** | `backend-worker` |

**Actions:**
- Add required dependencies: `cors`, `dotenv`, `helmet`, `express-rate-limit`, `socket.io`, `mongodb` / `mongoose`
- Add dev dependencies: `@types/cors`, `@types/helmet` (if needed)
- Restructure `backend/src/index.ts` into modular architecture:
  - `src/index.ts` — App entry, middleware mounting
  - `src/config/` — Env config, DB connection
  - `src/routes/` — API route definitions
  - `src/controllers/` — Business logic
  - `src/models/` — Mongoose schemas
  - `src/middleware/` — Rate limiting, error handling, auth verification
  - `src/services/` — Gemini API client, Firebase admin helpers
- Wire up CORS (allow `app` and `web` origins), JSON body parsing (with size limit), Helmet security headers
- Add global error-handling middleware
- Add `express-rate-limit` on `/api/*` routes (e.g., 30 req/min per IP)
- Verify server starts and responds at `GET /api/health`

**Acceptance Criteria:**
- `GET /api/health` returns `{ status: "ok", timestamp: ... }`
- CORS headers are present on cross-origin requests
- Rate limiter blocks >30 req/min with 429 status
- Helmet security headers (`X-Content-Type-Options`, etc.) present

---

#### T1.3 — MongoDB Connection & Data Models
| Field | Value |
|---|---|
| **Target dir** | `backend/` |
| **Dependencies** | T1.2 |
| **Skills** | `workers-best-practices` |
| **Sub-agent type** | `backend-worker` |

**Actions:**
- Install `mongoose` if not already done
- Create `src/config/database.ts` — MongoDB connection with retry logic
- Create Mongoose schemas:
  - **`User` model** (`src/models/User.ts`):
    - `firebaseUid` (String, unique, indexed)
    - `name` (String)
    - `address` (String)
    - `barangay` (String)
    - `phone` (String, optional)
    - `idPhotoUrl` (String — Firebase Storage URL)
    - `createdAt`, `updatedAt` (timestamps)
  - **`DocumentRequest` model** (`src/models/DocumentRequest.ts`):
    - `userId` (ObjectId, ref User)
    - `type` (String, enum: `['barangay_id']` initially — extendable)
    - `status` (String, enum: `['pending_review', 'processing', 'ready_for_pickup', 'completed', 'rejected']`, default `pending_review`)
    - `extractedData` (Mixed — raw JSON from Gemini)
    - `sourcePhotoUrl` (String)
    - `staffNotes` (String, optional)
    - `rejectionReason` (String, optional)
    - `createdAt`, `updatedAt` (timestamps)
  - **`BlotterReport` model** (`src/models/BlotterReport.ts`) — placeholder for Phase 2 integration:
    - `userId` (ObjectId, ref User)
    - `incidentType` (String)
    - `narrative` (String)
    - `mediaUrls` ([String])
    - `status` (String, enum: `['under_review', 'scheduled_mediation', 'resolved', 'escalated']`)
  - **`MissedCall` model** (`src/models/MissedCall.ts`):
    - `userId` (ObjectId, ref User)
    - `userName` (String)
    - `timestamp` (Date, default now)
    - `acknowledged` (Boolean, default false)
- Add indexes for common queries (status + createdAt for document queue)

**Acceptance Criteria:**
- `npm run dev` starts without connection errors
- Mongoose connects to local MongoDB instance (connection string from `.env`)
- All schemas compile correctly (no validation errors)
- Indexes are created on collection creation

---

#### T1.4 — Firebase Admin SDK Setup (Backend)
| Field | Value |
|---|---|
| **Target dir** | `backend/` |
| **Dependencies** | T1.2 |
| **Skills** | `workers-best-practices` |
| **Sub-agent type** | `backend-worker` |

**Actions:**
- Install `firebase-admin`
- Create `src/services/firebase.ts` — Firebase Admin initialization from service account env var
- Create `src/middleware/authMiddleware.ts`:
  - Extract Bearer token from `Authorization` header
  - Verify with `admin.auth().verifyIdToken(token)`
  - Attach `req.user = { uid, phoneNumber, ... }` to request
  - Export middleware for use on protected routes
- Create `src/middleware/optionalAuth.ts` — similar but does not reject if no token (for anonymous->upgraded flows)

**Acceptance Criteria:**
- Firebase Admin initializes without error
- Protected route returns 401 if no token
- Protected route returns 200 with `req.user` if valid token
- Test with a Firebase-issued ID token (from Expo client later)

---

#### T1.5 — Expo App: NativeWind/Tailwind Setup
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T1.1 |
| **Skills** | `expo-tailwind-setup`, `expo-dev-client` (for mobile testing) |
| **Sub-agent type** | `frontend-worker` (Expo specialist) |

**Actions:**
- Load the `expo-tailwind-setup` skill and follow its installation instructions exactly:
  - `npx expo install tailwindcss@^4 nativewind@5.0.0-preview.2 react-native-css@0.0.0-nightly.5ce6396 @tailwindcss/postcss tailwind-merge clsx`
  - Add `"resolutions": { "lightningcss": "1.30.1" }` to `app/package.json`
- Create `metro.config.js` with `withNativewind` wrapper
- Create `postcss.config.mjs` with `@tailwindcss/postcss` plugin
- Create `src/global.css` with Tailwind v4 imports and platform-specific font families
- Create `src/tw/` directory with CSS-wrapped components:
  - `src/tw/index.tsx` — View, Text, Pressable, ScrollView, TextInput, TouchableHighlight
  - `src/tw/image.tsx` — Image with CSS support
  - `src/tw/animated.tsx` — Animated.View wrapper
- Verify Tailwind classes render correctly in a test component
- Load the `expo-dev-client` skill if physical device testing is needed

**Acceptance Criteria:**
- `npx expo start` runs without errors
- A test `<View className="flex-1 bg-blue-500"><Text className="text-white">Hello</Text></View>` renders with blue background and white text
- TypeScript compiles without errors for the new `@/tw` imports

---

#### T1.6 — Firebase Anonymous Auth in Expo App
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T1.5 |
| **Skills** | `expo-dev-client` (if using native Firebase SDK) |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- Install Firebase JS SDK: `npx expo install firebase`
- Create `src/services/firebase.ts`:
  - Initialize Firebase app with config from environment (use `expo-constants` for `extra` config)
  - Export `auth` instance
- Create `src/hooks/useAuth.ts`:
  - On app cold-start, call `signInAnonymously(auth)` 
  - Store the resulting `user` object and `idToken` in React context
  - Expose `user`, `idToken`, `isLoading`, `signOut` from context
- Wrap the app root in `<AuthProvider>` from the hook
- On each API call, attach `Authorization: Bearer <idToken>` header
- Show a loading/splash screen during anonymous auth initialization

**Acceptance Criteria:**
- On first app launch, anonymous auth fires automatically without user interaction
- Token is retrievable via context in any screen
- Token can be verified by backend middleware (T1.4)
- Splash/loading state shown during auth (no blank screen)

---

#### T1.7 — Gemini 2.5 Flash OCR API Endpoint
| Field | Value |
|---|---|
| **Target dir** | `backend/` |
| **Dependencies** | T1.2, T1.3 |
| **Skills** | `workers-best-practices` |
| **Sub-agent type** | `backend-worker` |

**Actions:**
- Install `@google/generative-ai` SDK
- Create `src/services/gemini.ts`:
  - Initialize `GoogleGenerativeAI` with API key from env
  - Create a helper `extractIdData(imageBuffer: Buffer): Promise<ExtractedData>`:
    - Build a strict system prompt instructing Gemini 2.5 Flash to:
      - Extract `name` (full name from ID card)
      - Extract `address` (complete address string)
      - Extract `barangay` (specific barangay name)
      - Return ONLY valid JSON: `{ "name": "...", "address": "...", "barangay": "..." }`
      - If text is illegible, return `{ "name": null, "address": null, "barangay": null, "error": "Illegible image" }`
    - Pass image as `inlineData` with MIME type `image/jpeg` or `image/png`
    - Parse and validate the response JSON
    - Return typed `ExtractedData` object
- Create `src/controllers/ocrController.ts`:
  - `POST /api/ocr/extract` — accepts multipart form with image file
  - Validate file is present and is an image (MIME check)
  - Call `extractIdData()`
  - Return `{ success: true, data: ExtractedData }` or `{ success: false, error: string }`
- Create `src/routes/ocrRoutes.ts` and mount at `/api/ocr`
- Add **caching middleware** (MVP risk mitigation):
  - Before calling Gemini, check if an identical image hash exists in a `GeminiCache` collection
  - If cached, return cached result immediately
  - If not, call Gemini, store result + hash, then return

**Acceptance Criteria:**
- `POST /api/ocr/extract` with a valid ID image returns parsed JSON with name, address, barangay
- `POST /api/ocr/extract` with an invalid image returns `{ success: false, error }`
- Identical images served from cache on second request (measure latency <100ms)
- Rate-limited to prevent API credit exhaustion (via T1.2 middleware)

---

#### T1.8 — Camera Capture Screen (Expo App)
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T1.5, T1.6 |
| **Skills** | `expo-dev-client` (camera requires native module not in Expo Go) |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- Install `expo-camera`: `npx expo install expo-camera`
- Create `src/screens/CaptureScreen.tsx`:
  - Full-screen camera preview using `<CameraView>` with `facing="back"` 
  - Overlay guide frame (rectangle outline matching ID card dimensions ratio ~1.58:1)
  - "Capture ID" bottom button (min 48x48dp tap target)
  - Permission request handling (camera + storage)
  - On capture:
    - Take photo using `camera.takePictureAsync()` (JPEG, quality 0.8)
    - Show loading indicator
    - Call `POST /api/ocr/extract` with the image
    - On success: navigate to `ReviewScreen` (T2.1) with extracted data + photo URI
    - On failure: show error message with "Retake" button
- Create basic navigation structure: `src/navigation/AppNavigator.tsx` with a simple stack:
  - `Capture` → `Review` → `Confirm`

**Acceptance Criteria:**
- Camera preview renders with overlay guide
- Taking a photo triggers the OCR API call
- Success navigates to Review screen with data
- Failure shows retry option
- All tap targets ≥ 48x48dp

---

#### T1.9 — Registration/Profile Creation Flow
| Field | Value |
|---|---|
| **Target dir** | `app/` + `backend/` |
| **Dependencies** | T1.6, T1.7, T1.8 |
| **Skills** | `expo-tailwind-setup` (for styling) |
| **Sub-agent type** | `frontend-worker` + `backend-worker` |

**Actions (Backend):**
- Create `src/controllers/userController.ts`:
  - `POST /api/users/register` — creates User in MongoDB using extracted OCR data
    - Body: `{ firebaseUid, name, address, barangay, idPhotoUrl }`
    - Validates required fields
    - Returns created user object
  - `GET /api/users/me` — returns current user by Firebase UID (from auth middleware)
- Create `src/routes/userRoutes.ts` and mount at `/api/users`

**Actions (App):**
- After OCR extraction on CaptureScreen, navigate to `ReviewScreen` pre-filled with extracted data
- `ReviewScreen`:
  - Display extracted name, address, barangay in read-only fields
  - Allow minor corrections via editable text fields (for typos)
  - "Looks Good" button → calls `POST /api/users/register` with extracted data + photo URL
  - On success: navigate to DocumentRequestScreen (T2.2)
  - On failure: show error + retry
- Store photo temporarily (in-memory or local file cache) for upload

**Acceptance Criteria:**
- User can capture an ID, review extracted data, and register in <45 seconds
- Created user record appears in MongoDB with correct fields
- `GET /api/users/me` returns the user document when authenticated
- Editable fields allow correction of OCR mistakes

---

### 3.2 Phase 1 Integration Points

| Integration | Source | Target | Protocol |
|---|---|---|---|
| Auth token exchange | `app/` → `backend/` | Firebase Auth → Backend | Bearer token in `Authorization` header |
| OCR image extraction | `app/` → `backend/` | Camera → `/api/ocr/extract` | HTTP POST multipart |
| User registration | `app/` → `backend/` | ReviewScreen → `/api/users/register` | HTTP POST JSON |

### 3.3 Phase 1 Testing Strategy

| Test | Method | Pass Criteria |
|---|---|---|
| Health endpoint | `curl GET /api/health` | Returns 200 `{ status: "ok" }` |
| Camera permission | Launch app on device | Prompt appears; app works after grant |
| OCR with real ID | Hold physical ID up to camera | Extracted name/address match ID within 90% accuracy |
| OCR with blurry image | Capture out-of-focus image | Returns `{ success: false }` gracefully |
| OCR caching | Send same image twice | Second request <100ms (MongoDB cache hit) |
| Anonymous auth | Cold-launch app with airplane mode | Auth fails gracefully, shows retry |
| Registration E2E | Full camera → OCR → register flow | User doc created in MongoDB, <45s total |
| Rate limiting | Hit `/api/ocr/extract` 31+ times in 1 min | 429 on 31st request |

---

## 4. Phase 2: Split Viewports, Web Tables & Real-Time Media Lanes (Days 4–7)

### Objective
Build the core user-facing features: the hybrid split-screen review + document submission flow in the mobile app, the admin Kanban dashboard in the web app, and the real-time WebRTC audio/video channel with signaling server.

### 4.1 Task Inventory

#### T2.1 — Hybrid Split-Screen Review Component
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T1.8, T1.9 |
| **Skills** | `expo-tailwind-setup`, `tailwind-design-system` |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- Create `src/components/SplitScreenReview.tsx`:
  - **Top half:** Cropped ID source snapshot displayed at high resolution
    - Pinch-to-zoom gesture for detailed inspection
    - "Retake Photo" safety button (returns to camera)
  - **Bottom half:** Editable text fields with large, high-contrast inputs
    - Name field (fontSize ≥ 18px, high contrast border)
    - Address field (fontSize ≥ 18px, multiline)
    - Barangay field (fontSize ≥ 18px)
    - Each field has a visible label above it (not as placeholder)
  - **Divider:** A visual handle/separator between the two halves
  - **Footer:** 
    - "Looks Good — Submit Request" button (primary, large, min 56px height)
    - Processing status indicator (spinner or progress bar)
- Component should scroll vertically if content exceeds viewport
- All touch targets ≥ 48x48dp

**Acceptance Criteria:**
- Top half shows the captured photo clearly
- Bottom half text fields are pre-filled from OCR
- Users can edit any field by tapping
- "Retake Photo" navigates back to CaptureScreen
- "Looks Good" button is prominent and easy to tap
- Split layout renders correctly on small screens (320px width minimum)

---

#### T2.2 — Barangay ID Issuance Pipeline (App)
| Field | Value |
|---|---|
| **Target dir** | `app/` + `backend/` |
| **Dependencies** | T2.1, T1.9 |
| **Skills** | `expo-tailwind-setup` |
| **Sub-agent type** | `frontend-worker` + `backend-worker` |

**Actions (Backend):**
- Create `src/controllers/documentController.ts`:
  - `POST /api/documents/request` — creates a new DocumentRequest
    - Body: `{ userId, type: 'barangay_id', extractedData, sourcePhotoUrl }`
    - Validates user exists
    - Returns created document with status `pending_review`
  - `GET /api/documents/my-requests` — returns all documents for the authenticated user
  - `GET /api/documents/:id` — returns single document details
- Create `src/routes/documentRoutes.ts` and mount at `/api/documents`

**Actions (App):**
- Create `src/screens/RequestConfirmationScreen.tsx`:
  - After user taps "Looks Good" on SplitScreenReview:
    - Show a brief processing animation
    - Call `POST /api/documents/request` with the data
  - On success:
    - Show success confirmation screen with:
      - Checkmark animation
      - "Your Barangay ID request has been submitted!"
      - Status: "Pending Review"
      - Tracking number / Request ID
      - "Track Status" button → navigates to status screen
      - "Request Another" button → navigates back to CaptureScreen
  - On failure:
    - Show error with retry option
- Create `src/screens/TrackStatusScreen.tsx`:
  - Fetch documents from `GET /api/documents/my-requests`
  - Display list of submitted requests with status badges
  - Simple, accessible list layout

**Acceptance Criteria:**
- Complete flow: Capture → OCR → Review → Submit → Confirmation works
- Document appears in MongoDB with correct user, data, and source photo
- Status tracking screen shows the submitted document
- API validation rejects requests without required fields

---

#### T2.3 — Admin Workspace: Kanban + Document Queue (Web)
| Field | Value |
|---|---|
| **Target dir** | `web/` |
| **Dependencies** | T2.2 (API exists) |
| **Skills** | `shadcn`, `tailwind-design-system`, `vercel-react-best-practices` |
| **Sub-agent type** | `frontend-worker` (web specialist) |

**Actions:**
- **Initialize shadcn/ui in web project:**
  - Run `npx shadcn@latest init` inside `web/` with `base-nova` preset for Vite
  - Install core components: `npx shadcn@latest add card table badge button dialog select sonner tabs`
- **Build backend endpoints for admin:**
  - Add to `documentController.ts`:
    - `GET /api/admin/documents` — returns all documents (staff access, paginated)
    - `PATCH /api/admin/documents/:id/status` — updates document status
      - Body: `{ status: 'processing' | 'ready_for_pickup' | 'completed' | 'rejected', rejectionReason?: string }`
    - `GET /api/admin/documents/stats` — returns counts by status
  - Add admin auth middleware (checks Firebase UID is in admin list env var)
- **Build AdminDashboard layout:**
  - Create `src/pages/Dashboard.tsx`:
    - Sidebar with navigation items
    - Main content area
  - Create `src/pages/DocumentQueue.tsx`:
    - **Kanban-style columns** using Card components:
      - `Pending Review` column
      - `Processing` column
      - `Ready for Pickup` column
      - `Completed` column
    - Each card shows: resident name, request type, timestamp, thumbnail of source photo
    - Drag-to-next-column (or use dropdown select for status change)
    - Click on card → open detail dialog
  - Create `src/components/DocumentDetailDialog.tsx`:
    - Shows full extracted data, source photo, request history
    - Status change buttons (Approve → Processing, Mark Ready, Complete)
    - Rejection flow: textarea for reason + "Reject" button
  - Create `src/services/api.ts` — Axios instance with base URL from env
    - Attaches Firebase auth token from localStorage (staff logs in manually)
  - Add authentication for staff:
    - Staff login page using shadcn `Card` + `Input` + `Button`
    - Firebase Email/Password auth (or just hardcoded bypass for MVP)
    - Store token in localStorage

**Acceptance Criteria:**
- Admin can log in and see all document requests in a Kanban layout
- Clicking a card shows full details in a dialog
- Moving a card to another status updates the document in MongoDB
- Rejection flow shows a reason textarea and updates status to `rejected`
- The interface is responsive (works on tablet-sized screens)
- shadcn components render with correct styling (semantic colors, proper composition)

---

#### T2.4 — WebRTC Signaling Server (Backend)
| Field | Value |
|---|---|
| **Target dir** | `backend/` |
| **Dependencies** | T1.2 |
| **Skills** | `workers-best-practices` |
| **Sub-agent type** | `backend-worker` |

**Actions:**
- Install `socket.io` (already added in T1.2) and `@types/socket.io`
- Create `src/services/signaling.ts` — Socket.IO server setup:
  - Mount Socket.IO on the same HTTP server (or a separate port)
  - **Namespace:** `/webrtc`
  - **Events:**
    - `join:staff` — Staff dashboard joins with `{ staffId }`
    - `join:resident` — Mobile client joins with `{ userId }`
    - `request:call` — Resident requests a call → server broadcasts to all staff
    - `staff:accept` — Staff accepts call → server emits to the specific resident
    - `signal:offer` — Forward SDP offer from resident to staff
    - `signal:answer` — Forward SDP answer from staff to resident
    - `signal:ice-candidate` — Forward ICE candidates bidirectionally
    - `call:end` — Either party ends call
    - `disconnect` — Clean up on disconnect
  - Maintain in-memory map: `Map<socketId, { role: 'staff' | 'resident', userId: string }>`
  - Maintain `activeStaff`: list of online staff socket IDs
- Integrate Socket.IO with Express HTTP server in `src/index.ts`
- Add health check for socket connections

**Acceptance Criteria:**
- Socket.IO server starts and accepts connections
- Resident can join and be aware of online/offline staff status
- Staff presence broadcasts to waiting residents
- SDP offers/answers and ICE candidates relay correctly between peers
- Disconnect cleans up state

---

#### T2.5 — WebRTC Calling UI (Mobile App)
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T2.4, T1.6 |
| **Skills** | `expo-dev-client` (WebRTC requires native module) |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- Install `react-native-webrtc`: `npx expo install react-native-webrtc`
- Install `socket.io-client`: `npx expo install socket.io-client`
- Create `src/services/webrtc.ts`:
  - Socket.IO client connecting to `/webrtc` namespace on the backend
  - `joinAsResident(userId)` — joins room
  - `requestCall()` — emits `request:call`
  - WebRTC peer connection setup:
    - Create `RTCPeerConnection` with STUN servers (Google public STUN)
    - Create offer, set local description, emit `signal:offer`
    - Handle incoming `signal:answer` — set remote description
    - Handle `signal:ice-candidate` — add ICE candidate
  - Expose: `startCall()`, `endCall()`, `onRemoteStream(stream)`, connection state
- Create `src/screens/CallScreen.tsx`:
  - "Request Assistance" button (large, prominent)
  - State display: "Looking for available staff..." / "Connecting..." / "Connected" / "Staff offline"
  - During call:
    - Local video preview (small, PiP-style)
    - Remote video (full screen)
    - End call button
    - Mute/unmute toggle
  - If no staff online after 15s → trigger Watchdog (Phase 3)
- Create `src/services/socket.ts` — shared Socket.IO client instance

**Acceptance Criteria:**
- Resident can request a call
- If staff is online, connection establishes and video renders
- End call button works and cleans up
- Local preview shows resident's camera
- Audio works bidirectionally

---

#### T2.6 — WebRTC Answering UI (Web Dashboard)
| Field | Value |
|---|---|
| **Target dir** | `web/` |
| **Dependencies** | T2.4, T2.3 |
| **Skills** | `shadcn`, `tailwind-design-system`, `vercel-react-best-practices` |
| **Sub-agent type** | `frontend-worker` (web specialist) |

**Actions:**
- Install `socket.io-client` in web project
- Create `src/services/webrtc.ts`:
  - Socket.IO client for `/webrtc` namespace
  - Join as staff on dashboard login
  - Handle incoming call requests
  - WebRTC peer connection setup (answer side)
- Create `src/components/IncomingCallNotification.tsx`:
  - shadcn `Dialog` or `Sheet` sliding in when `request:call` received
  - Shows: "Incoming call from resident [Name]" with shadcn `Card`
  - "Accept" button → establishes WebRTC connection
  - "Decline" button → sends rejection to resident
- Create `src/components/VideoCallPanel.tsx`:
  - Remote video (resident's camera)
  - Local video preview (staff's camera)
  - Controls: End Call, Mute, Unmute
  - Fits within the dashboard layout (sidebar area or floating panel)
- Add call state indicator in dashboard header (shows "On Call" badge when active)

**Acceptance Criteria:**
- Staff dashboard shows notification when resident requests call
- Accepting a call establishes bidirectional video/audio
- Remote video renders in the dashboard
- End call cleans up peer connection
- Multiple sequential calls work (not just first one)

---

### 4.2 Phase 2 Integration Points

| Integration | Source | Target | Protocol |
|---|---|---|---|
| Document submission | `app/` → `backend/` | ConfirmationScreen → `/api/documents/request` | HTTP POST JSON |
| Document status update | `web/` → `backend/` | Kanban → `/api/admin/documents/:id/status` | HTTP PATCH |
| WebRTC signaling | `app/` ↔ `backend/` | Socket.IO client ↔ Signaling server | WebSocket (Socket.IO) |
| WebRTC media | `app/` ↔ `web/` | Peer-to-peer video/audio stream | WebRTC (SRTP/DTLS) |
| Staff presence | `web/` → `backend/` → `app/` | Socket.IO broadcast | WebSocket event |

### 4.3 Phase 2 Testing Strategy

| Test | Method | Pass Criteria |
|---|---|---|
| Kanban CRUD | Submit doc from app, check web dashboard | Doc appears in "Pending Review" column |
| Status transition | Move card through all statuses | Each update reflects in MongoDB |
| WebRTC connect | Request call with staff online | Video flows both ways in <5s |
| WebRTC reject | Request call, staff declines | Resident sees "Staff unavailable" message |
| Split screen UX | Time the flow: camera → review → submit | ≤ 45 seconds total |
| Web dashboard responsive | Resize browser to 1024px, 768px | Layout adjusts, no horizontal scroll |
| Admin auth | Access dashboard without login | Redirected to login page |
| Concurrent calls | Two residents call simultaneously | Only first call shows (single staff mode) |

---

## 5. Phase 3: Watchdog Fallbacks, Accessibility & Launch (Days 8–10)

### Objective
Implement the graceful degradation layer (15-second watchdog timer plus missed-call logging), enforce accessibility standards, run comprehensive end-to-end testing, and polish for presentation.

### 5.1 Task Inventory

#### T3.1 — 15-Second Watchdog Timer (Mobile App)
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T2.5 (CallScreen exists) |
| **Skills** | `expo-tailwind-setup` |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- Create `src/hooks/useWatchdogCall.ts`:
  - Accept: `onFallback(callMetadata)` callback
  - Start a 15-second timer when `request:call` is emitted
  - If `staff:accept` received before timer expires → cancel timer, proceed to call
  - If timer expires:
    - Set state to `fallback`
    - Call `onFallback` with `{ userId, userName, timestamp }`
- Create `src/services/watchdogApi.ts`:
  - `POST /api/missed-calls` — sends missed call payload to backend
- Update `CallScreen.tsx`:
  - Start watchdog when "Request Assistance" is tapped
  - If watchdog fires:
    - Show full-screen message: "Staff is currently unavailable. Your request has been logged. A staff member will contact you shortly."
    - Display a confirmation/reference number
    - "Back to Home" button → return to main screen
  - If staff accepts before watchdog: hide watchdog, proceed with call
- Add a notification badge on the missed-call icon in the app for follow-up

**Acceptance Criteria:**
- Watchdog starts on call request
- If no staff online, watchdog fires at exactly 15s (±1s tolerance)
- Fallback message displays clearly with large text
- HTTP POST is sent to `/api/missed-calls` with correct payload
- MongoDB receives the missed call record

---

#### T3.2 — Missed Call / Urgencies Dashboard (Web)
| Field | Value |
|---|---|
| **Target dir** | `web/` + `backend/` |
| **Dependencies** | T3.1 (API endpoint exists) |
| **Skills** | `shadcn`, `tailwind-design-system` |
| **Sub-agent type** | `frontend-worker` + `backend-worker` |

**Actions (Backend):**
- Create `src/controllers/missedCallController.ts`:
  - `POST /api/missed-calls` — creates missed call record (auth optional, used by watchdog)
    - Body: `{ userId, userName, timestamp }`
    - Returns `{ id, ...record }`
  - `GET /api/admin/missed-calls` — returns all missed calls, sorted by timestamp desc
    - Supports `?acknowledged=false` filter
  - `PATCH /api/admin/missed-calls/:id/acknowledge` — marks a missed call as acknowledged
- Add routes to `src/routes/missedCallRoutes.ts`

**Actions (Web):**
- Create `src/pages/MissedCalls.tsx`:
  - shadcn `Table` showing missed calls:
    - Resident name
    - Timestamp
    - Acknowledged status (`Badge` component)
    - "Acknowledge" button → calls `PATCH` endpoint
  - Real-time updates via Socket.IO (if new missed call arrives while dashboard is open)
  - "Urgencies" section at top (unacknowledged calls highlighted with `variant="destructive"` badge)
- Add "Missed Calls" nav item to the AdminDashboard sidebar

**Acceptance Criteria:**
- Missed calls from watchdog appear in the web table
- Acknowledge button updates status in DB and UI
- Unacknowledged calls are visually distinct (red/destructive badge)
- New missed calls appear in real-time via Socket.IO
- Table is sortable by timestamp

---

#### T3.3 — Accessibility Guardrails (Mobile App)
| Field | Value |
|---|---|
| **Target dir** | `app/` |
| **Dependencies** | T1.5 (Tailwind setup) |
| **Skills** | `expo-tailwind-setup`, `tailwind-design-system` |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- **High-contrast theme:**
  - Define accessibility theme in `src/global.css`:
    - `--color-bg-primary` (white/cream background)
    - `--color-text-primary` (true black, not dark gray)
    - `--color-text-secondary` (dark gray #444 minimum)
    - `--color-border-focus` (thick, high-contrast blue #0044CC)
    - `--color-button-primary` (high-contrast green or blue with white text)
    - Minimum contrast ratio 7:1 for all text elements
- **Typography audit:**
  - All body text: minimum 18px (`text-lg` equivalent)
  - All labels: minimum 18px
  - All button text: minimum 20px
  - Headers: minimum 24px
  - Use `font-bold` or `font-semibold` for all actionable text
- **Touch target audit:**
  - Every interactive element: minimum 48x48dp touch target
  - Use `min-h-[48px] min-w-[48px]` classes
  - Add adequate padding around all touchable areas
  - Visual feedback on press (opacity change or background color shift)
- **Focus indicators:**
  - All `TextInput` fields: focus border thickness ≥ 3px
  - `Pressable` elements: visible `> 3dp` press feedback
  - Use `accessibilityLabel` and `accessibilityHint` on all interactive elements
- **Screen reader support:**
  - Add `aria-label` / `accessibilityLabel` to all buttons, inputs, and images
  - Ensure semantic grouping of form fields
  - Dynamic announcements for status changes (e.g., "Request submitted successfully")

**Acceptance Criteria:**
- All text meets WCAG AA contrast ratio (7:1 for normal text)
- Every interactive element has ≥ 48x48dp touch target
- Screen reader can navigate the entire flow
- Focus states are clearly visible
- Font sizes all meet minimum thresholds (18px body, 20px buttons, 24px headers)

---

#### T3.4 — Responsive & Accessible Styling (Web Dashboard)
| Field | Value |
|---|---|
| **Target dir** | `web/` |
| **Dependencies** | T2.3 (Dashboard exists) |
| **Skills** | `shadcn`, `tailwind-design-system`, `vercel-react-best-practices` |
| **Sub-agent type** | `frontend-worker` |

**Actions:**
- **Responsive layout audit:**
  - Verify Kanban columns stack vertically on screens < 1024px
  - Verify sidebar collapses to hamburger menu on < 768px
  - Use Tailwind responsive prefixes: `lg:`, `md:`, `sm:`
  - Test at 320px, 768px, 1024px, 1440px breakpoints
- **Accessibility audit:**
  - Add `aria-labels` to all interactive elements
  - Ensure proper heading hierarchy (`h1` → `h2` → `h3`)
  - Add focus-visible styles for keyboard navigation
  - Ensure color contrast meets WCAG AA (use shadcn semantic colors)
  - Add `loading` states for async operations (use shadcn `Skeleton` component)
  - Add toast notifications for success/error feedback (use `sonner`)
- **Performance (vercel-react-best-practices):**
  - Lazy load route components with `React.lazy()` + `Suspense`
  - Memoize expensive computations with `useMemo`/`useCallback`
  - Avoid inline function definitions in JSX props where possible
  - Use `React.memo` on list items (document cards)
  - Verify no unnecessary re-renders with React DevTools

**Acceptance Criteria:**
- Dashboard is fully usable at 768px viewport width
- Keyboard navigation works for all main workflows (Tab, Enter, Escape)
- Screen reader can announce all dashboard content
- Lighthouse accessibility score ≥ 90
- No console errors related to React rendering

---

#### T3.5 — End-to-End Integration & Timing Verification
| Field | Value |
|---|---|
| **Target dir** | `app/` + `web/` + `backend/` |
| **Dependencies** | All previous tasks |
| **Skills** | All loaded skills |
| **Sub-agent type** | PM / QA (manual) |

**Actions:**
- **The Stopwatch Test (flow timing):**
  1. Open app on physical Android device
  2. Start stopwatch
  3. Tap "Request Barangay ID"
  4. Capture photo of test ID card
  5. Wait for OCR processing
  6. Review extracted data on split screen
  7. Edit any incorrect field
  8. Tap "Looks Good — Submit Request"
  9. Stop stopwatch
  10. Record time
  11. Repeat 10 times with different cards/lighting conditions
  12. Target: ≥ 85% of trials complete in ≤ 45 seconds
- **The Disconnect Test (watchdog):**
  1. Ensure web dashboard is logged out (no active staff)
  2. On mobile app, tap "Request Assistance"
  3. Start stopwatch
  4. Verify watchdog message displays at ~15 seconds
  5. Verify HTTP POST is sent
  6. Verify missed call appears in MongoDB
  7. Stop stopwatch
  8. Verify time between request and fallback display is ≤ 17 seconds
- **The Connection Test (WebRTC):**
  1. Log into web dashboard
  2. On mobile app, tap "Request Assistance"
  3. On web, click "Accept"
  4. Verify video flows both ways
  5. Verify end call works
  6. Verify connection time < 5 seconds
- **The Rejection Test:**
  1. Submit document from app
  2. In web dashboard, move to "Rejected" with a reason
  3. Verify app can query status and see rejection
- **Regression test:**
  - Run through every app screen and web page
  - Verify no crashes, no missing data, no console errors

**Acceptance Criteria:**
- Stopwatch test: ≥ 85% passes in ≤ 45 seconds
- Disconnect test: 100% of watchdog firings create DB records
- Connection test: WebRTC connects in < 5 seconds
- All flows complete without crash or data loss

---

#### T3.6 — Pre-Presentation Polish
| Field | Value |
|---|---|
| **Target dir** | `app/` + `web/` + `backend/` |
| **Dependencies** | T3.5 |
| **Skills** | All |
| **Sub-agent type** | All agents |

**Actions:**
- **Mobile app:**
  - Add app icon and splash screen if not already present
  - Ensure all loading states show shadcn-style placeholders (Skeleton)
  - Add error boundaries around each screen
  - Remove any console.log / debug statements
  - Test on at least one budget Android device (if available)
- **Web dashboard:**
  - Add favicon and page title
  - Ensure all pages have meaningful loading states
  - Add error boundary around dashboard
  - Remove debug code
- **Backend:**
  - Add seed script for demo data (2-3 sample documents, 1 missed call)
  - Ensure all errors return consistent JSON format
  - Add request logging middleware
- **Documentation:**
  - Update `.env.example` with all required variables
  - Document the test flow for hackathon judges
  - Prepare demo walkthrough script

**Acceptance Criteria:**
- App launches without crashes on a clean install
- Web dashboard loads with sample data visible
- API returns consistent error format
- Judges can follow a prepared demo script

---

### 5.2 Phase 3 Integration Points

| Integration | Source | Target | Protocol |
|---|---|---|---|
| Missed call logging | `app/` → `backend/` | Watchdog → `/api/missed-calls` | HTTP POST JSON |
| Live missed call updates | `backend/` → `web/` | Socket.IO broadcast to dashboard | WebSocket event |
| Document status push | `web/` → `backend/` → `app/` | Status update → notification | Polling or Socket.IO |

### 5.3 Phase 3 Testing Strategy

| Test | Method | Pass Criteria |
|---|---|---|
| Full E2E flow | Camera → OCR → Review → Submit → Dashboard → Approve | Complete lifecycle works |
| Watchdog timing | Measure from call request to fallback display | 15s ± 1s |
| All states app | App exposed to all status transitions | UI reflects correct status |
| Contrast check | Use color contrast analyzer tool | All text meets WCAG AA (7:1) |
| Touch target audit | Measure all interactive elements in DevTools | All ≥ 48x48dp |
| Screen reader | Navigate entire flow with TalkBack/VoiceOver | All elements announced |
| 0-network test | Airplane mode at each screen | Graceful error, no crash |
| Consecutive submissions | Submit 5 documents in a row | All saved, no rate limit hit |

---

## 6. Dependency Graph

```
T1.1 (Workspace)
  ├── T1.2 (Express bootstrap)
  │   ├── T1.3 (MongoDB models)
  │   ├── T1.4 (Firebase Admin)
  │   ├── T1.7 (Gemini OCR API)
  │   └── T2.4 (WebRTC signaling)
  ├── T1.5 (Expo + Tailwind)
  │   ├── T1.6 (Firebase Auth app)
  │   │   └── T1.8 (Camera capture)
  │   │       └── T1.9 (Registration flow)
  │   │           └── T2.1 (Split review)
  │   │               └── T2.2 (ID issuance)
  │   │                   └── T2.3 (Admin Kanban) ─── T3.2 (Missed calls web)
  │   └── T1.8 ───── T2.5 (Calling UI app) ───── T3.1 (Watchdog timer)
  │                                                  └── T3.2
  └── T1.4 ───── T2.6 (Answering UI web)
                    └── T2.5

T2.4 ─── T2.5 ─── T2.6 (WebRTC chain)
                └── T3.1

T2.2 ─── T2.3 (Admin dashboard)

T3.1 ─── T3.2 (Missed call logging chain)

T3.3 ─── T3.4 (Accessibility parallel tasks)
         └── T3.5 (E2E testing)
              └── T3.6 (Polish)
```

### Parallelism Opportunities
| Track | Tasks | Can Run In Parallel With |
|---|---|---|
| Backend core | T1.2 → T1.3 → T1.4 → T1.7 → T2.4 | App track (T1.5→T1.6→T1.8) |
| App core | T1.5 → T1.6 → T1.8 → T1.9 → T2.1 → T2.2 → T2.5 | Backend track |
| Web core | T2.3 → T2.6 → T3.2 → T3.4 | App track (after T2.2) |
| Testing | T3.5 | After all tracks merge |

---

## 7. Sub-Agent & Skill Mapping

### Task-to-Agent-Type Mapping

| Agent Type | Responsible For | Skills to Load |
|---|---|---|
| **backend-worker** | Express API, MongoDB, Firebase Admin, Gemini integration, Socket.IO signaling, rate limiting | `workers-best-practices` |
| **frontend-worker (Expo)** | Expo app screens, NativeWind styling, camera capture, WebRTC client, accessibility | `expo-tailwind-setup`, `expo-dev-client`, `tailwind-design-system` |
| **frontend-worker (Web)** | React+Vite dashboard, shadcn/ui components, admin Kanban, WebRTC answer UI | `shadcn`, `tailwind-design-system`, `vercel-react-best-practices` |
| **PM / QA** | E2E testing, timing verification, documentation, demo prep | None (manual oversight) |

### Skill Loading Per Task

| Task | Skills to Load |
|---|---|
| T1.2 Express bootstrap | `workers-best-practices` |
| T1.3 MongoDB models | `workers-best-practices` |
| T1.4 Firebase Admin | `workers-best-practices` |
| T1.5 Expo Tailwind setup | `expo-tailwind-setup`, `expo-dev-client` |
| T1.6 Firebase Auth app | `expo-dev-client` |
| T1.7 Gemini OCR API | `workers-best-practices` |
| T1.8 Camera capture | `expo-dev-client` |
| T1.9 Registration flow | `expo-tailwind-setup`, `workers-best-practices` |
| T2.1 Split review | `expo-tailwind-setup`, `tailwind-design-system` |
| T2.2 ID issuance | `expo-tailwind-setup`, `workers-best-practices` |
| T2.3 Admin Kanban | `shadcn`, `tailwind-design-system`, `vercel-react-best-practices` |
| T2.4 WebRTC signaling | `workers-best-practices` |
| T2.5 Calling UI app | `expo-dev-client` |
| T2.6 Answering UI web | `shadcn`, `vercel-react-best-practices` |
| T3.1 Watchdog timer | `expo-tailwind-setup` |
| T3.2 Missed calls web | `shadcn`, `tailwind-design-system`, `workers-best-practices` |
| T3.3 Accessibility app | `expo-tailwind-setup`, `tailwind-design-system` |
| T3.4 Accessibility web | `shadcn`, `tailwind-design-system`, `vercel-react-best-practices` |
| T3.5 E2E testing | All |
| T3.6 Polish | All |

---

## 8. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | **Gemini API rate throttling (free tier: 10 req/min)** | High | High — multi-user testing exhausts quota instantly | **Priority:** Implement cache middleware (T1.7). Cache results by image hash. Also limit concurrent testers to 2-3 during demo. | backend-worker |
| R2 | **WebRTC blocked by firewall/NAT** | Medium | High — peer-to-peer fails on local networks | **Mitigation:** Ensure devices are on same WiFi/LAN. Use Google public STUN servers. If P2P fails, watchdog fires (not a total failure, graceful degradation is a feature). | backend-worker, frontend-worker (both) |
| R3 | **Expo camera not working in Expo Go** | High | High — must use dev client or physical build | **Mitigation:** Use `expo-dev-client` to create a development build with native camera module. Budget time on Day 1 to create the dev client build. | frontend-worker (Expo) |
| R4 | **MongoDB not installed locally** | Medium | High — DB connection fails | **Mitigation:** Use MongoDB Atlas free tier (connection string in `.env`). Or use a Docker container. Document both options in setup instructions. | backend-worker |
| R5 | **OCR accuracy low on damaged/worn ID cards** | Medium | Medium — poor extraction breaks flow | **Mitigation:** The split-screen review allows manual correction. Track accuracy metric. For demo, use clean, well-lit test cards. | frontend-worker + QA |
| R6 | **Socket.IO connection drops** | Medium | Low — call quality degrades | **Mitigation:** Socket.IO has built-in reconnection. WebRTC media is P2P and unaffected after signaling. Watchdog catches total failures. | backend-worker |
| R7 | **Firebase Anonymous Auth token expiration** | Low | Medium — API calls rejected | **Mitigation:** Token lasts ~1 hour. Use `onIdTokenChanged` listener to refresh. Store refresh token for longer sessions. | frontend-worker (Expo) |
| R8 | **Time running out before Phase 3** | Medium | High — missed-call dashboard and accessibility incomplete | **Mitigation:** Prioritize Phase 1-2 tasks with strict timeboxing. Phase 3 tasks T3.1 and T3.2 are critical (watchdog + missed calls = core hypothesis). Accessibility (T3.3) can be reduced to minimum viable contrast + font size. | PM |
| R9 | **Express app crashes on unhandled promise rejection** | Medium | Medium — API unavailable | **Mitigation:** Add global `process.on('unhandledRejection')` handler. Use try/catch in all route handlers. Add error boundary middleware (T1.2). | backend-worker |

---

## 9. API Contract Reference (MVP)

### 9.1 Backend → Mobile App APIs

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/api/ocr/extract` | Bearer token | Multipart: `image` (JPEG/PNG) | `{ success, data: { name, address, barangay } }` |
| POST | `/api/users/register` | Bearer token | `{ firebaseUid, name, address, barangay, idPhotoUrl }` | `{ success, user }` |
| GET | `/api/users/me` | Bearer token | — | `{ success, user }` |
| POST | `/api/documents/request` | Bearer token | `{ type: 'barangay_id', extractedData, sourcePhotoUrl }` | `{ success, document }` |
| GET | `/api/documents/my-requests` | Bearer token | — | `{ success, documents: [...] }` |
| GET | `/api/documents/:id` | Bearer token | — | `{ success, document }` |
| POST | `/api/missed-calls` | Optional | `{ userId, userName, timestamp }` | `{ success, record }` |
| GET | `/api/health` | None | — | `{ status: "ok", timestamp }` |

### 9.2 Backend → Web Dashboard APIs

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/api/admin/documents` | Bearer token (staff) | `?page=1&limit=20&status=pending_review` | `{ success, documents: [...], total, page }` |
| PATCH | `/api/admin/documents/:id/status` | Bearer token (staff) | `{ status, rejectionReason? }` | `{ success, document }` |
| GET | `/api/admin/documents/stats` | Bearer token (staff) | — | `{ success, stats: { pending, processing, ready, completed, rejected } }` |
| GET | `/api/admin/missed-calls` | Bearer token (staff) | `?acknowledged=false` | `{ success, missedCalls: [...] }` |
| PATCH | `/api/admin/missed-calls/:id/acknowledge` | Bearer token (staff) | — | `{ success, record }` |

### 9.3 WebSocket Events (Socket.IO `/webrtc`)

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join:staff` | Client → Server | `{ staffId: string }` | Staff announces presence |
| `join:resident` | Client → Server | `{ userId: string }` | Resident joins room |
| `request:call` | Client → Server | `{ userId: string, userName: string }` | Resident requests video call |
| `staff:status` | Server → Client (resident) | `{ online: boolean, staffCount: number }` | Notifies resident of staff availability |
| `incoming:call` | Server → Client (staff) | `{ userId: string, userName: string }` | Staff receives call request |
| `staff:accept` | Server → Client (resident) | `{ staffId: string }` | Resident notified of call acceptance |
| `staff:decline` | Server → Client (resident) | `{ reason?: string }` | Resident notified of call rejection |
| `signal:offer` | Bidirectional | `{ sdp: RTCSessionDescription, from: string, to: string }` | SDP offer relay |
| `signal:answer` | Bidirectional | `{ sdp: RTCSessionDescription, from: string, to: string }` | SDP answer relay |
| `signal:ice-candidate` | Bidirectional | `{ candidate: RTCIceCandidate, from: string, to: string }` | ICE candidate relay |
| `call:end` | Bidirectional | `{ from: string }` | Either party ends the call |
| `call:error` | Server → Client | `{ message: string }` | Signaling error notification |
| `missed-call:new` | Server → Client (staff) | `{ record: MissedCall }` | Real-time missed call notification |

---

## 10. Environment Variables Reference

Create a `.env` file in `backend/` and reference in `.env.example` at root:

```
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ekap

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Google AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:8081

# Admin UIDs (comma-separated Firebase UIDs with staff access)
ADMIN_UIDS=uid1,uid2
```

For the Expo app, use `expo-constants` `extra` config in `app/app.json`:

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "...",
      "firebaseProjectId": "...",
      "backendUrl": "http://192.168.1.100:3000",
      "geminiApiKey": "..."
    }
  }
}
```

---

## 11. Deployment Approach (Local Network)

Since MVP uses self-hosted MongoDB and local Express server:

1. **Backend & Database:** Run on a development laptop with `mongod` and `npm run dev`
2. **Web Dashboard:** Serve via Vite dev server (`npm run dev` in `web/`)
3. **Mobile App:** Connect to backend via local IP using `expo start` + QR scan
4. **Local Network:** All devices on same WiFi. Backend accessible at `http://<host-ip>:3000`
5. **Alternative Tunnel:** If mobile device can't reach host IP, use `ngrok http 3000` and update `backendUrl` in app config

---

## 12. File Structure (Target)

After all phases, the project should look like:

```
E:\Projects\Mockathon-Barangay\
├── plans\
│   ├── PRD.md
│   ├── mvp.md
│   └── development-plan.md          ← This file
├── backend\
│   ├── src\
│   │   ├── index.ts                 ← Express + Socket.IO bootstrap
│   │   ├── config\
│   │   │   ├── database.ts          ← MongoDB connection
│   │   │   └── env.ts              ← Env var validation
│   │   ├── controllers\
│   │   │   ├── ocrController.ts
│   │   │   ├── userController.ts
│   │   │   ├── documentController.ts
│   │   │   └── missedCallController.ts
│   │   ├── middleware\
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── models\
│   │   │   ├── User.ts
│   │   │   ├── DocumentRequest.ts
│   │   │   ├── BlotterReport.ts
│   │   │   └── MissedCall.ts
│   │   ├── routes\
│   │   │   ├── ocrRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── documentRoutes.ts
│   │   │   └── missedCallRoutes.ts
│   │   └── services\
│   │       ├── firebase.ts
│   │       ├── gemini.ts
│   │       └── signaling.ts         ← Socket.IO WebRTC signaling
│   ├── package.json
│   └── tsconfig.json
├── app\                              ← Expo mobile client
│   ├── App.tsx                       ← Entry point with AuthProvider
│   ├── src\
│   │   ├── global.css                ← Tailwind v4 imports + theme
│   │   ├── tw\                       ← CSS-wrapped components
│   │   │   ├── index.tsx
│   │   │   ├── image.tsx
│   │   │   └── animated.tsx
│   │   ├── navigation\
│   │   │   └── AppNavigator.tsx
│   │   ├── screens\
│   │   │   ├── CaptureScreen.tsx
│   │   │   ├── ReviewScreen.tsx       (SplitScreenReview wrapper)
│   │   │   ├── RequestConfirmationScreen.tsx
│   │   │   ├── TrackStatusScreen.tsx
│   │   │   └── CallScreen.tsx
│   │   ├── components\
│   │   │   └── SplitScreenReview.tsx
│   │   ├── services\
│   │   │   ├── firebase.ts
│   │   │   ├── api.ts               ← Axios instance
│   │   │   ├── socket.ts            ← Socket.IO client
│   │   │   ├── webrtc.ts
│   │   │   └── watchdogApi.ts
│   │   └── hooks\
│   │       ├── useAuth.ts
│   │       └── useWatchdogCall.ts
│   ├── metro.config.js
│   ├── postcss.config.mjs
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── web\                              ← React + Vite dashboard
│   ├── index.html
│   ├── src\
│   │   ├── main.tsx
│   │   ├── App.tsx                   ← Auth gate + router
│   │   ├── index.css                 ← Tailwind imports
│   │   ├── pages\
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DocumentQueue.tsx
│   │   │   ├── MissedCalls.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── components\
│   │   │   ├── IncomingCallNotification.tsx
│   │   │   ├── VideoCallPanel.tsx
│   │   │   └── DocumentDetailDialog.tsx
│   │   ├── services\
│   │   │   ├── api.ts
│   │   │   ├── socket.ts
│   │   │   └── webrtc.ts
│   │   └── components/ui\            ← shadcn installed components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       └── skeleton.tsx
│   ├── components.json               ← shadcn config
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── skills-lock.json
```

---

## 13. Key Architectural Decisions

1. **No Babel config for NativeWind v5** — Tailwind v4 + NativeWind v5 uses CSS-first config, not Babel presets.
2. **Socket.IO for signaling** — More reliable than raw WebSocket; provides built-in rooms, reconnection, and fallback transports.
3. **Google public STUN only** — For MVP, no TURN server (cost/complexity). Peer-to-peer must work on same LAN.
4. **Firebase Anonymous Auth** — Zero sign-up friction. User is identified immediately. Can upgrade to email/phone later.
5. **Mongoose for MongoDB** — Schema validation is important even for hackathon. Avoids corrupt data from malformed Gemini responses.
6. **shadcn/ui with semantic tokens** — Colors use semantic CSS variables (`bg-primary`, `text-muted-foreground`). No hardcoded Tailwind colors in components.
7. **CSS-wrapped components with `useCssElement`** — Required for react-native-css to support `className` prop in Expo. This is the NativeWind v5 pattern.

---

## 14. Out of Scope (Post-MVP)

The following features are explicitly excluded from this development plan:

- Multi-template document processing (Barangay Clearance, Indigency, etc.)
- Voice-to-text dictation (microphone input for form fields)
- Gemini Intelligent Concierge / Chatbot
- Geotargeted Crisis Hub (polygon maps, evacuation alerts)
- Blotter/Incident report filing with evidence uploads
- Mediation scheduling and notifications
- Admin analytics dashboard (stats, logs, etc.)
- Staff credential CRUD management
- Push notification infrastructure
- Email notifications
- Real user authentication (Firebase Email/Password or OAuth)
- TURN server for WebRTC (firewall traversal)
- CI/CD pipelines
- Production deployment (EAS Build, app store submission)
