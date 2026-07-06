# e-Kap API Documentation

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: Configured via `EXPO_PUBLIC_API_URL` environment variable

## Authentication

All authenticated endpoints require Firebase UID in request body or as Bearer token. For MVP, Firebase UID is passed in request body.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Registration

#### POST /api/registration
Register a new user with location and ID verification.

**Request Body:**
```json
{
  "firebaseUid": "string (required)",
  "email": "string (optional)",
  "phoneNumber": "string (optional)",
  "fullName": "string (required)",
  "regionCode": "string (required)",
  "regionName": "string (required)",
  "provinceCode": "string (required)",
  "provinceName": "string (required)",
  "cityMunicipalityCode": "string (required)",
  "cityMunicipalityName": "string (required)",
  "cityMunicipalityType": "city" | "municipality" (required),
  "barangayCode": "string (required)",
  "barangayName": "string (required)",
  "idPhotoBase64": "string (required, base64 encoded)",
  "idType": "national_id" | "barangay_id" | "other" (required),
  "idNumber": "string (optional)",
  "address": "string (optional)",
  "birthDate": "string (optional)",
  "gender": "Male" | "Female" | "Other" (optional)",
  "nationality": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "firebaseUid": "string",
    "fullName": "string",
    "location": {
      "region": "string",
      "province": "string",
      "cityMunicipality": "string",
      "barangay": "string"
    },
    "verificationStatus": "pending",
    "createdAt": "ISO date string"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - User already registered
- `500` - Server error

---

#### GET /api/registration/:firebaseUid
Get user registration status.

**URL Parameters:**
- `firebaseUid` (string, required) - Firebase user ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "firebaseUid": "string",
    "fullName": "string",
    "location": {
      "region": "string",
      "province": "string",
      "cityMunicipality": "string",
      "barangay": "string"
    },
    "verificationStatus": "pending" | "approved" | "rejected",
    "isVerified": boolean,
    "createdAt": "ISO date string"
  }
}
```

**Error Responses:**
- `404` - User not found
- `500` - Server error

---

#### PUT /api/registration/:firebaseUid/verify
Update user verification status (admin use).

**URL Parameters:**
- `firebaseUid` (string, required) - Firebase user ID

**Request Body:**
```json
{
  "status": "approved" | "rejected" (required),
  "notes": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "verificationStatus": "approved" | "rejected",
    "isVerified": boolean
  }
}
```

**Error Responses:**
- `400` - Invalid status
- `404` - User not found
- `500` - Server error

---

### Document Requests

#### POST /api/requests
Submit a barangay ID request.

**Request Body:**
```json
{
  "firebaseUid": "string (required)",
  "fullName": "string (required)",
  "address": "string (required)",
  "birthDate": "string (required)",
  "gender": "Male" | "Female" | "Other" (required),
  "nationality": "string (required)",
  "idType": "national_id" | "barangay_id" (required),
  "idNumber": "string (required)",
  "idPhotoBase64": "string (required, base64 encoded)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "firebaseUid": "string",
    "fullName": "string",
    "address": "string",
    "birthDate": "string",
    "gender": "string",
    "nationality": "string",
    "idType": "string",
    "idNumber": "string",
    "idPhotoBase64": "string",
    "status": "pending_review",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

---

#### GET /api/requests/:id
Get request status by ID.

**URL Parameters:**
- `id` (string, required) - Request ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "firebaseUid": "string",
    "fullName": "string",
    "address": "string",
    "birthDate": "string",
    "gender": "string",
    "nationality": "string",
    "idType": "string",
    "idNumber": "string",
    "idPhotoBase64": "string",
    "status": "pending_review" | "approved" | "rejected",
    "staffNotes": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

---

#### GET /api/requests
List user requests (optional filtering).

**Query Parameters:**
- `firebaseUid` (string, optional) - Filter by user
- `status` (string, optional) - Filter by status
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "firebaseUid": "string",
      "fullName": "string",
      "status": "string",
      "createdAt": "ISO date string"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

---

### OCR

#### POST /api/ocr
Extract text from ID image using Gemini Vision API.

**Request Body:**
- `image` (file, required) - ID image file (multipart/form-data)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "fullName": "string | null",
    "address": "string | null",
    "birthDate": "string | null",
    "gender": "Male" | "Female" | "Other" | null",
    "nationality": "string | null",
    "idNumber": "string | null",
    "idType": "national_id" | "barangay_id" | null"
  }
}
```

**Error Responses:**
- `400` - Invalid image or missing file
- `500` - OCR processing error or Gemini API error

---

### Chat & AI

#### POST /api/chat
Send message to AI chatbot.

**Request Body:**
```json
{
  "message": "string (required)",
  "context": {
    "userId": "string (optional)",
    "location": {
      "region": "string (optional)",
      "province": "string (optional)",
      "cityMunicipality": "string (optional)",
      "barangay": "string (optional)"
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "string",
    "canEscalate": boolean,
    "staffAvailable": boolean,
    "suggestedActions": ["string"] (optional)
  }
}
```

**Error Responses:**
- `400` - Message is required
- `500` - Chat processing error

---

#### GET /api/chat/staff-status
Check if staff is available for escalation.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "staffAvailable": boolean,
    "estimatedWaitTime": number (minutes)
  }
}
```

---

#### POST /api/chat/staff-status
Update staff availability (admin use).

**Request Body:**
```json
{
  "available": "boolean (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "staffAvailable": boolean
  }
}
```

---

### WebRTC

#### POST /api/webrtc/call
Request a call with staff.

**Request Body:**
```json
{
  "userId": "string (required)",
  "type": "audio" | "video" (required),
  "reason": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "callId": "string",
    "status": "pending",
    "message": "string"
  }
}
```

**Error Responses:**
- `400` - Missing required fields or invalid type
- `500` - Call creation error

---

#### POST /api/webrtc/signal
Exchange WebRTC signaling data.

**Request Body:**
```json
{
  "callId": "string (required)",
  "type": "offer" | "answer" | "ice-candidate" (required),
  "data": "any (required)",
  "userId": "string (required)",
  "targetUserId": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Signal received"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - Call not found
- `500` - Signal processing error

---

#### GET /api/webrtc/call/:callId
Get call status.

**URL Parameters:**
- `callId` (string, required) - Call ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "callId": "string",
    "status": "pending" | "connected" | "ended" | "rejected",
    "type": "audio" | "video",
    "startTime": "ISO date string"
  }
}
```

**Error Responses:**
- `404` - Call not found
- `500` - Server error

---

#### PUT /api/webrtc/call/:callId/status
Update call status (staff use).

**URL Parameters:**
- `callId` (string, required) - Call ID

**Request Body:**
```json
{
  "status": "pending" | "connected" | "ended" | "rejected" (required)
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "callId": "string",
    "status": "string"
  }
}
```

**Error Responses:**
- `400` - Invalid status
- `404` - Call not found
- `500` - Server error

---

#### DELETE /api/webrtc/call/:callId
End a call.

**URL Parameters:**
- `callId` (string, required) - Call ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "callId": "string",
    "status": "ended"
  }
}
```

**Error Responses:**
- `404` - Call not found
- `500` - Server error

---

### Watchdog

#### POST /api/watchdog
Watchdog timer for WebRTC fallback (15-second timeout).

**Request Body:**
```json
{
  "callId": "string (required)",
  "timeout": "number (optional, default: 15000)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Watchdog started",
    "expiresAt": "ISO date string"
  }
}
```

---

## Error Codes

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request data or missing required fields |
| 401 | Unauthorized | Invalid or missing authentication |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., user already registered) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Rate Limiting

Currently not implemented but should be added for:
- `/api/chat` - Limit chat messages per session
- `/api/requests` - Limit request submissions
- `/api/webrtc/call` - Limit call requests

## WebSocket Server

**Port**: 3001
**Purpose**: Real-time WebRTC signaling and notifications

**Connection**: WebSocket client connects to `ws://localhost:3001`

**Events**:
- `call_request` - New call request from resident
- `call_accepted` - Staff accepts call
- `call_rejected` - Staff rejects call
- `signal` - WebRTC signaling data
- `call_ended` - Call ended

## CORS

Currently set to allow all origins (`*`). For production, restrict to:
- Mobile app domain
- Web dashboard domain

## Testing Endpoints

### Health Check
```
GET /
```
Returns: `{"message": "e-Kap API running", "version": "1.0.0"}`

## Integration Notes

### Mobile App Integration
- Use Axios with base URL from `EXPO_PUBLIC_API_URL`
- Include Firebase UID in request body for authenticated endpoints
- Handle 401/403 errors by re-authenticating with Firebase

### Web Dashboard Integration
- Use same base URL as mobile app
- Implement admin authentication (not yet implemented)
- Use admin-specific endpoints for verification status updates

### External Dependencies
- **PSGC Cloud**: https://psgc.cloud/api (geographic data)
- **Firebase**: Firebase Auth (authentication)
- **Gemini API**: AI/OCR features (requires GEMINI_API_KEY)
- **MongoDB**: Data persistence (requires MONGODB_URI)
