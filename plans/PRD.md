

---

# Product Requirements Document (PRD)

## Project Name: e-Kap

**A Monorepo Cloud-Based Barangay Management and Citizen Service Portal**

---

## 1. Introduction & Overview

**e-Kap** is an inclusive, accessible, cloud-based platform designed to bridge the digital divide between local barangay local government units (LGUs) and their citizens. Built specifically with empathetic UX engineering, the platform ensures that even tech-averse individuals and senior citizens can easily request public documents, file official incident reports (e-Blotter), receive emergency updates, and communicate with local officials.

The system utilizes a monorepo architecture split into three distinct environments sharing a unified TypeScript language foundation:

* **`app` (Mobile Client):** An intuitive, high-accessibility Expo client dedicated to residents.
* **`web` (Web Dashboard):** A clean, administrative command center for Barangay Staff and Administrators.
* **`server` (Backend System):** A Node.js/Express API handling data processing, Gemini AI orchestration, and WebRTC signaling.

---

## 2. Goals & Objectives (Hackathon SMART Metrics)

* **The "Zero-Typing" Accessibility Target:** Decrease document submission times for senior citizens from **3+ minutes down to under 45 seconds** by leveraging Gemini Vision OCR auto-filling and voice-to-text dictation.
* **The "First-Responder" Latency Target:** Maintain an end-to-end payload latency of **under 3 seconds** from the moment an official triggers a localized emergency ping to the arrival of the push notification on resident devices.
* **Streamlined Incident Reporting (e-Blotter):** Digitize 100% of the initial incident reporting workflow, reducing the time residents spend physically waiting in the barangay hall to file complaints by providing an at-home, evidence-backed submission flow.
* **Human-in-the-Loop Resolution:** Provide a fluid fallback from automated AI chat to live WebRTC audio/video consultations within **2 clicks** if the chatbot hits its boundaries.

---

## 3. Target Audience & User Personas

### Resident (e.g., "Lolo Jaime", Age 68)

* **Characteristics:** Uses a budget smartphone; has low visual acuity; gets frustrated by complex menus, small text fields, and extensive typing on mobile keyboards.
* **Needs:** A straightforward way to order a Certificate of Indigency, file a noise complaint without leaving home, get clear guidance on requirements, and receive instant crisis alerts.

### Barangay Staff / Secretary (e.g., "Ana", Age 26)

* **Characteristics:** Comfortable with web tools but heavily swamped with daily manual paperwork, walk-in requests, and tracking ongoing neighborhood disputes.
* **Needs:** A centralized dashboard to quickly review resident registrations, approve document requests, manage e-Blotter mediation schedules, and manage evacuation area alerts.

### Administrator (Barangay Captain / IT Admin)

* **Characteristics:** Needs high-level transparency over staff operations and community metrics.
* **Needs:** Audit logs, staff credential provisioning, and micro-analytics regarding total requests processed and dispute resolution rates.

---

## 4. Functional Requirements

### 4.1 Mobile Application (`app` - Expo)

#### Onboarding & Location Validation

* **PSGC Integration:** Users must register by drilling down through geographic dropdowns (Region $\rightarrow$ City/Municipality $\rightarrow$ Barangay) populated dynamically via the `[https://psgc.cloud/api-docs](https://psgc.cloud/api-docs)` endpoints.
* **Identity Upload (Mock Verification):** To pass registration, residents must snap a picture of a valid Barangay ID, National ID, or any government-issued ID card.

#### "Zero-Typing" Document Requests

* **Gemini Vision Form Pre-Filling:** Residents take a picture of their ID card. The backend processes the image via Gemini API (Multimodal Mode) to instantly extract text data and auto-populate the document request form (e.g., Barangay Clearance, Certificate of Indigency, Barangay ID).
* **Voice-to-Text Assistance:** Every primary input form features a single-tap microphone icon allowing users to dictate edits or notes directly into text fields without typing.

#### e-Blotter / Incident Reporting Module

* **Digital Complaint Filing:** Residents can file incident reports (e.g., noise complaints, property disputes) directly from the app.
* **Media Attachments & Voice Dictation:** Users can upload photo/video evidence from their camera roll and use the voice-to-text feature to dictate the narrative of the incident, removing the need to type long paragraphs.
* **Status & Mediation Tracking:** Residents can track the status of their filed blotter and view scheduled dates for face-to-face mediation at the barangay hall.

#### Gemini Intelligent Concierge & Live Escalation

* **FAQ & Navigation AI:** A lightweight chatbot interface running on the frontend context to answer inquiries about office hours, document prerequisites, and tracking numbers.
* **WebRTC Escalation Protocol:** If the resident is confused or explicitly requests a human, the AI chatbot presents a "Talk to an Official" button.
* *Protocol 1 (Online):* If a staff member is logged into the web dashboard, a real-time WebRTC audio/video session initializes.
* *Protocol 2 (Offline Fallback):* If no official is active, the app alerts the user and logs an urgent call-back request on the staff dashboard.



---

### 4.2 Web Dashboard (`web` - React)

#### Staff Workspace & Document Processing

* **Document Queue:** A clean Kanban or list interface mapping requests through strict cyclical pipelines: `Pending Review` $\rightarrow$ `Processing` $\rightarrow$ `Ready for Pickup` $\rightarrow$ `Completed`.
* **Rejection Flow:** Staff can reject a request if verification materials are illegible, attaching a customized note that instantly triggers a push alert back to the resident's device.

#### Blotter & Mediation Management Command

* **Incident Log (e-Blotter):** A secure, private interface for staff to review incoming citizen complaints and attached evidence.
* **Case Lifecycle Pipeline:** Staff can move blotter cases through statuses: `Under Review` $\rightarrow$ `Scheduled for Mediation` $\rightarrow$ `Resolved` $\rightarrow$ `Escalated to Police (PNP)`.
* **Mediation Scheduler:** A built-in calendar tool to set hearing/mediation dates, which automatically pushes a notification to the involved resident's mobile app.

#### First-Responder Emergency System

* **Geotargeted Evacuation Maps:** An administrative mapping portal where staff can pre-define localized evacuation polygons or zones.
* **Emergency Ping Broadcast:** In a crisis, an official hits a "Ping Emergency" button, triggering localized push notifications and emails to all residents inside that marked area.

#### Admin Terminal

* **Account Management:** Full CRUD mechanisms over Staff/Secretary platform credentials.
* **Analytics & Security:** High-level logs tracking operational speeds, daily processing counts, blotter resolution rates, and system activity logs.

---

## 5. Non-Functional Requirements & Design Constraints

### 5.1 Usability & Accessibility (Tailwind/NativeWind)

* **Visual Enhancements:** High-contrast color palette variants out-of-the-box ensuring legible reading contrasts.
* **Tap Targets:** No interactive button or chip can be scaled smaller than 48x48 density-independent pixels (dp) to cater to elderly motor control constraints.
* **Font Controls:** The application architecture must support dynamic scaling options with high-contrast text sizing.

### 5.2 Security & System Guardrails

* **Authentication & Privacy:** Firebase OAuth2 manages secure resident registrations. e-Blotter data must be strictly access-controlled, visible only to authorized staff/admins to protect resident privacy during ongoing disputes.
* **AI Safety Guardrails:** Strict prompt-engineering bounds on the Gemini API to prevent prompt injection or off-topic conversational responses.
* **Rate-Limiting:** Express middleware restricts chatbot and blotter submission API requests per user session to prevent spam and API credit exhaustion during the hackathon run.

---

## 6. Architecture & Tech Stack Reference

```
                   [ e-Kap Monorepo ]
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   /apps/web         /apps/app         /apps/server
 (React + Tailwind) (Expo 56 + NativeWind) (Node.js + Express)
         │                 │                 │
         │                 │                 ▼
         │                 │         ┌────────────────┐
         │                 │         │  Firebase Auth │
         │                 │         └────────────────┘
         │                 │                 ▼
         └─────────┬───────┘         ┌────────────────┐
                   │                 │   Gemini API   │
                   ▼                 └────────────────┘
         [ Axios HTTP Fetching ]             ▼
         [ WebRTC Signaling    ]     ┌────────────────┐
         [ Firebase Storage    ]     │  PSGC Cloud API│
                                     └────────────────┘

```