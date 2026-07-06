Adding **shadcn/ui** to the web dashboard (`apps/web`) is a brilliant tactical move for a hackathon. Because it uses raw Tailwind CSS under the hood, it aligns perfectly with your existing styling configuration and gives Ana a beautiful, premium, accessible dashboard layout (accessible accessible tables, clean dropdowns, and semantic forms) with zero development overhead.

Let's integrate **shadcn/ui** cleanly into the technical stack, layout strategy, and Phase 2 development milestones.

---

# Draft MVP Development Plan: e-Kap (with shadcn/ui)

## 1. MVP Goal & Hypothesis

The primary objective of this MVP is to validate that combining multimodal AI extraction with specialized mobile UI layouts can solve systemic digital accessibility barriers for tech-averse seniors.

* **Core Hypothesis:** By leveraging **Gemini 2.5 Flash** to extract data from a physical Barangay ID card, we can bypass manual mobile keyboard input entirely, reducing the public document request submission timeline for elderly residents from **3+ minutes down to under 45 seconds**.
* **Secondary Hypothesis:** Integrating a 15-second client-side watchdog timer allows low-latency WebRTC streams to fail gracefully over to an async HTTP logging channel, ensuring citizen requests are captured even during administrative offline states.

## 2. Target Audience (MVP Focus)

* **Resident Tier (*Lolo Jaime*, Age 68):** Seniors using budget smartphones who experience extreme friction with small touchscreen typing, complex navigation, and low-contrast mobile layouts.
* **Administrative Tier (*Ana*, Age 26):** A single active Barangay Secretary processing requests, managing real-time escalations, and responding to missed connection logs through a web platform.

## 3. Core Feature Set (Prioritized Scope)

### **IN (Included in MVP Build)**

* **Silent Authentication Handshake:** Background execution of Firebase Anonymous Authentication upon cold-start to secure unique client identification tokens with zero manual sign-up steps.
* **One-Shot Registration OCR:** Mobile camera intake portal optimized for scanning a standard local Barangay ID. The image is parsed via Gemini 2.5 Flash to automatically register the user's name and address into their database profile.
* **Barangay ID Issuance Pipeline:** A dedicated document submission route focusing exclusively on automated data generation for local Barangay ID card requests.
* **Hybrid Split-Screen Viewport:** A vertically stacked layout displaying the cropped ID source snapshot on the top half and editable text fields on the bottom half—allowing high-contrast manual tap-and-type typo corrections alongside a global "Retake Photo" safety mechanism.
* **Peer-to-Peer WebRTC Channel:** A simple 1-click video/audio streaming connector that links the mobile client directly to the active web dashboard using WebSocket signaling.
* **Watchdog Offline Fallback Logger:** A 15-second client-side timing check that captures un-answered WebRTC dialing phases, alerts the resident transparently, and automatically transmits an HTTP POST payload to populate an administrative **"Missed Call / Urgencies"** dashboard registry.
* **Minimal Admin Workspace:** A clean single-page web view powered by **shadcn/ui** displaying an active Kanban lane for document processing (`Pending Review` $\rightarrow$ `Ready for Pickup`) coupled with a tabular missed call logger.

### **OUT (Deferred Post-MVP)**

* Multi-template processing engines (Barangay Clearances, Indigency Forms).
* Dynamic text field editing via Voice-to-Text Dictation (Microphone inputs).
* Interactive Natural Language Chatbot (NLU) dialogues.
* Geotargeted Crisis Hub polygons, map views, and automated mass push notifications.

## 4. Technology Stack Architecture

```
                 [ e-Kap Monorepo ]
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    /apps/web       /apps/app       /apps/server
 (React + Vite +   (Expo SDK 56 +  (Node.js + Express)
  Tailwind CSS +    NativeWind)          │
   shadcn/ui)            │               ▼
         │               │       ┌───────────────┐
         │               │       │ Firebase Auth │
         │               │       └───────────────┘
         │               │               ▼
         └───────┬───────┘       ┌───────────────┐
                 │               │Gemini 2.5 API │
                 ▼               └───────────────┘
       [ WebRTC Signaling ]              ▼
       [ Axios HTTP Loops ]      ┌───────────────┐
                                 │MongoDB (Local)│
                                 └───────────────┘

```

* **Web Dashboard (`web`):** **React (Vite) + Tailwind CSS + shadcn/ui**. Uses Radix UI primitives copied directly into the source components directory (`@/components/ui`), enabling swift, polished administrative elements (cards, headers, data tables) that look highly professional to judges.
* **Mobile Frontend (`app`):** **Expo 56 + NativeWind (Tailwind CSS)**. Accelerates interface styling while strictly honoring high-accessibility boundaries (minimum $48\times48\text{ dp}$ physical button footprints and large typography variants).
* **Backend System (`server`):** **Node.js + Express (TypeScript)**. A unified runtime handling JSON-schema enforcement with the Google AI JavaScript SDK, WebSocket signal routing for WebRTC loops, and REST endpoints.
* **Data Layer:** **Self-Hosted MongoDB + Firebase Auth**. Utilizes local MongoDB document collections to fluidly ingest unstructured JSON data streams direct from Gemini without rigid relational schemas.

## 5. High-Level Development Roadmap

### Phase 1: Foundations, Storage & Intelligent Intake (Days 1–3)

* Spin up the monorepo workspace; initialize the Express app and configure your self-hosted local MongoDB collection routes.
* Initialize **shadcn/ui** inside `apps/web` via `npx shadcn@latest init`, linking the root utility variables directly with Vite and Tailwind config setups.
* Integrate the Firebase Anonymous Authentication SDK onto the Expo mobile client initialization loop.
* Construct the backend Express controller for the **Gemini 2.5 Flash Free Tier**, passing image buffers with a strict structural system prompt instructing a clean JSON response format.

### Phase 2: Split Viewports, Web Tables & Real-Time Media Lanes (Days 4–7)

* Build the mobile split-screen review component layout with large, high-contrast inputs.
* Add **shadcn/ui** structural primitives (`npx shadcn add card table badge dialog loops`) to curate the admin view. Assemble Ana's layout container, using responsive grid components for the Kanban column pipeline and incoming stream containers.
* Implement standard HTML5 WebSocket signaling endpoints inside the Express server to pipe WebRTC SDP (Session Description Protocol) handshakes back and forth.

### Phase 3: Watchdog Fallbacks, Accessibility Guardrails & Launch (Days 8–10)

* Wire the 15-second client-side timing check into the mobile calling view to trigger the automated HTTP POST payload to MongoDB on failure.
* Enforce structural accessibility settings: high-contrast color pairings, absolute minimum text scale targets of $18\text{ px}$ for labels, and explicit field bounding lines.
* Run baseline end-to-end transaction timing runs to verify that the complete lifecycle from camera snap to document request logs under 45 seconds.

## 6. Testing Strategy

* **Who Tests:** The development team will simulate *Lolo Jaime's* persona using budget Android test models and varying room illumination levels to intentionally stress-test the Gemini OCR threshold.
* **Methodology:**
* **The Stopwatch Test:** Manually counting the seconds between clicking "Capture ID" and completing the registration checkout window to assert compliance with the 45-second performance constraint.
* **The Disconnect Test:** Severing the local dashboard network link mid-dial to verify that the client application registers an explicit fallback record in MongoDB within 2 seconds of the 15-second timeout drop.



## 7. Deployment Approach

* **Local Infrastructure Loop:** Due to the fast-paced nature of a hackathon and the self-hosted database architecture, everything will run within a localized network ecosystem.
* **Execution Mapping:** The Express backend and MongoDB server run on a development machine exposed via local network endpoints or tunnels (like Ngrok) to feed requests from physical smartphones connected to the same environment.

## 8. Key Success Metrics

* **Execution Pace:** $\ge 85\%$ of successful automated profiles created and checked out in **under 45 seconds** total processing time.
* **Parsing Fidelity:** Gemini 2.5 Flash executing valid JSON extractions with a structural field accuracy rate of **$\ge 90\%$** on baseline test cards.
* **Graceful Recovery:** 100% of un-answered or interrupted WebRTC calls translating automatically into a persistent document row inside the administrative backup database registry.

## 9. Critical Risks & Strategic Mitigations

* **Risk: Gemini API Rate Throttling (Free Tier Limits).** The Google AI Studio free tier enforces a ceiling of 10 requests per minute. During a live hackathon presentation or multi-user testing phase, concurrent image processing will exhaust this instantly.
* *Mitigation:* Implement a local caching middleware in your Express server. If a specific test ID has already been parsed during dry-runs, serve the pre-saved JSON response directly from MongoDB instead of executing an external call to the live Gemini API endpoint.


* **Risk: Network Signaling Failures over WebRTC.** WebRTC requires stable peer connections. Firewall settings on local routers can block streaming pathways entirely.
* *Mitigation:* Ensure both the mobile test phone and the administrator laptop reside on a unified local hotspot network band. If media lines fail completely, confirm that your 15-second watchdog instantly handles the problem gracefully by displaying the "Offline Fallback Logged" feedback message to the user via a shadcn toast message framework.