# e-Kap Architecture Overview

## Project Summary

**e-Kap** is a monorepo cloud-based Barangay Management and Citizen Service Portal designed to bridge the digital divide between local barangay LGUs and their citizens, with emphasis on senior-friendly accessibility.

## Monorepo Structure

```
Mockathon-Barangay/
├── app/                    # Mobile Client (Expo 56)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation configuration
│   │   ├── services/       # API and external service integrations
│   │   └── models/         # TypeScript interfaces
│   ├── package.json
│   ├── app.json
│   └── metro.config.js
├── backend/                # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/         # Database and configuration
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route handlers
│   │   ├── ws.js           # WebSocket server
│   │   └── index.ts        # Main entry point
│   └── package.json
├── web/                    # Web Dashboard (React)
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── context/        # React context providers
│   └── package.json
└── plans/                  # Planning documents
    └── PRD.md
```

## Technology Stack

### Mobile App (app/)
- **Framework**: Expo SDK 56
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **Styling**: Tailwind CSS v4 + NativeWind v5
- **Authentication**: Firebase Anonymous Auth
- **Camera**: expo-camera (CameraView)
- **Storage**: expo-secure-store (caching)
- **Image Picker**: expo-image-picker
- **HTTP Client**: Axios

### Backend API (backend/)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Auth (token-based)
- **WebSocket**: Custom WebSocket server (port 3001)
- **AI Integration**: Google Gemini API (OCR, Chat)
- **External APIs**: PSGC Cloud API

### Web Dashboard (web/)
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **HTTP Client**: Axios/Fetch

## External Integrations

### 1. PSGC Cloud API
**Purpose**: Philippine geographic data (regions, provinces, cities, barangays)
**Base URL**: https://psgc.cloud/api
**Key Endpoints**:
- `GET /api/regions` - List all regions
- `GET /api/regions/{code}/provinces` - Get provinces in region
- `GET /api/cities-municipalities?province_code={code}` - Get cities/municipalities
- `GET /api/cities-municipalities/{code}/barangays` - Get barangays
**Caching**: 24-hour cache using expo-secure-store
**Important**: Use nested endpoints, NOT v1 endpoints (they return 404)

### 2. Firebase Authentication
**Purpose**: User authentication (anonymous for residents)
**Service**: Firebase Auth
**Flow**: Anonymous login → Firebase UID → Backend validation
**Implementation**: `app/src/services/firebase.ts`

### 3. Google Gemini API
**Purpose**: OCR text extraction from ID cards, AI chatbot responses
**Service**: Google AI (Gemini)
**Use Cases**:
- ID card OCR (extract name, address, birthdate, etc.)
- FAQ chatbot responses
- **Environment Variable**: `GEMINI_API_KEY`

### 4. MongoDB
**Purpose**: Data persistence
**Connection**: `mongodb://localhost:27017/ekap` (configurable via MONGODB_URI)
**Retry Logic**: 5 attempts with 3-second delays
**Collections**:
- `users` - User registration and verification
- `barangayIDRequests` - Document requests
- `blotterReports` - Incident reports

## API Architecture

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: Configurable via `EXPO_PUBLIC_API_URL`

### Current Endpoints

#### Authentication & Registration
- `POST /api/registration` - Register new user with location and ID
- `GET /api/registration/:firebaseUid` - Get registration status
- `PUT /api/registration/:firebaseUid/verify` - Update verification status (admin)

#### Document Requests
- `POST /api/requests` - Submit barangay ID request
- `GET /api/requests/:id` - Get request status
- `GET /api/requests` - List user requests

#### OCR
- `POST /api/ocr` - Extract text from ID image (multipart/form-data)

#### Chat & AI
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat/staff-status` - Check if staff is available
- `POST /api/chat/staff-status` - Update staff availability (admin)

#### WebRTC
- `POST /api/webrtc/call` - Request call with staff
- `POST /api/webrtc/signal` - Exchange WebRTC signaling data
- `GET /api/webrtc/call/:callId` - Get call status
- `PUT /api/webrtc/call/:callId/status` - Update call status
- `DELETE /api/webrtc/call/:callId` - End call

#### Watchdog
- `POST /api/watchdog` - Watchdog timer for WebRTC fallback

### WebSocket Server
- **Port**: 3001
- **Purpose**: Real-time WebRTC signaling and notifications
- **Implementation**: Custom WebSocket server in `backend/src/ws.js`

## Database Schema

### User Model
```typescript
{
  firebaseUid: string (unique, required)
  email?: string
  phoneNumber?: string
  fullName: string (required)
  // PSGC Location
  regionCode: string (required)
  regionName: string (required)
  provinceCode: string (required)
  provinceName: string (required)
  cityMunicipalityCode: string (required)
  cityMunicipalityName: string (required)
  cityMunicipalityType: "city" | "municipality" (required)
  barangayCode: string (required)
  barangayName: string (required)
  // ID Verification
  idPhotoBase64: string (required)
  idType: "national_id" | "barangay_id" | "other" (required)
  idNumber?: string
  isVerified: boolean (default: false)
  verificationStatus: "pending" | "approved" | "rejected" (default: pending)
  verificationNotes?: string
  // Additional Info
  address?: string
  birthDate?: string
  gender?: "Male" | "Female" | "Other"
  nationality?: string (default: "Filipino")
  createdAt: Date
  updatedAt: Date
}
```

### BarangayIDRequest Model
```typescript
{
  firebaseUid: string (required)
  fullName: string (required)
  address: string (required)
  birthDate: string (required)
  gender: "Male" | "Female" | "Other" (required)
  nationality: string (required)
  idType: "national_id" | "barangay_id" (required)
  idNumber: string (required)
  idPhotoBase64: string (required)
  status: "pending_review" | "approved" | "rejected" (default: pending_review)
  staffNotes?: string
  createdAt: Date
  updatedAt: Date
}
```

## Mobile App Navigation Structure

### Stack Navigation
```
Welcome (no header)
  ↓
Registration (with header)
  ↓
MainTabs (no header, gesture disabled)
  ├── Documents (tab)
  ├── e-Blotter (tab)
  ├── AI Assistant (tab)
  └── Profile (tab)
```

### Document Request Flow (Nested)
```
MainTabs → Documents → Capture → Review → Status → MainTabs
```

## Key Implementation Details

### PSGC Location Selection
- **Hierarchy**: Region → Province → City/Municipality → Barangay
- **Service**: `app/src/services/psgcService.ts`
- **Component**: `app/src/components/LocationSelector.tsx`
- **Caching**: 24-hour cache with expo-secure-store
- **Validation**: All 4 levels required for complete location

### Camera Implementation
- **Component**: CameraView (Expo 56)
- **Important**: CameraView does NOT support children
- **Solution**: Use absolute positioned overlay View
- **Features**: Camera flip, gallery picker, image preview

### Authentication Flow
1. App launches → Firebase anonymous auth
2. User completes registration → Backend creates user record
3. Firebase UID used as primary identifier
4. All subsequent requests include Firebase UID

### WebSocket Signaling
- **Port**: 3001
- **Purpose**: WebRTC peer connection establishment
- **Fallback**: 15-second watchdog timer → callback request
- **Status**: Online (staff available) / Offline (callback logged)

## Known Issues & Workarounds

### 1. PSGC API Version Inconsistency
**Issue**: v1 endpoints return 404
**Solution**: Use nested endpoints instead:
- ✅ `/api/regions/{code}/provinces`
- ✅ `/api/cities-municipalities?province_code={code}`
- ✅ `/api/cities-municipalities/{code}/barangays`
- ❌ `/api/v1/*` (avoid)

### 2. CameraView Children
**Issue**: CameraView doesn't support children (Expo 56)
**Solution**: Use absolute positioned overlay View
```typescript
<CameraView style={StyleSheet.absoluteFillObject} />
<View style={StyleSheet.absoluteFillObject}>
  {/* UI elements here */}
</View>
```

### 3. MongoDB Connection
**Issue**: MongoDB may not be running on startup
**Solution**: Retry logic (5 attempts, 3-second delays) in `backend/src/config/db.ts`

### 4. Province Field
**Issue**: Initial implementation missed province in location state
**Solution**: Added province to LocationData interface and all related components

## Environment Variables

### Mobile App (app/.env)
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

### Backend (backend/.env)
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ekap
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
```

### Web Dashboard (web/.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Development Workflow

### Starting the Application

1. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Mobile App**:
   ```bash
   cd app
   npm install
   npx expo start
   ```

4. **Start Web Dashboard**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

### Testing
- **Mobile**: Use Expo Go app or simulator
- **Backend**: Test endpoints with Postman/curl
- **Web**: Open http://localhost:3000

## Deployment Considerations

### Mobile App
- **Build**: EAS Build
- **Submit**: EAS Submit to App Store/Play Store
- **Environment**: Production API URL in EXPO_PUBLIC_API_URL

### Backend
- **Hosting**: Vercel, Railway, or similar
- **Database**: MongoDB Atlas for production
- **Environment Variables**: Configure in hosting platform

### Web Dashboard
- **Hosting**: Vercel (recommended for Next.js)
- **Build**: `npm run build`
- **Environment**: Configure NEXT_PUBLIC_API_URL

## Security Considerations

1. **Authentication**: Firebase tokens validated on backend
2. **Rate Limiting**: Implement for chat and blotter endpoints
3. **Data Privacy**: e-Blotter data access-controlled
4. **API Keys**: Never commit .env files
5. **CORS**: Currently set to `*` (restrict in production)

## Performance Targets (from PRD)

- **Zero-Typing**: Document submission < 45 seconds
- **First-Responder**: Emergency ping < 3 seconds latency
- **OCR Processing**: Fast enough for real-time feedback
- **API Response**: < 1 second for most endpoints

## Current Implementation Status

### ✅ Completed
- PSGC location integration (4-level hierarchy)
- User registration with ID verification
- Mobile navigation (stack + tabs)
- Basic document request flow
- Backend registration API
- Chat API (keyword-based FAQ)
- WebRTC API endpoints
- Firebase anonymous auth
- MongoDB models and connection

### 🚧 In Progress
- Voice-to-text integration
- AI chatbot with WebRTC escalation
- Web dashboard enhancements

### 📋 Pending
- WebRTC video call UI
- 15-second watchdog timer
- Offline callback request
- Web dashboard Kanban board
- e-Blotter management interface
- Emergency broadcast system
- Staff management
- Analytics dashboard
- Push notifications
