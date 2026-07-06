# e-Kap Senior-Friendly Onboarding Experience Design

## Executive Summary

This document provides comprehensive UI/UX design specifications for the e-Kap mobile application's senior-friendly onboarding experience and main app navigation. The design follows WCAG AA accessibility guidelines and prioritizes usability for elderly users like "Lolo Jaime" (age 68, tech-averse, low visual acuity).

---

## 1. Onboarding Flow Design

### 1.1 Multi-Step Registration Process

The onboarding flow consists of 4 sequential steps with clear progress indicators:

```
Step 1: Location Selection → Step 2: ID Verification → Step 3: Welcome to Main App
```

### 1.2 Progress Indicator Design

**Component: `ProgressBar`**

```typescript
// Progress Indicator Specifications
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

// Visual Design:
// - Horizontal progress bar at top of screen
// - Height: 8px
// - Background: #e5e7eb (light gray)
// - Progress fill: #22c55e (brand green)
// - Rounded corners: 4px
// - Step indicators: Circles with numbers below the bar
```

**Step Indicator States:**
- **Completed**: Green circle with checkmark (✓)
- **Current**: Green circle with step number, white text
- **Pending**: Gray circle with step number, dark text

**Specifications:**
- Circle size: 32x32dp
- Circle border: 2px
- Font size: 16px bold
- Spacing between circles: 24px
- Step label below circle: 14px

---

## 2. Step 1: Location Selection (PSGC Integration)

### 2.1 Screen Layout

**File: `app/src/screens/LocationSelectionScreen.tsx`**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│  ← Back    Step 1 of 3    Skip →  │  ← Header with navigation
├─────────────────────────────────────┤
│                                     │
│  📍 Location Selection              │  ← Large icon (64px)
│                                     │
│  Select your barangay to get        │  ← 18px body text
│  started with e-Kap services.      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Region ▼                    │   │  ← Large dropdown (48dp height)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ City/Municipality ▼         │   │  ← Large dropdown (48dp height)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Barangay ▼                  │   │  ← Large dropdown (48dp height)
│  └─────────────────────────────┘   │
│                                     │
│  [ Loading spinner or error ]      │  ← Loading/error state
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Continue                │   │  ← Primary button (56dp height)
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 2.2 Component Specifications

#### Large Dropdown Component (`LargeDropdown`)

```typescript
interface LargeDropdownProps {
  label: string;
  value: string;
  options: Array<{label: string, value: string}>;
  onSelect: (value: string) => void;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
}
```

**Visual Specifications:**
- **Minimum height**: 48dp (exceeds accessibility requirement)
- **Border radius**: 12px
- **Border width**: 2px
- **Border color**: #e5e7eb (default), #22c55e (focused), #ef4444 (error)
- **Background**: #ffffff
- **Padding**: 16px horizontal, 12px vertical
- **Font size**: 18px
- **Font weight**: 500
- **Text color**: #000000
- **Placeholder color**: #9ca3af
- **Dropdown icon**: 24x24dp chevron down

**Accessibility:**
- `accessibilityLabel`: "{label} dropdown"
- `accessibilityHint`: "Double tap to open {label} options"
- `accessibilityRole`: "combobox"
- `accessibilityState`: { disabled, expanded, selected }

#### Loading State

**Visual Design:**
- Green activity indicator (#22c55e)
- Size: 32px
- Loading text: "Loading regions..." (18px)
- Positioned below dropdown

#### Error State

**Visual Design:**
- Red error box (#fee)
- Border: 1px solid #fca5a5
- Border radius: 8px
- Padding: 12px
- Error text: 16px, color #dc2626
- Retry button: White background, red border, 16px text

### 2.3 Dropdown Selection Modal

**Modal Specifications:**
- **Height**: 60% of screen
- **Background**: White with rounded top corners (16px)
- **Header**: "Select {label}" (20px bold)
- **Search bar**: 48dp height, 16px text
- **List items**: 48dp minimum height, 18px text
- **Selected item**: Green background (#dcfce7), green text
- **Close button**: 48x48dp, "×" symbol

### 2.4 Screen Content

**Header Section:**
- Title: "Location Selection" (24px bold)
- Subtitle: "Select your barangay to get started" (16px)
- Icon: 📍 (64px emoji)
- Background: Light green (#f0fdf4)
- Padding: 24px

**Form Section:**
- Three cascading dropdowns:
  1. Region (17 regions)
  2. City/Municipality (dynamic based on region)
  3. Barangay (dynamic based on city)
- Each dropdown loads options from previous selection
- Clear dependency indication (e.g., "Select region first")

**Action Section:**
- Primary button: "Continue" (56dp height, green background)
- Disabled state: Gray background (#d1d5db), opacity 0.6
- Skip button: "Skip for now" (text link, 16px)

### 2.5 API Integration

**PSGC API Endpoints:**
- `GET /regions` - List all regions
- `GET /regions/{code}/provinces` - List provinces in region
- `GET /provinces/{code}/cities` - List cities in province
- `GET /cities/{code}/barangays` - List barangays in city

**Error Handling:**
- Network error: "Unable to load locations. Please check your connection."
- Retry button after 3 seconds
- Auto-retry on dropdown focus (max 3 attempts)

---

## 3. Step 2: ID Verification (Enhanced)

### 3.1 Enhanced Capture Screen

**Enhancements to existing `CaptureScreen.tsx`:**

#### Progress Indicator
- Add step indicator at top: "Step 2 of 3"
- Visual progress bar showing 66% complete

#### Enhanced Instructions
- **Before capture**: 
  - Title: "Verify Your Identity" (24px bold)
  - Subtitle: "Take a clear photo of your government-issued ID" (16px)
  - Tips list:
    - ✅ Ensure good lighting
    - ✅ Place ID on flat surface
    - ✅ Remove any covers
    - ✅ Make sure text is readable

#### ID Type Selection (New)
- Quick selection before capture:
  - National ID (UMID)
  - Driver's License
  - Passport
  - Barangay ID
  - Other Government ID
- Large buttons with icons (48x48dp)
- Grid layout (2 columns)

#### Enhanced Camera UI
- Larger ID frame guide (90% width, 50% height)
- Animated corner brackets for visual guidance
- Real-time quality indicators:
  - Lighting meter (green/red)
  - Focus indicator
  - Blur detection warning

### 3.2 Enhanced Review Screen

**Enhancements to existing `ReviewScreen.tsx`:**

#### Progress Indicator
- Add step indicator: "Step 2 of 3 - Review Your Information"

#### Location Display
- Show selected location from Step 1
- Editable with tap to change
- Location icon + text display

#### Enhanced Form Layout
- Group related fields:
  - Personal Information (name, birthdate, gender)
  - Address Information (address, barangay)
  - ID Information (type, number)
- Section headers with icons
- Collapsible sections for cleaner UI

#### Voice-to-Text Integration
- Microphone button on each text input (32x32dp)
- Positioned on right side of input
- Green when active, gray when inactive
- Pulse animation when listening

---

## 4. Step 3: Welcome to Main App

### 4.1 Welcome Completion Screen

**File: `app/src/screens/WelcomeCompletionScreen.tsx`**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│                                     │
│         ✅ Registration Complete    │  ← Success icon (80px)
│                                     │
│  Welcome to e-Kap, [Name]!          │  ← 24px bold
│                                     │
│  Your barangay ID request has      │  ← 16px body text
│  been submitted successfully.      │
│                                     │
│  Request ID: #[REQUEST-ID]          │  ← 18px bold, gray
│                                     │
│  ┌─────────────────────────────┐   │
│  │   What you can do now:      │   │  ← Section header
│  └─────────────────────────────┘   │
│                                     │
│  📄 Request Documents               │  ← Feature list with icons
│  📋 File Incident Reports           │
│  🤖 Get AI Assistance               │
│  👤 Manage Your Profile             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Go to Main App            │   │  ← Primary button
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### Content Specifications:

**Success Section:**
- Checkmark icon: 80x80dp, green (#22c55e)
- Animation: Scale up from 0 to 1 with bounce
- Title: "Registration Complete!" (28px bold)
- Subtitle: "Welcome to e-Kap, [User Name]" (18px)
- Background: Light green (#f0fdf4)

**Request ID Display:**
- Label: "Request ID" (14px, gray)
- ID: "#EKAP-XXXXX" (20px bold, monospace)
- Copy button: 32x32dp, clipboard icon
- Toast notification on copy

**Feature Preview:**
- 4 feature cards with icons and descriptions
- Card size: 48dp height, full width
- Icon: 32x32dp emoji
- Text: 16px
- Background: White with light border
- Tap effect: Scale down slightly

**Action Button:**
- "Go to Main App" (56dp height)
- Green background (#22c55e)
- White text (18px bold)
- Arrow icon on right (→)
- Full width with 16px padding

---

## 5. Main App Navigation

### 5.1 Bottom Tab Navigation

**File: `app/src/navigation/MainTabNavigator.tsx`**

#### Tab Structure:

```
┌─────────────────────────────────────┐
│         Main App Content            │
│                                     │
│         (Screen Content)            │
│                                     │
├─────────────────────────────────────┤
│  📄 Documents  📋 e-Blotter  🤖 AI  │  ← Tab bar
│  👤 Profile                          │
└─────────────────────────────────────┘
```

#### Tab Specifications:

**Tab Bar Design:**
- **Height**: 64dp (exceeds 48dp requirement)
- **Background**: White (#ffffff)
- **Border top**: 1px solid #e5e7eb
- **Shadow**: Subtle elevation (4dp)
- **Padding**: 8px top/bottom

**Tab Item Design:**
- **Minimum touch target**: 48x48dp
- **Icon size**: 32x32dp
- **Icon spacing**: 8px from text
- **Label font size**: 12px (unselected), 14px (selected)
- **Label weight**: 500 (unselected), 600 (selected)
- **Label color**: #9ca3af (unselected), #22c55e (selected)
- **Icon color**: #9ca3af (unselected), #22c55e (selected)
- **Active indicator**: Small green dot (4x4dp) above icon

**Tab Items:**

1. **Documents Tab**
   - Icon: 📄 (document emoji)
   - Label: "Documents"
   - Screen: `DocumentsScreen`

2. **e-Blotter Tab**
   - Icon: 📋 (clipboard emoji)
   - Label: "e-Blotter"
   - Screen: `BlotterScreen`

3. **AI Assistant Tab**
   - Icon: 🤖 (robot emoji)
   - Label: "AI Assistant"
   - Screen: `AIAssistantScreen`

4. **Profile Tab**
   - Icon: 👤 (person emoji)
   - Label: "Profile"
   - Screen: `ProfileScreen`

#### Accessibility:
- `accessibilityLabel`: "{Tab Name} tab"
- `accessibilityRole`: "tab"
- `accessibilityState`: { selected: boolean }
- Haptic feedback on tab change

---

## 6. Feature Screen Designs

### 6.1 Documents Tab - Document Request Interface

**File: `app/src/screens/DocumentsScreen.tsx`**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│  Documents                    🔔 3   │  ← Header with notification badge
├─────────────────────────────────────┤
│                                     │
│  Request a Document                 │  ← Section header
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📄 Barangay Clearance        │   │  ← Document type card
│  │    For employment, school   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📄 Certificate of Indigency  │   │
│  │    For financial assistance │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🆔 Barangay ID              │   │
│  │    Official identification │   │
│  └─────────────────────────────┘   │
│                                     │
│  My Requests                        │  ← Section header
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Barangay Clearance          │   │  ← Request item
│  │ Status: Ready for Pickup    │   │
│  │ Requested: Jan 15, 2026     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### Component Specifications:

**Document Type Card:**
- **Height**: 80dp
- **Border radius**: 12px
- **Background**: White
- **Border**: 1px solid #e5e7eb
- **Padding**: 16px
- **Icon**: 40x40dp emoji
- **Title**: 18px bold
- **Description**: 14px, color #666
- **Tap effect**: Scale down, green border

**Request Item Card:**
- **Height**: 72dp
- **Border radius**: 8px
- **Background**: White
- **Border**: 1px solid #e5e7eb
- **Padding**: 12px
- **Title**: 16px bold
- **Status badge**: 12px, colored background
- **Date**: 12px, gray
- **Status colors**:
  - Ready for Pickup: Green (#dcfce7)
  - Processing: Blue (#dbeafe)
  - Pending: Yellow (#fef9c3)
  - Rejected: Red (#fee)

**Request Document Flow:**
1. Tap document type card
2. Show document details screen
3. Pre-fill with user information from profile
4. Voice-to-text for additional notes
5. Submit request
6. Show confirmation with request ID

#### Document Details Screen:

**Visual Structure:**
```
┌─────────────────────────────────────┐
│  ← Barangay Clearance        Cancel │  ← Header
├─────────────────────────────────────┤
│                                     │
│  📄 Barangay Clearance              │  ← Document info
│                                     │
│  Purpose:                           │
│  ┌─────────────────────────────┐   │
│  │ Employment ▼                │   │  ← Purpose dropdown
│  └─────────────────────────────┘   │
│                                     │
│  Your Information:                  │  ← Pre-filled from profile
│  Name: Juan Dela Cruz               │
│  Address: [From location selection] │
│  🎤 Voice note: [Tap to record]     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Submit Request          │   │  ← Submit button
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 6.2 e-Blotter Tab - Incident Reporting Interface

**File: `app/src/screens/BlotterScreen.tsx`**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│  e-Blotter                    🔔 1  │  ← Header
├─────────────────────────────────────┤
│                                     │
│  File an Incident Report            │  ← Section header
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📝 New Report              │   │  ← Large action button
│  │     File a new incident     │   │
│  └─────────────────────────────┘   │
│                                     │
│  My Reports                         │  ← Section header
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Noise Complaint             │   │  ← Report item
│  │ Status: Under Review        │   │
│  │ Filed: Jan 20, 2026         │   │
│  │ Mediation: Feb 1, 2026      │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### Component Specifications:

**New Report Button:**
- **Height**: 64dp
- **Background**: Green (#22c55e)
- **Border radius**: 12px
- **Icon**: 32x32dp emoji
- **Title**: 18px bold white
- **Subtitle**: 14px white with opacity
- **Shadow**: Elevated (8dp)

**Report Item Card:**
- **Height**: 88dp
- **Border radius**: 8px
- **Background**: White
- **Border**: 1px solid #e5e7eb
- **Padding**: 12px
- **Title**: 16px bold
- **Status badge**: 12px
- **Date**: 12px gray
- **Mediation date**: 12px, highlighted if scheduled

#### Incident Report Form:

**Visual Structure:**
```
┌─────────────────────────────────────┐
│  ← New Report                 Cancel │  ← Header
├─────────────────────────────────────┤
│                                     │
│  Incident Type:                     │
│  ┌─────────────────────────────┐   │
│  │ Noise Complaint ▼          │   │  ← Type dropdown
│  └─────────────────────────────┘   │
│                                     │
│  When did it happen?                │
│  ┌─────────────────────────────┐   │
│  │ Jan 20, 2026 at 8:00 PM     │   │  ← Date/time picker
│  └─────────────────────────────┘   │
│                                     │
│  Describe what happened:            │
│  ┌─────────────────────────────┐   │
│  │                             │   │  ← Large text area
│  │ [Tap to type or use 🎤]     │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Add Evidence:                      │
│  ┌─────────────────────────────┐   │
│  │  📷 Add Photo               │   │  ← Photo upload
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  🎥 Add Video               │   │  ← Video upload
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Submit Report           │   │  ← Submit button
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Form Specifications:**
- **Incident types**: Noise complaint, Property dispute, Theft, Vandalism, Harassment, Other
- **Date/time picker**: Large calendar interface, 48dp touch targets
- **Text area**: 150dp minimum height, 18px font
- **Voice-to-text**: Prominent microphone button (48x48dp)
- **Photo upload**: Camera icon + gallery icon
- **Video upload**: Record video + select from gallery
- **Submit button**: 56dp height, green background

### 6.3 AI Assistant Tab - Chat Interface

**File: `app/src/screens/AIAssistantScreen.tsx`**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│  AI Assistant                   🎤   │  ← Header with WebRTC button
├─────────────────────────────────────┤
│                                     │
│  💬 Chat                            │  ← Chat messages area
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Hi! I'm your AI assistant.   │   │  ← AI message
│  │ How can I help you today?    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ I need help with document   │   │  ← User message
│  │ requirements.               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ For Barangay Clearance,    │   │  ← AI message
│  │ you'll need:                │   │
│  │ • Valid ID                  │   │
│  │ • Proof of address          │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ Type your message...        │   │  ← Input field
│  └─────────────────────────────┘   │
│  [🎤] [📎] [Send]                  │  ← Action buttons
└─────────────────────────────────────┘
```

#### Component Specifications:

**Chat Message Bubble:**
- **AI message**: Light green background (#dcfce7), left-aligned
- **User message**: Dark green background (#22c55e), right-aligned
- **Border radius**: 16px
- **Padding**: 12px
- **Font size**: 16px
- **Max width**: 80% of screen
- **Line height**: 22px

**Input Area:**
- **Height**: 64dp
- **Background**: White
- **Border top**: 1px solid #e5e7eb
- **Padding**: 8px
- **Text input**: 48dp height, 16px font
- **Buttons**: 48x48dp
- **Send button**: Green background when text present

**WebRTC Button (Header):**
- **Icon**: 🎤 (microphone emoji)
- **Size**: 48x48dp
- **Background**: Green (#22c55e)
- **Border radius**: 24px (circle)
- **Label**: "Talk to Official" (below button, 12px)
- **States**:
  - Available: Green, pulsing animation
  - Unavailable: Gray, "Offline" label
  - In call: Red, "End Call" label

**Quick Actions:**
- Suggested questions above input:
  - "What documents do I need?"
  - "What are office hours?"
  - "How to check request status?"
- Horizontal scrollable chips
- 36dp height, 16px text
- Light background (#f3f4f6)

#### WebRTC Call Interface:

**Visual Structure:**
```
┌─────────────────────────────────────┐
│  ← End Call                    00:00│  ← Call header
├─────────────────────────────────────┤
│                                     │
│         [Video Feed]                │  ← Official's video
│                                     │
│         [Your Video]                │  ← Picture-in-picture
│                                     │
├─────────────────────────────────────┤
│  [🎤 Mute] [📷 Camera] [🔊 Speaker] │  ← Call controls
└─────────────────────────────────────┘
```

**Call Controls:**
- **Buttons**: 56x56dp circles
- **Background**: White with shadow
- **Icons**: 32x32dp
- **Mute**: Red when muted
- **End call**: Red background, white icon

### 6.4 Profile Tab - User Information and Settings

**File: `app/src/screens/ProfileScreen.tsx`**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│  Profile                             │  ← Header
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │      👤 Juan Dela Cruz       │   │  ← Profile card
│  │      Barangay ID Request    │   │
│  │      Status: Pending        │   │
│  └─────────────────────────────┘   │
│                                     │
│  My Information                     │  ← Section header
│                                     │
│  📍 Location:                       │
│  Barangay San Jose, City of Makati  │
│  [Edit]                             │
│                                     │
│  📱 Phone:                          │
│  +63 912 345 6789                   │
│  [Edit]                             │
│                                     │
│  📧 Email:                          │
│  juan@email.com                     │
│  [Edit]                             │
│                                     │
│  Settings                           │  ← Section header
│                                     │
│  🔔 Notifications                   │
│  [Toggle: On]                       │
│                                     │
│  🌙 Dark Mode                       │
│  [Toggle: Off]                      │
│                                     │
│  🔤 Text Size                       │
│  [Medium ▼]                         │
│                                     │
│  🌐 Language                        │
│  [English ▼]                        │
│                                     │
│  📞 Emergency Contact               │
│  [Add Contact]                      │
│                                     │
│  ❓ Help & Support                  │
│  [View FAQ]                         │
│                                     │
│  🚪 Sign Out                        │
│  [Sign Out]                         │
│                                     │
└─────────────────────────────────────┘
```

#### Component Specifications:

**Profile Card:**
- **Height**: 120dp
- **Background**: Gradient green (#22c55e to #16a34a)
- **Border radius**: 16px
- **Padding**: 20px
- **Avatar**: 64x64dp circle with initial
- **Name**: 20px bold white
- **Subtitle**: 16px white with opacity
- **Status badge**: 12px, white background

**Information Item:**
- **Height**: 64dp
- **Background**: White
- **Border bottom**: 1px solid #e5e7eb
- **Padding**: 16px
- **Icon**: 32x32dp emoji
- **Label**: 14px gray
- **Value**: 18px
- **Edit button**: 16px green text

**Setting Item:**
- **Height**: 56dp
- **Background**: White
- **Border bottom**: 1px solid #e5e7eb
- **Padding**: 16px
- **Icon**: 32x32dp emoji
- **Label**: 18px
- **Control**: Toggle switch or dropdown

**Toggle Switch:**
- **Width**: 48dp
- **Height**: 28dp
- **Track**: Gray (#d1d5db) when off, green (#22c55e) when on
- **Thumb**: 24x24dp white circle
- **Animation**: Smooth slide

**Sign Out Button:**
- **Height**: 56dp
- **Background**: Red (#ef4444)
- **Border radius**: 12px
- **Text**: 18px bold white
- **Icon**: 🚪 (door emoji)

---

## 7. Design System Specifications

### 7.1 Color Palette

**Primary Colors:**
- **Brand Green**: #22c55e (main action color)
- **Dark Green**: #16a34a (pressed state)
- **Light Green**: #dcfce7 (backgrounds, accents)
- **Pale Green**: #f0fdf4 (section backgrounds)

**Neutral Colors:**
- **Black**: #000000 (primary text)
- **Dark Gray**: #333333 (secondary text)
- **Medium Gray**: #666666 (tertiary text)
- **Light Gray**: #9ca3af (placeholders, borders)
- **Pale Gray**: #e5e7eb (dividers, borders)
- **Background Gray**: #f3f4f6 (page backgrounds)
- **White**: #ffffff (card backgrounds)

**Semantic Colors:**
- **Success**: #22c55e (same as brand)
- **Warning**: #f59e0b (amber)
- **Error**: #ef4444 (red)
- **Info**: #3b82f6 (blue)

**Accessibility Contrast Ratios:**
- Black on white: 21:1 (AAA)
- Dark gray on white: 12.6:1 (AAA)
- Brand green on white: 4.5:1 (AA)
- White on brand green: 4.5:1 (AA)
- Dark gray on light green: 7.2:1 (AA)

### 7.2 Typography Scale

**Font Family:**
- iOS: San Francisco (system default)
- Android: Roboto (system default)
- Fallback: Arial, sans-serif

**Font Sizes:**
- **Display**: 32px (app names, large titles)
- **H1**: 28px (screen titles)
- **H2**: 24px (section headers)
- **H3**: 22px (card titles)
- **H4**: 20px (subtitles)
- **Body Large**: 18px (primary text, buttons)
- **Body**: 16px (secondary text, labels)
- **Body Small**: 14px (metadata, captions)
- **Caption**: 12px (helper text)

**Font Weights:**
- **Bold**: 700 (titles, emphasis)
- **Semi-bold**: 600 (headers, buttons)
- **Medium**: 500 (labels)
- **Regular**: 400 (body text)

**Line Heights:**
- **Display**: 40px
- **H1-H3**: 36px
- **H4**: 28px
- **Body Large**: 26px
- **Body**: 24px
- **Body Small**: 20px
- **Caption**: 16px

### 7.3 Spacing Scale

**Base Unit:** 4px

**Spacing Values:**
- **0**: 0px
- **1**: 4px (XS)
- **2**: 8px (SM)
- **3**: 12px (MD)
- **4**: 16px (LG)
- **5**: 20px (XL)
- **6**: 24px (2XL)
- **8**: 32px (3XL)
- **10**: 40px
- **12**: 48px (4XL)
- **16**: 64px
- **20**: 80px

### 7.4 Border Radius

**Values:**
- **Small**: 8px (inputs, small cards)
- **Medium**: 12px (buttons, standard cards)
- **Large**: 16px (large cards, modals)
- **XL**: 20px (special containers)
- **Circle**: 50% (avatars, round buttons)

### 7.5 Shadows

**Elevation Levels:**
- **None**: No shadow
- **SM**: 0 1px 2px rgba(0,0,0,0.05)
- **MD**: 0 4px 6px rgba(0,0,0,0.1)
- **LG**: 0 10px 15px rgba(0,0,0,0.1)
- **XL**: 0 20px 25px rgba(0,0,0,0.15)

**Usage:**
- Cards: SM
- Buttons: MD
- Modals: LG
- Floating elements: XL

### 7.6 Touch Targets

**Minimum Size:** 48x48dp (WCAG AA requirement)

**Recommended Sizes:**
- **Small buttons**: 48x48dp
- **Standard buttons**: 56dp height
- **Large buttons**: 64dp height
- **Icon buttons**: 48x48dp
- **Tab items**: 48x48dp
- **List items**: 48dp minimum height
- **Input fields**: 48dp minimum height

**Spacing Between Targets:** Minimum 8dp

### 7.7 Icons

**Icon Sizes:**
- **Small**: 16x16dp (inline icons)
- **Medium**: 24x24dp (standard icons)
- **Large**: 32x32dp (button icons)
- **XL**: 48x48dp (feature icons)
- **XXL**: 64x64dp (hero icons)

**Icon Style:**
- Use emojis for simplicity and familiarity
- Alternative: Lucide React icons for consistency
- High contrast on all backgrounds
- Clear, recognizable shapes

### 7.8 Animations

**Duration:**
- **Fast**: 150ms (button presses)
- **Medium**: 300ms (screen transitions)
- **Slow**: 500ms (loading states)

**Easing:**
- **Ease-out**: Standard transitions
- **Ease-in-out**: Complex animations
- **Linear**: Loading spinners

**Types:**
- **Scale**: Button press feedback (0.95 to 1.0)
- **Fade**: Screen transitions
- **Slide**: Modal presentations
- **Pulse**: Attention indicators
- **Bounce**: Success confirmations

**Reduced Motion:**
- Respect `reduceMotion` accessibility setting
- Disable animations when reduced motion is on
- Use instant state changes instead

---

## 8. Accessibility Guidelines

### 8.1 Screen Reader Support

**Labels:**
- All interactive elements must have `accessibilityLabel`
- Labels should be descriptive and concise
- Use sentence case for labels

**Hints:**
- Complex interactions need `accessibilityHint`
- Hints should explain what will happen
- Keep hints under 140 characters

**Roles:**
- Use appropriate `accessibilityRole` values
- Common roles: button, text, header, image, tab

**States:**
- Use `accessibilityState` for dynamic elements
- States: disabled, selected, expanded, checked

### 8.2 Keyboard Navigation

**Focus Order:**
- Logical top-to-bottom, left-to-right flow
- Skip to main content option
- Focus indicators visible

**Keyboard Shortcuts:**
- Tab: Navigate between elements
- Enter/Space: Activate focused element
- Escape: Close modals/dialogs

### 8.3 Color Accessibility

**Contrast Ratios:**
- Normal text (16px+): 4.5:1 minimum
- Large text (18px+ bold, 24px+): 3:1 minimum
- UI components: 3:1 minimum
- Graphics: 3:1 minimum

**Color Independence:**
- Don't rely on color alone to convey meaning
- Use icons, text, or patterns as alternatives
- Test with color blindness simulators

### 8.4 Text Accessibility

**Scalability:**
- Support dynamic text sizing
- Test with largest font size setting
- Layout should adapt to larger text

**Readability:**
- Use sans-serif fonts
- Adequate line height (1.5x minimum)
- Avoid justified text
- Limit line length to 75 characters

### 8.5 Motor Accessibility

**Touch Targets:**
- Minimum 48x48dp for all interactive elements
- 8dp spacing between targets
- Avoid gestures that require precision

**Alternatives:**
- Provide button alternatives for swipe gestures
- Allow keyboard input for all actions
- Support external accessibility devices

---

## 9. Component Library

### 9.1 Reusable Components

**`LargeButton`**
- Primary action button
- 56dp minimum height
- Green background
- White text
- Loading state support
- Disabled state

**`LargeDropdown`**
- Cascading dropdown for location selection
- 48dp minimum height
- Loading state
- Error state
- Search functionality
- Modal picker

**`LargeInput`**
- Text input field
- 48dp minimum height
- Voice-to-text button
- Error state
- Clear button
- Accessibility labels

**`Card`**
- Content container
- 12dp border radius
- White background
- Subtle shadow
- Tap effect

**`ProgressBar`**
- Step progress indicator
- Horizontal bar
- Step circles
- Animated transitions

**`ChatBubble`**
- Chat message display
- Left/right alignment
- Different colors for AI/user
- Auto-sizing

**`StatusBadge`**
- Status indicator
- Color-coded
- Icon + text
- Small size (12px)

**`ToggleSwitch`**
- On/off control
- 48x28dp size
- Animated thumb
- Accessibility state

**`TabBar`**
- Bottom navigation
- 64dp height
- 4 tabs
- Icon + label
- Active indicator

### 9.2 Component Props

**Standard Props:**
```typescript
interface BaseComponentProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}
```

**Button Props:**
```typescript
interface LargeButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}
```

**Input Props:**
```typescript
interface LargeInputProps extends BaseComponentProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  voiceEnabled?: boolean;
  onVoicePress?: () => void;
}
```

---

## 10. Implementation Priority

### Phase 1: Core Onboarding (High Priority)
1. ✅ Location Selection Screen
2. ✅ Enhanced ID Capture Screen
3. ✅ Enhanced Review Screen
4. ✅ Welcome Completion Screen
5. ✅ Progress Indicator Component
6. ✅ Large Dropdown Component

### Phase 2: Main Navigation (High Priority)
1. ✅ Main Tab Navigator
2. ✅ Documents Screen
3. ✅ Profile Screen
4. ✅ Tab Bar Component

### Phase 3: Feature Screens (Medium Priority)
1. ✅ e-Blotter Screen
2. ✅ AI Assistant Screen
3. ✅ Document Request Flow
4. ✅ Incident Report Flow

### Phase 4: Advanced Features (Low Priority)
1. ⏳ WebRTC Integration
2. ⏳ Voice-to-Text Integration
3. ⏳ Push Notifications
4. ⏳ Emergency Alerts

---

## 11. Testing Recommendations

### 11.1 Usability Testing

**Target Users:**
- Senior citizens (60+ years old)
- Tech-averse individuals
- Users with visual impairments
- Users with motor impairments

**Test Scenarios:**
1. Complete onboarding flow
2. Request a document
3. File an incident report
4. Use AI assistant
5. Update profile information

**Success Metrics:**
- Task completion rate > 80%
- Time to complete < 2 minutes
- Error rate < 10%
- User satisfaction > 4/5

### 11.2 Accessibility Testing

**Tools:**
- Screen readers (VoiceOver, TalkBack)
- Color blindness simulators
- Contrast checkers
- Accessibility inspectors

**Checklist:**
- [ ] All touch targets ≥ 48dp
- [ ] Color contrast ≥ 4.5:1
- [ ] Font sizes ≥ 16px
- [ ] Accessibility labels present
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Reduced motion respected

### 11.3 Performance Testing

**Metrics:**
- Screen load time < 500ms
- API response time < 2s
- Animation frame rate ≥ 60fps
- Memory usage < 150MB

**Scenarios:**
- Slow network (3G)
- Low-end device
- Background state
- Multi-tasking

---

## 12. Conclusion

This comprehensive design specification provides a senior-friendly onboarding experience and main app navigation for the e-Kap application. The design follows WCAG AA accessibility guidelines, prioritizes usability for elderly users, and maintains consistency with the existing design system.

Key design principles:
- **Large touch targets** (48dp minimum)
- **High contrast colors** (WCAG AA compliant)
- **Clear typography** (16px minimum)
- **Simple layouts** (uncluttered)
- **Progressive disclosure** (step-by-step)
- **Clear feedback** (loading states, errors)
- **Accessibility first** (screen readers, keyboard)

The design is ready for implementation and should be validated through user testing with senior citizens to ensure it meets the needs of the target audience.

---

## Appendix A: File Structure

```
app/src/
├── components/
│   ├── LargeButton.tsx
│   ├── LargeDropdown.tsx
│   ├── LargeInput.tsx
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   ├── ChatBubble.tsx
│   ├── StatusBadge.tsx
│   ├── ToggleSwitch.tsx
│   └── TabBar.tsx
├── screens/
│   ├── onboarding/
│   │   ├── LocationSelectionScreen.tsx
│   │   ├── EnhancedCaptureScreen.tsx
│   │   ├── EnhancedReviewScreen.tsx
│   │   └── WelcomeCompletionScreen.tsx
│   ├── main/
│   │   ├── DocumentsScreen.tsx
│   │   ├── BlotterScreen.tsx
│   │   ├── AIAssistantScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── documents/
│   │   └── DocumentDetailsScreen.tsx
│   └── blotter/
│       └── IncidentReportScreen.tsx
├── navigation/
│   ├── OnboardingNavigator.tsx
│   └── MainTabNavigator.tsx
└── services/
    ├── psgcApi.ts
    └── voiceToText.ts
```

## Appendix B: API Integration

**PSGC API Service:**
```typescript
// app/src/services/psgcApi.ts
export const psgcApi = {
  getRegions: () => Promise<Region[]>,
  getProvinces: (regionCode: string) => Promise<Province[]>,
  getCities: (provinceCode: string) => Promise<City[]>,
  getBarangays: (cityCode: string) => Promise<Barangay[]>
};
```

**Voice-to-Text Service:**
```typescript
// app/src/services/voiceToText.ts
export const voiceToText = {
  startListening: () => Promise<void>,
  stopListening: () => Promise<string>,
  isAvailable: () => boolean
};
```

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Designer:** UI/UX Design Team  
**Project:** e-Kap Senior-Friendly Onboarding Experience
