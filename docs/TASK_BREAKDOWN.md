# e-Kap Task Breakdown - Phase-Based Handoff

## Overview

This document breaks down the remaining e-Kap implementation into phases for handoff to cloud Devin agents. Each phase focuses on a specific feature area and can be completed independently or in parallel.

## Phase 1: Voice-to-Text Integration

### Objective
Implement voice dictation for form inputs to enable zero-typing document submission for seniors.

### Tasks

#### 1.1 Core Voice Dictation
- [ ] Install `expo-speech` dependency in `app/package.json`
- [ ] Create `app/src/services/voiceService.ts` with speech recognition logic
- [ ] Create `app/src/components/VoiceDictationButton.tsx` component
- [ ] Add microphone button to one form field for testing
- [ ] Test basic dictation functionality
- [ ] Handle microphone permissions
- [ ] Add recording status indicator
- [ ] Implement start/stop dictation controls

#### 1.2 Form Integration
- [ ] Add dictation to document request forms (DocumentsScreen)
- [ ] Add dictation to e-Blotter incident forms (BlotterScreen)
- [ ] Add dictation to any other text input fields
- [ ] Test all form integrations
- [ ] Ensure text insertion works correctly
- [ ] Allow manual editing after dictation

#### 1.3 Advanced Features
- [ ] Add language selection (English/Tagalog)
- [ ] Add auto-stop after 30 seconds of silence
- [ ] Add "Clear" button to restart dictation
- [ ] Add voice command support (e.g., "clear", "delete")
- [ ] Add dictation history (undo/redo)
- [ ] Add voice feedback for status changes

### Dependencies
- `expo-speech` - Expo Speech Recognition API
- `expo-av-audio` - Audio permissions

### Skills to Use
- **junior-expo-dev** - Implement voice dictation components
- **voice-integration** - Specialized voice integration guidance

### Acceptance Criteria
- [ ] Microphone button works on first tap
- [ ] Speech recognition starts and stops correctly
- [ ] Recognized text displays in real-time
- [ ] Text inserts into form fields correctly
- [ ] Manual editing works after dictation
- [ ] Error handling for permission denied
- [ ] Senior-friendly UI (48dp+ touch targets)
- [ ] Accessibility labels and hints

### Estimated Time
- Core: 4-6 hours
- Integration: 2-3 hours
- Advanced: 3-4 hours
- **Total: 9-13 hours**

---

## Phase 2: AI Chatbot with WebRTC Escalation

### Objective
Implement AI chatbot with live video call escalation for human-in-the-loop support.

### Tasks

#### 2.1 Chat UI Implementation
- [ ] Enhance `app/src/screens/AIAssistantScreen.tsx` with backend integration
- [ ] Connect to `/api/chat` endpoint
- [ ] Display AI responses from backend
- [ ] Add "Talk to Official" button
- [ ] Check staff availability via `/api/chat/staff-status`
- [ ] Show appropriate UI based on staff availability
- [ ] Add suggested actions from chat response
- [ ] Implement message history

#### 2.2 WebRTC Video Call UI
- [ ] Create `app/src/screens/VideoCallScreen.tsx` component
- [ ] Install `react-native-webrtc` dependency
- [ ] Implement local video view (camera)
- [ ] Implement remote video view (staff)
- [ ] Add call controls (mute, camera toggle, end call)
- [ ] Add connection status indicators
- [ ] Implement large touch targets (64dp minimum)
- [ ] Add accessibility support for video controls

#### 2.3 WebRTC Signaling Integration
- [ ] Create `app/src/services/webrtcService.ts` for WebRTC logic
- [ ] Implement call request: POST `/api/webrtc/call`
- [ ] Implement signal exchange: POST `/api/webrtc/signal`
- [ ] Implement call status polling: GET `/api/webrtc/call/:callId`
- [ ] Implement call ending: DELETE `/api/webrtc/call/:callId`
- [ ] Connect to WebSocket server (port 3001)
- [ ] Handle WebSocket events (call_request, call_accepted, etc.)

#### 2.4 15-Second Watchdog Timer
- [ ] Implement 15-second watchdog timer after call request
- [ ] If no response within 15 seconds → Trigger offline fallback
- [ ] Call POST `/api/watchdog` for timeout handling
- [ ] Log callback request in backend
- [ ] Notify user of callback request
- [ ] Allow user to cancel callback request

#### 2.5 Offline Fallback
- [ ] Implement callback request logging when staff unavailable
- [ ] Display "Staff unavailable" message
- [ ] Show "Request callback" option
- [ ] Log callback request in backend for staff dashboard
- [ ] Allow user to cancel callback request
- [ ] Display estimated wait time

### Dependencies
- `react-native-webrtc` - WebRTC implementation
- `react-native-incall-manager` - Incoming call handling (optional)
- `react-native-permissions` - Runtime permissions

### Skills to Use
- **webrtc-specialist** - Dedicated WebRTC implementation
- **senior-expo-dev** - Architecture and integration oversight
- **junior-expo-dev** - UI component implementation

### Acceptance Criteria
- [ ] Chat UI displays AI responses correctly
- [ ] "Talk to Official" button works
- [ ] Staff availability check works
- [ ] Video call UI displays local and remote video
- [ ] Call controls (mute, camera, end) work
- [ ] WebRTC signaling works end-to-end
- [ ] 15-second watchdog timer triggers correctly
- [ ] Offline fallback logs callback request
- [ ] Senior-friendly video call UI
- [ ] Accessibility support for video controls

### Estimated Time
- Chat UI: 3-4 hours
- Video Call UI: 6-8 hours
- WebRTC Signaling: 4-6 hours
- Watchdog Timer: 2-3 hours
- Offline Fallback: 2-3 hours
- **Total: 17-24 hours**

---

## Phase 3: Web Dashboard Enhancements

### Objective
Implement comprehensive web dashboard for barangay staff to manage requests, e-Blotter, and emergency broadcasts.

### Tasks

#### 3.1 Document Request Management
- [ ] Implement Kanban board for document requests
- [ ] Columns: Pending Review → Processing → Ready for Pickup → Completed
- [ ] Drag-and-drop functionality for status changes
- [ ] Request detail view with ID photo preview
- [ ] Approve/Reject functionality with notes
- [ ] Batch approval/rejection capability
- [ ] Search and filter requests
- [ ] Pagination for large request lists

#### 3.2 e-Blotter Management
- [ ] Implement e-Blotter list view
- [ ] Add incident detail view with evidence preview
- [ ] Implement status workflow: Under Review → Scheduled for Mediation → Resolved → Escalated
- [ ] Add mediation scheduler (calendar view)
- [ ] Schedule mediation dates and times
- [ ] Send notification to resident on scheduling
- [ ] Add incident severity indicators
- [ ] Search and filter blotter reports
- [ ] Export blotter reports

#### 3.3 Emergency Broadcast System
- [ ] Implement emergency broadcast form
- [ ] Add geotargeted evacuation map (using map library)
- [ ] Define evacuation polygons/zones
- [ ] Select residents by location for targeting
- [ ] "Ping Emergency" button to send broadcast
- [ ] Send push notifications to targeted residents
- [ ] Send email notifications to residents
- [ ] Broadcast history log
- [ ] Test broadcast delivery

#### 3.4 Staff Management
- [ ] Implement staff list view
- [ ] Add staff creation form
- [ ] Add staff edit functionality
- [ ] Add staff delete functionality
- [ ] Staff role management (Admin, Staff, Secretary)
- [ ] Staff availability toggle (for WebRTC)
- [ ] Staff activity log
- [ ] Staff authentication (Firebase Admin SDK)

#### 3.5 Analytics Dashboard
- [ ] Implement analytics overview
- [ ] Display total requests processed
- [ ] Display average processing time
- [ ] Display blotter resolution rate
- - Display active staff count
- - Display user registration metrics
- - Display emergency broadcast statistics
- - Date range filters for analytics
- - Export analytics reports

### Dependencies
- `react-beautiful-dnd` - Drag and drop for Kanban
- `react-calendar` - Calendar for mediation scheduler
- `leaflet` or `mapbox` - Map for evacuation zones
- `firebase-admin` - Firebase Admin SDK

### Skills to Use
- **junior-expo-dev** - Web dashboard component implementation
- **shadcn** - shadcn/ui component guidance

### Acceptance Criteria
- [ ] Kanban board works with drag-and-drop
- [ ] Document request status changes work
- [ ] Approve/Reject with notes works
- [ ] e-Blotter list and detail views work
- [ ] Mediation scheduler works
- [ ] Emergency broadcast form works
- [ ] Geotargeted map displays correctly
- - Emergency ping sends notifications
- [ ] Staff CRUD operations work
- [ ] Analytics display correct metrics
- [ ] All features are accessible and responsive

### Estimated Time
- Document Management: 8-10 hours
- e-Blotter Management: 6-8 hours
- Emergency Broadcast: 6-8 hours
- Staff Management: 4-6 hours
- Analytics Dashboard: 4-6 hours
- **Total: 28-38 hours**

---

## Phase 4: Integration Testing & Polish

### Objective
Comprehensive testing of all features and final polish for production readiness.

### Tasks

#### 4.1 End-to-End Testing
- [ ] Test complete onboarding flow (Welcome → Registration → Main Tabs)
- [ ] Test PSGC location selection (all 4 levels)
- [ ] Test ID verification flow (camera capture → OCR → review)
- [ ] Test document request flow (select → fill → submit → status)
- [ ] Test e-Blotter flow (select → fill → submit → status)
- [ ] Test chatbot with WebRTC escalation
- [ ] Test voice dictation on all forms
- [ ] Test profile management
- [ ] Test navigation between all screens

#### 4.2 Mobile ↔ Backend Integration
- [ ] Test all API endpoints from mobile app
- [ ] Test Firebase authentication flow
- [ ] Test PSGC API integration
- [ ] Test WebSocket signaling
- [ ] Test error handling and retry logic
- [ ] Test offline behavior
- [ ] Test loading states

#### 4.3 Web Dashboard ↔ Backend Integration
- [ ] Test document request management
- [ ] Test e-Blotter management
- [ ] Test emergency broadcast
- [ ] Test staff management
- [ ] Test analytics data retrieval
- [ ] Test WebSocket connection

#### 4.4 Performance Testing
- [ ] Test API response times (< 1 second target)
- [ ] Test mobile app performance
- [ ] Test database query performance
- [ ] Test PSGC API caching effectiveness
- [ ] Test memory usage
- [ ] Test bundle size

#### 4.5 Accessibility Testing
- [ ] Test all touch targets (48dp+ minimum)
- [ ] Test text sizes (16px+ body, 18px+ labels)
- [ ] Test color contrast (WCAG AA)
- [ ] Test screen reader support
- [ ] Test keyboard navigation
- [ ] Test voice control (if implemented)

#### 4.6 Bug Fixes & Polish
- [ ] Fix any bugs found during testing
- [ ] Polish UI/UX based on testing feedback
- [ ] Optimize performance bottlenecks
- [ ] Add loading skeletons where missing
- [ ] Improve error messages
- [ ] Add success animations
- [ ] Ensure consistent styling

### Acceptance Criteria
- [ ] All user flows work end-to-end
- [ ] All API endpoints work correctly
- [ ] No critical bugs remaining
- [ ] Performance targets met
- [ ] Accessibility requirements met
- [ ] Code is clean and documented
- [ ] Application is production-ready

### Estimated Time
- E2E Testing: 8-10 hours
- Integration Testing: 6-8 hours
- Performance Testing: 4-6 hours
- Accessibility Testing: 4-6 hours
- Bug Fixes & Polish: 8-12 hours
- **Total: 30-42 hours**

---

## Phase Dependencies

### Prerequisites for All Phases
- [ ] MongoDB running locally or configured with Atlas
- [ ] Backend server running on port 3000
- [ ] Firebase project configured
- [ ] Gemini API key configured (for OCR/chat)
- [ ] Environment variables set for all workspaces

### Phase Dependencies
- **Phase 1** (Voice-to-Text): No dependencies on other phases
- **Phase 2** (WebRTC): No dependencies on other phases
- **Phase 3** (Web Dashboard): Requires backend API to be stable
- **Phase 4** (Testing): Requires Phases 1-3 to be complete

## Parallel Execution Opportunities

Phases 1 and 2 can be executed in parallel as they are independent mobile app features.

Phase 3 (Web Dashboard) can be worked on in parallel with Phases 1 and 2 by a different agent.

Phase 4 (Testing) must wait until Phases 1-3 are complete.

## Recommended Handoff Strategy

### Option 1: Parallel Execution (Fastest)
- **Agent 1**: Phase 1 (Voice-to-Text) - 9-13 hours
- **Agent 2**: Phase 2 (WebRTC) - 17-24 hours
- **Agent 3**: Phase 3 (Web Dashboard) - 28-38 hours
- **Agent 4**: Phase 4 (Testing) - 30-42 hours (starts after Phases 1-3)

**Total Time**: 30-42 hours (parallel for Phases 1-3)

### Option 2: Sequential Execution (Simpler)
- **Agent 1**: Phase 1 → Phase 2 → Phase 4
- **Agent 2**: Phase 3 (parallel with Agent 1)

**Total Time**: 56-79 hours (partial parallel)

## Success Metrics

### Phase 1 (Voice-to-Text)
- Voice dictation works on all form fields
- Seniors can complete forms without typing
- Document submission time < 45 seconds

### Phase 2 (WebRTC)
- Chatbot responds to FAQ queries
- Video calls connect successfully
- 15-second watchdog triggers correctly
- Offline fallback logs callback requests

### Phase 3 (Web Dashboard)
- Staff can manage document requests via Kanban
- Staff can manage e-Blotter incidents
- Emergency broadcasts reach targeted residents
- Staff management works correctly
- Analytics display accurate metrics

### Phase 4 (Testing)
- All user flows work end-to-end
- No critical bugs remaining
- Performance targets met
- Accessibility requirements met
- Application is production-ready

## Handoff Notes for Cloud Agents

### Important Known Issues
1. **PSGC API**: Use nested endpoints, NOT v1 endpoints (they return 404)
2. **CameraView**: Does NOT support children - use absolute positioned overlay
3. **MongoDB**: Has retry logic (5 attempts, 3-second delays)
4. **Province Field**: Must be included in LocationData interface

### Key Files Reference
- **Architecture**: `docs/ARCHITECTURE_OVERVIEW.md`
- **API Docs**: `docs/API_DOCUMENTATION.md`
- **PRD**: `plans/PRD.md`
- **Mobile**: `app/src/` (screens, components, services, navigation)
- **Backend**: `backend/src/` (routes, models, config, ws.js)
- **Web**: `web/src/` (app, components, pages, context)

### Environment Setup
- See `docs/ENVIRONMENT_SETUP_GUIDE.md`
- Ensure MongoDB is running
- Ensure backend server is running on port 3000
- Ensure Firebase is configured
- Ensure Gemini API key is set

### Git Information
- **Current Branch**: mobile-devin
- **Main Branch**: main
- **Commit Strategy**: Commit to mobile-devin branch only (do NOT merge to main)

### Subagent Skills Available
- **senior-expo-dev** - Senior Expo developer for architecture
- **junior-expo-dev** - Junior Expo developer for implementation
- **ui-ux-designer** - UI/UX designer for senior-friendly interfaces
- **webrtc-specialist** - WebRTC implementation specialist
- **voice-integration** - Voice-to-text specialist
- **shadcn** - shadcn/ui component guidance
- **expo-deployment** - Expo deployment guidance
