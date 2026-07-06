# Barangay Management App — Comprehensive Feature Research Report

> **Researched by**: Project Manager Agent (via Researcher Subagent)
> **Date**: July 6, 2026
> **Context**: Full-stack project with React Native/Expo mobile app (`/app`), React+Vite web frontend (`/web`), Express.js+TypeScript backend (`/backend`), and Cloudflare ecosystem.

---

## Executive Summary

After researching existing solutions (OneBarangay, Barangay365, BarangayCloud, EBARANGAY, BARS, BiSiG, DILG's LGUSS-BIMS), academic papers, and Philippine legal frameworks (RA 7160 Local Government Code, RA 9262 VAWC, RA 10173 Data Privacy Act, RA 11310 4Ps, Anti-Red Tape Act), this report documents every feature category for the Barangay Management App.

**Confirmed Tech Stack:**
- **Mobile app (`/app`)**: React Native / Expo v56
- **Web frontend (`/web`)**: React 19 + Vite 8
- **Backend API (`/backend`)**: Express.js 5 + TypeScript
- **Cloudflare**: Workers, D1, KV, Turnstile, Email (skills available)
- **Styling**: Tailwind CSS v4 (via NativeWind for mobile)

---

## 1. DOCUMENT MANAGEMENT & CERTIFICATE ISSUANCE

This is the **highest-volume** service in any barangay. Most day-to-day transactions involve issuing certificates and clearances.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 1.1 | **Barangay Clearance** | Issue the standard clearance certifying good standing, no derogatory record. Include fee tracking, auto-compute fees per local ordinance. | **MVP** | Both (web for admin, mobile for requests) |
| 1.2 | **Certificate of Residency** | Certify that a person is a resident of the barangay. Pull data from resident records. | **MVP** | Both |
| 1.3 | **Certificate of Indigency** | For residents seeking financial aid, medical assistance, or government subsidies. Requires income/asset verification workflow. | **MVP** | Both |
| 1.4 | **Certificate of Good Moral Character** | Often needed for employment or school. Must check blotter records first. | **MVP** | Both |
| 1.5 | **First-Time Jobseeker Certificate** | Under RA 11261 (First-Time Jobseekers Assistance Act). Must be free of charge. | **MVP** | Both |
| 1.6 | **Business Clearance / Permit** | For businesses operating within the barangay. Includes gross receipt declaration, fee computation per revenue ordinance. | **MVP** | Web (complex) + Mobile (request) |
| 1.7 | **Special Permits** | Events, fiestas, road closures, public gatherings, film shoots, bingo permits. | **Future** | Both |
| 1.8 | **Pet Registration** | Register pets, track anti-rabies vaccination status. Common requirement in many barangays. | **Future** | Both |
| 1.9 | **Barangay ID** | Issue official barangay IDs with photo, QR code, and expiry tracking. | **Future** | Both |
| 1.10 | **Document Template Engine** | Configurable templates for all documents with merge fields (resident name, address, date, etc.). Supports dynamic content per barangay ordinance. | **MVP** | Web |
| 1.11 | **QR Code Verification** | Every issued document gets a unique QR code. Anyone (employers, schools, agencies) can scan to verify authenticity. | **Future** | Both |
| 1.12 | **Online Document Request Portal** | Residents submit requests via mobile/web, track status, receive notifications when ready. No need for multiple trips. | **Future** | Both |
| 1.13 | **Document Archiving & Retrieval** | Searchable archive of all issued documents with filters (date range, document type, resident name). | **MVP** | Web |
| 1.14 | **Official Receipt Generation** | Auto-generate official receipts (OR) for all paid transactions. Tie to treasurer module. | **MVP** | Both |

### 🇵🇭 Philippine Context Notes
- **Legal basis**: RA 7160 (Local Government Code), Anti-Red Tape Act (RA 9485 as amended by RA 11032) — requires finishing simple transactions in **1 working day**.
- **Fees**: Governed by local Barangay Revenue Ordinance. Personal clearances typically ₱20–₱100; business permits ₱300–₱1,000. The system must allow configurable fee schedules per barangay.
- **Cedula**: Community Tax Certificate (Cedula) may still be required by some barangays — system should track cedula status.
- **Free issuance**: First-Time Jobseeker certificates must be **free of charge** per RA 11261.
- **QR verification** is becoming a key differentiator (used by OneBarangay) — prevents document fraud.

---

## 2. RESIDENT / CONSTITUENT MANAGEMENT

The core registry of every person and household in the barangay.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 2.1 | **Household Registration** | Register households with address, head of family, geolocation/pin on map. | **MVP** | Both |
| 2.2 | **Individual Resident Profiles** | Full profile: full name, birth date, place of birth, gender, civil status, citizenship, contact info, photo, biometrics (optional). | **MVP** | Both |
| 2.3 | **Demographic Tagging** | Tag residents as: Senior Citizen, PWD, Solo Parent, 4Ps Beneficiary, Indigenous Person (IP), OFW, Voter, Student, etc. | **MVP** | Both |
| 2.4 | **Household Relationship Mapping** | Track family trees, relationships within and across households (for census purposes). | **MVP** | Web |
| 2.5 | **Population Census Management** | Generate periodic census reports, track population growth, age distribution, male/female ratio. | **MVP** | Web |
| 2.6 | **Resident Search & Filter** | Quick search by name, address, tag, age range, etc. Autocomplete for fast lookup during transactions. | **MVP** | Both |
| 2.7 | **Death Record Management** | Record deaths, update household status, generate death certificates. | **MVP** | Both |
| 2.8 | **Resident Transfer/Migration Tracking** | Track residents moving in/out of the barangay (internal migration). Important for updating population data. | **Future** | Both |
| 2.9 | **Voter Registration Status** | Link to COMELEC records or allow residents to indicate voter registration status. | **Future** | Both |
| 2.10 | **Importer / Exporter** | CSV/Excel import for initial data load from legacy systems or manual records. Export for DILG reporting. | **MVP** | Web |
| 2.11 | **Duplicate Detection** | Flag potential duplicate resident records based on name, birth date, address similarity. | **MVP** | Web |
| 2.12 | **National ID (PhilID) Integration** | Link resident records to Philippine National ID (PhilSys ID) for verification. | **Future** | Both |

### 🇵🇭 Philippine Context Notes
- **PhilSys (National ID)** integration would be powerful for identity verification but requires PhilSys compliance. Start with basic fields and plan for future linkage.
- **Demographic tags** are critical for targeting social services: Senior Citizens (RA 9994), PWDs (RA 10754), Solo Parents (RA 8972), 4Ps (RA 11310).
- **Census data** is periodically required by DILG, PSA, and the City/Municipal Planning Office.
- **Data Privacy**: RA 10173 (Data Privacy Act) is strictly enforced. All resident data must have proper consent mechanisms, access control, and audit trails.

---

## 3. COMPLAINTS & INCIDENT REPORTING (Blotter System)

The **Katarungang Pambarangay (KP)** system is the Philippine community justice system. It's a critical function of every barangay.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 3.1 | **Blotter Entry** | Record incidents with: date/time, location, type (physical injury, theft, vandalism, VAWC, etc.), narrative description. | **MVP** | Both |
| 3.2 | **Complainant / Respondent / Witness Management** | Capture full details of all parties involved in an incident. Link to resident database. | **MVP** | Both |
| 3.3 | **Incident Categorization** | Categorize incidents (VAWC, physical injury, property dispute, cybercrime, etc.) for analytics and reporting. | **MVP** | Both |
| 3.4 | **Blotter Numbering System** | Auto-generate sequential blotter numbers (standard format: year-sequence). | **MVP** | Backend |
| 3.5 | **Case Status Tracking** | Track lifecycle: Filed → For Mediation → For Conciliation → For Arbitration → Resolved / Endorsed to Court / Dismissed. | **MVP** | Both |
| 3.6 | **VAW Desk Module** | Specialized workflow for Violence Against Women and Children (RA 9262) cases. Confidential handling, referral tracking, protection order management. | **Future** | Both |
| 3.7 | **Summons & Subpoena Generation** | Generate summon letters for respondents to appear at the barangay hall. Track delivery and acknowledgment. | **MVP** | Web |
| 3.8 | **Hearing / Mediation Scheduling** | Schedule KP hearings, mediation sessions. Auto-reminders to parties. Calendar view. | **MVP** | Both |
| 3.9 | **Settlement / Kasunduan Management** | Record amicable settlements (Kasunduan). Generate settlement documents with digital signatures. | **MVP** | Web |
| 3.10 | **Referral to PNP / Court** | Track referrals to higher authorities (Philippine National Police, Prosecutor's Office, Court). | **MVP** | Both |
| 3.11 | **Certificate to File Action** | Issue the certificate that allows a complainant to bring the case to court (after failed mediation). | **MVP** | Web |
| 3.12 | **Lupon Member Management** | Register Lupon Tagapamayapa members, their terms, schedules. | **Future** | Web |
| 3.13 | **Blotter Reports & Analytics** | Crime statistics reports, monthly blotter summaries, incident hotspots (map-based). | **MVP** | Web |
| 3.14 | **Confidentiality Controls** | Sensitive case types (VAWC, minor-related) restricted to authorized personnel only. | **MVP** | Both |

### 🇵🇭 Philippine Context Notes
- **KP Handbook** (DILG) governs the barangay justice system procedures. The system must follow the prescribed flow: Mediation → Conciliation → Arbitration.
- **RA 9262 (VAWC)**: Requires strict confidentiality. VAW Desk officers have special training. Separate, restricted access is mandatory.
- **The 30-day period**: KP has 30 days to resolve disputes (extendable by another 15 days). The system should enforce/track these deadlines.
- **Certificate to File Action**: Issued when KP fails to settle — this is the document that allows filing in regular courts.
- **Blotter as legal evidence**: The blotter book is a legal document. Digital blotters must be tamper-proof with audit trails.

---

## 4. FINANCIAL MANAGEMENT

The Barangay Treasurer's module. Covers collections, disbursements, budgeting, and reporting.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 4.1 | **Collection Management** | Record all collections: clearance fees, permit fees, community tax (cedula), rental of barangay facilities, fines/penalties. | **MVP** | Both |
| 4.2 | **Official Receipt (OR) Issuance** | Generate official receipts with sequential OR numbers, auto-populate from transaction. Print or digital. | **MVP** | Both |
| 4.3 | **Cashiering / Daily Settlement** | End-of-day cashier balancing: total collections per type, cash vs. digital payments, remittance tracking. | **MVP** | Web |
| 4.4 | **Community Tax (Cedula) Collection** | Track annual community tax per resident/business. Integrate with resident records. | **MVP** | Both |
| 4.5 | **Barangay Budget Management** | Annual budget planning: allocation to programs (peace & order, health, infrastructure, etc.). Track original vs. actual. | **Future** | Web |
| 4.6 | **Disbursement Tracking** | Record expenses, track liquidation, attach receipts. Link to budget lines. | **Future** | Web |
| 4.7 | **Financial Reports** | Generate: Statement of Receipts & Expenditures (SRE), Monthly Collection Report, Annual Financial Report (per COA format). | **MVP** | Web |
| 4.8 | **Property & Asset Inventory** | Track barangay assets (furniture, equipment, vehicles, buildings). Borrowing/checkout system for equipment. | **Future** | Web |
| 4.9 | **Barangay Share Tracking** | Track shares from national taxes (IRA), real property tax, community tax collections. | **Future** | Web |
| 4.10 | **Digital Payment Integration** | GCash, Maya, PayMaya, bank transfers for fee payments. Reduces cash handling. | **Future** | Both |
| 4.11 | **Audit Trail** | Every financial transaction logged with user, timestamp, and action. | **MVP** | Backend |

### 🇵🇭 Philippine Context Notes
- **COA Rules**: The Commission on Audit prescribes the exact Chart of Accounts and reporting formats for barangays (Philippine Public Sector Accounting Standards).
- **Bank deposits**: Collections must be deposited within **24 hours** per COA rules. System should track deposit compliance.
- **IRA**: Internal Revenue Allotment is the barangay's share from national taxes — typically the largest revenue source.
- **Receipt format**: Official Receipts must follow BIR-prescribed format. Many barangays still use pre-numbered OR booklets.
- **Fee ordinances**: Each barangay's revenue ordinance sets the exact fees — must be configurable.
- **Digital payments**: While high-tech, this is a **game-changer** for transparency. Many residents now prefer GCash.

---

## 5. ANNOUNCEMENTS, ALERTS & COMMUNICATIONS

Keeping the community informed and engaged.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 5.1 | **Barangay Bulletin Board** | Post announcements, ordinances, meeting schedules, project updates. Category & priority tagging. | **MVP** | Both |
| 5.2 | **Push Notifications** | Send mobile push notifications for urgent announcements, meeting reminders, document ready for pickup. | **MVP** | Mobile |
| 5.3 | **SMS Broadcast** | Send SMS alerts (especially important in areas with limited data connectivity). Integrate with SMS gateway. | **Future** | Backend |
| 5.4 | **Emergency Alerts** | Critical alerts: typhoon warnings, flood evacuation orders, fires, earthquakes. Bypass notification preferences. | **Future** | Both |
| 5.5 | **Community Calendar** | Upcoming events: meetings, fiestas, medical missions, cleanup drives, sports fests. | **Future** | Both |
| 5.6 | **Feedback & Suggestions Box** | Anonymous or attributed feedback from residents. Categorize, assign to action. | **Future** | Both |
| 5.7 | **Citizen's Charter Display** | Digitally display the mandated Citizen's Charter (steps, fees, processing times per service). | **Future** | Web |
| 5.8 | **Ordinance & Resolution Repository** | Searchable database of all barangay ordinances and resolutions with full text, dates, and status. | **Future** | Web |

### 🇵🇭 Philippine Context Notes
- **SMS is critical**: Internet penetration is still limited in many rural barangays. SMS remains the most reliable communication channel. Consider APIs like Chikka, Twilio, or Semaphore.
- **PAGASA integration**: For flood and typhoon alerts, direct API integration with PAGASA's weather data would be valuable (OneBarangay already does this).
- **Local languages**: Content may need to be in Filipino, Cebuano, Ilocano, etc. depending on region. Consider i18n support.
- **Citizen's Charter**: Legally mandated by the Anti-Red Tape Act — must be posted conspicuously. A digital version fulfills this requirement.

---

## 6. APPOINTMENTS & QUEUE MANAGEMENT

Streamlining the resident experience at the barangay hall.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 6.1 | **Walk-in Queue System** | Digital queue (number ticket) for walk-in residents at the barangay hall. Display screen (or web dashboard) shows current serving number. | **Future** | Web + Kiosk |
| 6.2 | **Online Appointment Booking** | Residents book appointments for specific services (clearance, permit, blotter filing). Select date/time/slot. | **Future** | Both |
| 6.3 | **Service Counter Management** | Assign staff to counters, manage service types per counter. | **Future** | Web |
| 6.4 | **Appointment Reminders** | Auto-reminders (push/SMS) 1 day and 1 hour before the appointment. | **Future** | Both |
| 6.5 | **Document Request Tracking** | Residents check status of their document requests (Processing / Ready for Release / Released). | **MVP** | Both |
| 6.6 | **Service Time Monitoring** | Track average processing time per service type. Identify bottlenecks (required by Anti-Red Tape Act). | **Future** | Web |

### 🇵🇭 Philippine Context Notes
- **High walk-in volume**: In most barangays, residents simply walk in. The queue system should accommodate walk-ins alongside appointments.
- **Kiosk mode**: Barangays with higher budgets might deploy physical kiosks. Consider this as an optional add-on.
- **Anti-Red Tape Act compliance**: Mandates posted service standards including max processing times. The system should track and display compliance.

---

## 7. HEALTH & SOCIAL SERVICES

For the Barangay Health Center (BHC) and social welfare functions.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 7.1 | **Health Center Patient Registry** | Link residents to health records. Track medical history, allergies, chronic conditions. | **MVP** | Both |
| 7.2 | **Vaccination Tracking** | Record vaccinations (childhood immunization, COVID-19, anti-rabies). Track schedule compliance, send reminders. | **MVP** | Both |
| 7.3 | **Maternal & Child Health** | Track pregnant women, prenatal checkups, postnatal care, baby delivery records. | **Future** | Both |
| 7.4 | **Family Planning Registry** | Record family planning method preferences, counseling sessions, supply distribution. | **Future** | Both |
| 7.5 | **Senior Citizen Benefits** | Track senior benefits (RA 9994): discounts, pension status, social pension distribution. | **Future** | Both |
| 7.6 | **PWD Registry** | Register Persons with Disabilities (RA 10754), track benefits, accessibility needs. | **Future** | Both |
| 7.7 | **4Ps Beneficiary Management** | Track Pantawid Pamilya (RA 11310) beneficiaries in the barangay, compliance monitoring (health checkups, school attendance). | **Future** | Web |
| 7.8 | **Medical Mission Scheduling** | Organize medical/dental missions, track attendees, services rendered. | **Future** | Both |
| 7.9 | **Medicine & Supply Inventory** | Track health center supplies, medicine stock, expiry dates. Reorder alerts. | **Future** | Web |
| 7.10 | **Nutrition Program Tracking** | Barangay Nutrition Scholar (BNS) functions: weigh-ins, underweight tracking, feeding program management. | **Future** | Both |
| 7.11 | **BHW / BNS Attendance & Reporting** | Track health worker attendance, home visit logs, monthly accomplishment reports for MHO. | **Future** | Mobile |
| 7.12 | **Referral Tracking** | Track referrals from BHC to City Health Office, hospitals, other facilities. | **Future** | Both |

### 🇵🇭 Philippine Context Notes
- **BHW (Barangay Health Workers)**: Volunteer health workers who are the frontline of community health. The system must be easy enough for BHWs with varying tech literacy.
- **MHO Reporting**: Barangay health centers report to the Municipal/City Health Office. Reports should match DOH formats.
- **Offline capability**: Health workers in remote areas often have no internet. Offline-first data entry with sync later is highly desirable.
- **PhilHealth**: Integration or at least reference to PhilHealth membership numbers for patients.
- **RHUs**: Rural Health Units manage multiple barangays. The system should support multi-barangay health data aggregation.

---

## 8. DISASTER RISK REDUCTION & MANAGEMENT (DRRM)

Very relevant in a typhoon-prone country with active volcanoes and earthquakes.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 8.1 | **Evacuation Center Management** | Register evacuation centers, track capacity, occupancy during disasters. | **Future** | Both |
| 8.2 | **Evacuee Registration** | Register evacuees at centers, track families, special needs (elderly, PWD, pregnant, infants). | **Future** | Mobile |
| 8.3 | **Relief Goods Distribution** | Track relief goods inventory, distribution schedules, per-family distribution records. | **Future** | Both |
| 8.4 | **Hazard Mapping** | Mark flood-prone areas, landslide-prone zones, earthquake fault lines on barangay map. | **Future** | Web |
| 8.5 | **PAGASA Weather Integration** | Display real-time weather data, rainfall levels, flood warnings from PAGASA. | **Future** | Both |
| 8.6 | **Emergency Alert Broadcast** | Send mass alerts (push + SMS) for imminent disasters. Target-specific zones. | **Future** | Backend |
| 8.7 | **Pre-disaster Preparation Checklist** | Track preparedness: sandbags, generator fuel, first aid supplies, radio comms check. | **Future** | Mobile |
| 8.8 | **Incident Reporting (Disasters)** | Report fire, flood, earthquake, landslide incidents. Attach photos, location. | **Future** | Mobile |
| 8.9 | **BDRRMC Management** | Barangay Disaster Risk Reduction & Management Committee: meeting minutes, plans, member roster. | **Future** | Web |
| 8.10 | **Contingency Planning** | Digital contingency plans for various disaster scenarios, accessible offline. | **Future** | Both |

### 🇵🇭 Philippine Context Notes
- **20+ typhoons/year**: The Philippines averages 20 tropical cyclones annually. This is *not* a nice-to-have feature — it's a core governance function.
- **PAGASA API**: There are public weather data feeds from DOST-PAGASA. Some private systems (OneBarangay, Barangay365) already integrate with these.
- **DILG Mandatory**: Barangays are required by law (RA 10121) to have BDRRM Plans and conduct regular drills.
- **Offline-critical**: During disasters, internet and power are often down. The system must work offline and sync when connectivity returns.
- **Coordination**: Barangay DRRM coordinates with City/Municipal DRRMO. Data sharing/reporting must be possible.

---

## 9. MAP & GEOGRAPHIC FEATURES

Spatial data for barangay planning and management.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 9.1 | **Barangay Boundary Map** | Display barangay territorial boundaries. Show sub-units: puroks, sitios, zones. | **Future** | Web |
| 9.2 | **Purok/Zone Management** | Manage purok leaders, purok boundaries, per-purok resident lists and statistics. | **Future** | Both |
| 9.3 | **Resident Geolocation** | Pin resident households on map. Enable "find nearest" for health workers doing home visits. | **Future** | Both |
| 9.4 | **Establishment Map** | Mark businesses, schools, churches, health centers, government offices on map. | **Future** | Both |
| 9.5 | **Incident Heatmap** | Visualize crime/incident hotspots on map (for peace & order planning). | **Future** | Web |
| 9.6 | **Map-based Census** | Visualize demographic data per purok/zone on interactive map. | **Future** | Web |
| 9.7 | **Navigation / Routing** | For health workers navigating to households for home visits. | **Future** | Mobile |

### 🇵🇭 Philippine Context Notes
- **Google Maps / OpenStreetMap**: Use OSM for public maps to save costs. Google Maps API can get expensive at scale.
- **Purok System**: The purok is a subdivision of the barangay — each has a leader (Purok President). This is a fundamental organizational unit.
- **Land ownership data**: Be cautious — land disputes are common. Don't store cadastral/land title data unless specifically required and legally reviewed.

---

## 10. AUTHENTICATION, ROLES & PERMISSIONS

Multi-level access control for different barangay personnel and residents.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 10.1 | **Role-Based Access Control (RBAC)** | Roles: Super Admin, Punong Barangay (Captain), Secretary, Treasurer, Health Worker, Tanod, Lupon Member, Resident, Purok Leader. | **MVP** | All |
| 10.2 | **User Registration & Login** | Email/password, OTP via SMS, Google Sign-In options. | **MVP** | All |
| 10.3 | **Resident Self-Registration** | Residents can create their own accounts, link to their household record. Requires barangay verification. | **MVP** | Both |
| 10.4 | **Admin User Management** | Create, edit, deactivate staff accounts. Assign roles and permissions. | **MVP** | Web |
| 10.5 | **Activity Logs / Audit Trail** | Log all user actions: create, read, update, delete operations with timestamp, user, IP. | **MVP** | Backend |
| 10.6 | **Two-Factor Authentication (2FA)** | Optional 2FA for admin accounts (especially Treasurer, Captain). | **Future** | All |
| 10.7 | **Session Management** | Force logout on inactivity, view active sessions, remote logout. | **Future** | Backend |
| 10.8 | **Data Privacy Consent Management** | Capture and manage resident consent for data processing per RA 10173. Record when/which consent given. | **MVP** | Backend |

### 🇵🇭 Philippine Context Notes
- **Shared devices**: Many barangay staff share computers. Session management and auto-logout are critical.
- **Punong Barangay (Captain)**: Has access to all data but may delegate operations to Secretary.
- **Treasurer**: Needs financial module only, no access to health records or sensitive blotter data.
- **Tanod**: Needs blotter entry access but not financial or health data.
- **Residents**: Self-service access to their own records, document requests, announcements.
- **Data Privacy Act compliance**: NPC (National Privacy Commission) registration may be needed. Consent records are legally required.

---

## 11. ANALYTICS, DASHBOARD & REPORTING

Data-driven governance with visual dashboards and automated reporting.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 11.1 | **Executive Dashboard** | Barangay Captain's overview: population stats, revenue collections, pending documents, blotter cases, upcoming events. | **MVP** | Both |
| 11.2 | **Population Demographics Dashboard** | Charts: age pyramid, male/female ratio, civil status distribution, top tags (senior, PWD, solo parent). | **MVP** | Web |
| 11.3 | **Financial Dashboard** | Revenue vs. expenses, collection targets vs. actual, daily/monthly collection trends. | **MVP** | Web |
| 11.4 | **Peace & Order Dashboard** | Blotter case trends, resolution rates, incident type breakdown, VAWC case tracker. | **MVP** | Web |
| 11.5 | **Service Transaction Reports** | Number of clearances issued, documents released, average processing time (Anti-Red Tape compliance reporting). | **MVP** | Web |
| 11.6 | **Health Program Reports** | Vaccination coverage, maternal health indicators, nutrition status, BHW accomplishments. | **Future** | Web |
| 11.7 | **DRRM Reports** | Evacuation statistics, relief distribution reports, disaster incident summaries. | **Future** | Web |
| 11.8 | **Export to PDF/Excel** | All reports exportable in PDF (for submission) and Excel (for further analysis). | **MVP** | Web |
| 11.9 | **Custom Report Builder** | Drag-and-drop report builder for ad-hoc queries. | **Future** | Web |
| 11.10 | **DILG Compliance Reports** | Pre-built report templates matching DILG submission requirements (quarterly, annual). | **Future** | Web |

### 🇵🇭 Philippine Context Notes
- **DILG Reporting**: Barangays submit regular reports to DILG (e.g., Barangay Governance Performance Management System). Reports matching DILG format are a **huge selling point**.
- **COA Financial Reports**: Must match COA prescribed formats — Statement of Receipts & Expenditures, Budget Execution Report.
- **MHO Reports**: Health reports must match DOH format for submission to City/Municipal Health Office.
- **Data export**: Many barangay secretaries still need Excel for local manipulation. PDF for official submission.

---

## 12. SYSTEM ADMINISTRATION & CONFIGURATION

Back-office settings for managing the app itself.

| # | Feature | Description | Priority | Platform |
|---|---------|-------------|----------|----------|
| 12.1 | **Barangay Profile Setup** | Configure barangay name, logo, address, contact details, seal. | **MVP** | Web |
| 12.2 | **Fee Schedule Configuration** | Set fees per document type, per barangay ordinance. | **MVP** | Web |
| 12.3 | **Document Template Editor** | Edit certificate/clearance templates (header text, footer, fields, signatory position). | **MVP** | Web |
| 12.4 | **Notification Templates** | Configure SMS and push notification message templates. | **Future** | Web |
| 12.5 | **Backup & Restore** | Scheduled database backups, one-click restore. | **Future** | Backend |
| 12.6 | **System Logs** | Server logs, error logs, API access logs for debugging and security. | **MVP** | Backend |
| 12.7 | **Data Export / Import** | Full data export for migration, disaster recovery. Import from legacy systems. | **Future** | Web |
| 12.8 | **Multi-barangay Support** | Allow the same installation to serve multiple barangays (e.g., city-level deployment). | **Future** | All |

---

## 13. PLATFORM ALLOCATION SUMMARY

| Feature Area | MVP on Mobile | MVP on Web | Future on Both |
|---|---|---|---|
| Documents | Request, view status | Full admin: create, print, archive | Online requests, QR verification |
| Residents | Profile view, basic search | Full CRUD, household mapping, import/export | Self-registration, PhilSys link |
| Blotter/Complaints | Incident reporting, case status | Full case management, summons, settlements | VAW Desk module |
| Financial | Receipt view, payment notification | Full treasury: collections, OR, reports, budget | Digital payments, asset mgmt |
| Announcements | View bulletins, push notifications | Full CMS: create, schedule, target | SMS broadcast, emergency alerts |
| Appointments | Book appointments, view queue | Queue management, counter assignment | Kiosk integration |
| Health | View records, vaccination reminders | Full health records, inventory, reports | Offline BHW module |
| Disaster | Evacuation info, alerts | Evacuation centers, relief mgmt, hazard maps | PAGASA integration, sensor data |
| Map | Navigate, view nearby | Full GIS, boundary mapping, heatmaps | Real-time tracking |
| Dashboard | Summary stats | Full analytics, all report types | Custom reports |
| Admin | — | Full system configuration | Multi-barangay support |

---

## 14. COMPETITIVE LANDSCAPE

| Competitor | Strengths | Weaknesses/Gaps |
|---|---|---|
| **DILG LGUSS-BIMS** | Free, government-mandated, 11 sub-systems | Web-only, no mobile app, limited customization, difficult UI |
| **OneBarangay** | QR verification, PAGASA integration, comprehensive | Paid, closed-source, no open extension |
| **Barangay365** | On-premise option, SMS, CCTV-ready | Desktop-focused, limited mobile |
| **BarangayCloud** | Modern UI, business permit focus | Relatively newer, smaller install base |
| **EBARANGAY** | Blockchain, AI surveillance, GPS tanod tracking | Expensive, over-engineered for many barangays |
| **BARS** | Kiosk + queue system, strong leadership dashboard | Primarily a kiosk solution |
| **BiSiG** | DILG-approved, multi-region deployment | Limited public info, appears less feature-rich |

**Our Differentiator Opportunity**: Open-source or affordable SaaS, mobile-first (most competitors are web-only), offline-capable, modern UI/UX, and modular (barangays pay only for what they need).

---

## 15. PHASED ROADMAP RECOMMENDATION

### Phase 1 — MVP (Core Operations)
- Resident Management (full CRUD)
- Document Management (clearances, certificates of residency/indigency — the **top 3** highest volume)
- Blotter Entry & Basic Case Tracking
- Basic Dashboard (population stats, document volume)
- Auth & Roles (Captain, Secretary, Treasurer, Resident)
- Web + Mobile with core features

### Phase 2 — Operations & Finance
- Financial Management (collections, OR, daily settlement)
- Complete Document Suite (business permits, jobseeker cert, good moral)
- Summons & Hearing Scheduling
- Announcements System
- Analytics Dashboards
- Online Document Requests

### Phase 3 — Health & Social
- Health Records & Vaccination Tracking
- Senior/PWD/4Ps Registry
- BHW Mobile Module
- Medical Mission Scheduling
- Referral Tracking

### Phase 4 — Disaster & Advanced
- Evacuation Center & Relief Management
- PAGASA Integration
- Hazard Mapping (GIS)
- Emergency Alert System (SMS + Push)
- QR Document Verification

### Phase 5 — Scale & Integrate
- Digital Payments (GCash/Maya)
- Multi-barangay / City-level Deployment
- PhilSys Integration
- Kiosk Mode
- Mobile App Offline-First Sync

---

## 16. TECHNOLOGY RECOMMENDATIONS

Based on the existing project stack and Philippine context:

### Backend & Database
- **Express.js + TypeScript** (already set up) for REST API
- **Database**: PostgreSQL (recommended — strong GIS support for mapping features, JSONB for flexible resident attributes) or **Cloudflare D1** (SQLite-based, globally distributed) if using Workers
- **File Storage**: Cloudflare R2 or AWS S3 for document PDFs, resident photos, uploaded evidence
- **ORM**: Drizzle ORM or Prisma (both support TypeScript well)

### Auth & Security
- **Better-Auth** or **Lucia** (modern auth libraries for TypeScript)
- **JWT + refresh tokens** for API auth
- **Turnstile** (Cloudflare) for bot protection on public forms
- Rate limiting on public endpoints (brute force protection)

### Mobile-Specific
- **Expo SDK 56** (already configured)
- **NativeWind v5** for Tailwind CSS in React Native
- **Offline-first**: Consider WatermelonDB or SQLite for local data sync
- **Push notifications**: Expo Push Notifications API or Firebase Cloud Messaging

### Web-Specific
- **React 19 + Vite 8** (already configured)
- **TanStack Query** for server state management
- **Tailwind CSS v4** (already planned via skill)
- **Recharts** or **D3.js** for analytics dashboards

### Philippine-Specific Integrations (Future)
- **PAGASA Weather API** (DOST) for disaster alerts
- **GCash / Maya API** for digital payments
- **Semaphore API** (Filipino SMS gateway, cost-effective)
- **PhilSys/PhilID** verification (requires accreditation)

---

> This report covers **100+ features** across **13 categories** with prioritization, platform allocation, and Philippine-specific legal/cultural context. The MVP can be built with roughly **25-30 features** focused on resident management, document issuance, blotter, and basic auth — which covers the highest pain points for most barangays today.
