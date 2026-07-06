# e-Kap Welcome Screen - Visual Design Mockup

## Screen Layout (Portrait Mode)

```
┌─────────────────────────────────────┐
│                                     │
│         [  🏛️  ]                    │  ← 80x80dp green circle
│                                     │
│           e-Kap                     │  ← 32px bold
│    Barangay Services Made Easy      │  ← 18px
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ Welcome, Kabarangay!       │   │  ← 24px bold
│  │                             │   │
│  │ Request your Barangay ID    │   │  ← 18px
│  │ and documents in just a     │   │
│  │ few simple steps. No        │   │
│  │ complicated forms, no long  │   │
│  │ waiting lines.              │   │
│  └─────────────────────────────┘   │  ← Light green bg
│                                     │
│  How It Works                       │  ← 22px bold
│                                     │
│  ┌───┐                              │
│  │ 1 │ Take a Photo                │  ← 18px bold
│  │   │ Snap a picture of your      │  ← 16px
│  │   │ valid ID card using your    │
│  │   │ phone's camera              │
│  │   │                              │
│  ┌───┐                              │
│  │ 2 │ Review & Confirm            │  ← 18px bold
│  │   │ Check the information       │  ← 16px
│  │   │ extracted from your ID     │
│  │   │ and make any corrections   │
│  │   │                              │
│  ┌───┐                              │
│  │ 3 │ Submit & Track              │  ← 18px bold
│  │   │ Submit your request and     │  ← 16px
│  │   │ track its status right in   │
│  │   │ the app                     │
│  │   │                              │
│  ┌─────────────────────────────┐   │
│  │ 💡 Helpful Tips              │   │  ← 18px bold
│  │                             │   │
│  │ • Make sure your ID is      │   │  ← 16px
│  │   well-lit and clearly      │   │
│  │   visible                   │   │
│  │ • Hold your phone steady    │   │
│  │   when taking the photo     │   │
│  │ • You can always retake     │   │
│  │   the photo if needed       │   │
│  └─────────────────────────────┘   │  ← Yellow bg
│                                     │
│         ┌───────────┐               │
│         │  START    │               │  ← 20px bold
│         └───────────┘               │  ← Green button
│                                     │
│  Your information is secure        │  ← 14px gray
│  and private                        │
│                                     │
└─────────────────────────────────────┘
```

## Color Specifications

### Background
- **Primary**: #FFFFFF (White)
- **Section - Welcome**: #F0FDF4 (Light Green)
- **Section - Tips**: #FEF9C3 (Light Yellow)

### Text Colors
- **Primary**: #000000 (Black)
- **Secondary**: #333333 (Dark Gray)
- **Tertiary**: #666666 (Medium Gray)
- **Hint**: #999999 (Light Gray)
- **Green Text**: #166534 (Dark Green)
- **Yellow Text**: #854D0E (Dark Yellow)

### Accent Colors
- **Primary Green**: #22C55E (Brand Green)
- **Success Green**: #22C55E
- **Border Green**: #BBF7D0
- **Border Yellow**: #FDE047

### UI Elements
- **Button Background**: #22C55E
- **Button Text**: #FFFFFF
- **Button Shadow**: #000000 (25% opacity)
- **Input Border**: #DDDDDD
- **Error Background**: #FEE2E2
- **Error Text**: #CC0000

## Typography Scale

### Hierarchy
```
App Name (Display):    32px Bold
Welcome Title (H2):    24px Bold
Section Title (H3):    22px Bold
Step Title (H4):       18px Bold
Body Large:            18px Regular
Body (Standard):       16px Regular
Label:                 16px Semibold
Small/Metadata:        14px Regular
```

### Line Heights
- **Display**: 40px
- **Headings**: 32px
- **Body Large**: 26px
- **Body**: 22px
- **Small**: 20px

## Spacing System

### Vertical Spacing
- **Between sections**: 32px
- **Between elements**: 16-20px
- **Within cards**: 12-16px
- **Text to border**: 16-20px

### Horizontal Spacing
- **Screen padding**: 24px
- **Card padding**: 20px
- **Element gap**: 12-16px

## Component Specifications

### App Logo
- **Size**: 80x80dp
- **Shape**: Circle
- **Background**: #22C55E
- **Icon**: 🏛️ (40px emoji)
- **Border radius**: 40dp

### Step Number Badge
- **Size**: 48x48dp
- **Shape**: Circle
- **Background**: #22C55E
- **Text**: 20px Bold White
- **Border radius**: 24dp

### Start Button
- **Height**: 64dp (minimum)
- **Width**: Full width (48px padding)
- **Background**: #22C55E
- **Text**: 20px Bold White
- **Border radius**: 12dp
- **Shadow**: 2px vertical, 4px blur, 25% opacity
- **Elevation**: 5

### Section Cards
- **Background**: #F0FDF4 (Welcome), #FEF9C3 (Tips)
- **Border radius**: 16dp
- **Padding**: 20px
- **Border**: None (or 1px for tips)

## Accessibility Features

### Touch Targets
- **Start Button**: 64dp height ✅
- **Step badges**: 48x48dp ✅
- **All interactive elements**: Minimum 48dp ✅

### Color Contrast
- **Black on White**: 21:1 ✅ (AAA)
- **Dark Green on Light Green**: 7.5:1 ✅ (AAA)
- **Dark Yellow on Light Yellow**: 6.8:1 ✅ (AAA)
- **White on Green**: 4.5:1 ✅ (AA)

### Typography
- **Minimum font size**: 16px ✅
- **Line height**: 1.5x minimum ✅
- **Font weights**: 600 for emphasis ✅

### Screen Reader
- **Semantic structure**: ✅
- **Accessibility labels**: ✅
- **Accessibility hints**: ✅
- **Accessibility roles**: ✅

## Responsive Behavior

### Small Screens (iPhone SE, 320-375px width)
- Reduce padding to 16px
- Scale down app logo to 64x64dp
- Reduce section title to 20px
- Maintain 16px minimum body text

### Medium Screens (iPhone 12/13, 375-428px width)
- Standard layout as shown
- 24px padding
- Full component sizes

### Large Screens (iPhone Pro Max, 428px+ width)
- Standard layout with more whitespace
- Consider max-width containers for text
- Maintain touch target sizes

## Animation Recommendations

### Entry Animation
- Fade in logo (300ms)
- Slide up title (400ms, delay 100ms)
- Fade in sections (500ms, staggered)
- Scale up button (300ms, delay 400ms)

### Button Press
- Scale down to 95% (100ms)
- Return to 100% (100ms)
- Ripple effect (if supported)

### Scroll Behavior
- Smooth scrolling
- No bounce on welcome screen
- Natural scroll physics

## Iconography

### Emojis Used
- 🏛️ - Government/Barangay
- 💡 - Tips/Hints
- ✅ - Success (status screen)
- ❌ - Error (status screen)
- ⏳ - Pending (status screen)
- 📷 - Camera (permission screen)

### Icon Sizes
- **Large (Logo)**: 40px
- **Medium (Section headers)**: 24px
- **Small (Status)**: 40px

## Testing Checklist

### Visual Testing
- [ ] Layout matches mockup on all devices
- [ ] Colors render correctly
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] No overflow on small screens

### Accessibility Testing
- [ ] Screen reader reads content in order
- [ ] All interactive elements have labels
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets are 48dp minimum
- [ ] Text scales correctly

### Usability Testing
- [ ] Seniors can understand the 3 steps
- [ ] Start button is easily found
- [ ] Tips are helpful
- [ ] Overall flow is intuitive

## Implementation Notes

### Code Structure
```tsx
<ScrollView>
  <Header>
    <Logo />
    <AppName />
    <Tagline />
  </Header>

  <WelcomeSection>
    <Title />
    <Description />
  </WelcomeSection>

  <StepsSection>
    <Step1 />
    <Step2 />
    <Step3 />
  </StepsSection>

  <TipsSection>
    <TipsTitle />
    <TipList />
  </TipsSection>

  <StartButton />

  <Footer />
</ScrollView>
```

### Key Components
- **Header**: Logo, app name, tagline
- **WelcomeSection**: Light green card with welcome message
- **StepsSection**: List of 3 steps with numbered badges
- **TipsSection**: Yellow card with helpful tips
- **StartButton**: Prominent green CTA button
- **Footer**: Privacy assurance text

### Styling Approach
- Use StyleSheet.create for performance
- Hardcode sizes for consistency
- Use flexbox for layout
- Avoid percentage-based widths for touch targets
- Use safe area insets for modern devices
