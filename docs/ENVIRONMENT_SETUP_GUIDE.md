# e-Kap Environment Setup Guide

This guide provides step-by-step instructions for setting up the e-Kap development environment across all three workspaces: mobile app, backend API, and web dashboard.

## Prerequisites

### Required Software
- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **MongoDB**: v6.0 or higher (local or Atlas)
- **Git**: Version control
- **Expo CLI**: For mobile development (optional but recommended)

### Optional Software
- **MongoDB Compass**: GUI for MongoDB (recommended)
- **Postman** or **Insomnia**: API testing (recommended)
- **VS Code**: Code editor (recommended)

---

## 1. MongoDB Setup

### Option A: Local MongoDB (Recommended for Development)

#### Windows
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer with default settings
3. MongoDB will be installed at `C:\Program Files\MongoDB\Server\X.Y.Z`
4. Data directory: `C:\data\db` (created automatically)
5. Start MongoDB:
   ```bash
   # Option 1: Run as service (automatic on startup)
   # MongoDB will start automatically as a Windows service
   
   # Option 2: Manual start
   "C:\Program Files\MongoDB\Server\X.Y.Z\bin\mongod.exe" --dbpath "C:\data\db"
   ```

#### macOS
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
# Install with package manager
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get connection string (choose "Connect your application")
6. Copy the connection string (format: `mongodb+srv://...`)

---

## 2. Firebase Setup

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `e-kap` (or your preferred name)
4. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to "Build" → "Authentication"
2. Click "Get Started"
3. Enable "Anonymous" sign-in method
4. Click "Save"

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Add app (Web, iOS, Android)
4. Download configuration files (google-services.json for Android, GoogleService-Info.plist for iOS)
5. For web, get Firebase SDK configuration snippet

### 4. Get API Keys (Optional for Admin)
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download JSON file
4. Save as `service-account.json` in backend directory
5. **IMPORTANT**: Never commit this file to git

---

## 3. Gemini API Setup

### 1. Get API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the API key

### 2. Enable Gemini API
1. Go to https://aistudio.google.com/app/apikeys
2. Find your API key
3. Click "Edit"
4. Enable "Gemini API" if not already enabled

---

## 4. Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Copy example file
cp .env.example .env
```

### 4. Configure Environment Variables
Edit `.env` file:
```bash
# Server Configuration
PORT=3000

# MongoDB Configuration
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ekap

# MongoDB Atlas (if using cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekap

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Service Account (Optional - for admin operations)
# Path to your service account JSON file
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
```

### 5. Start MongoDB (if using local)
```bash
# Windows
"C:\Program Files\MongoDB\Server\X.Y.Z\bin\mongod.exe" --dbpath "C:\data\db"

# macOS/Linux
mongod
```

### 6. Start Backend Server
```bash
npm run dev
```

Backend will start on `http://localhost:3000`

### 7. Verify Backend is Running
Open browser and visit: `http://localhost:3000`
Should see: `{"message": "e-Kap API running", "version": "1.0.0"}`

---

## 5. Mobile App Setup

### 1. Navigate to App Directory
```bash
cd app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Copy example file
cp .env.example .env
```

### 4. Configure Environment Variables
Edit `.env` file:
```bash
# API Base URL
# For Android emulator:
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# For iOS simulator:
# EXPO_PUBLIC_API_URL=http://localhost:3000/api

# For physical device on same network:
# EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000/api
```

### 5. Start Expo Development Server
```bash
npx expo start
```

### 6. Test on Device/Simulator
- **Option 1**: Use Expo Go app on your phone
- **Option 2**: Use iOS Simulator (macOS only)
- **Option 3**: Use Android Emulator (Android Studio)

### 7. For Development Build (Optional)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS (requires Mac)
eas build --platform ios
```

---

## 6. Web Dashboard Setup

### 1. Navigate to Web Directory
```bash
cd web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Copy example file
cp .env.example .env
```

### 4. Configure Environment Variables
Edit `.env` file:
```bash
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 5. Start Development Server
```bash
npm run dev
```

Web dashboard will start on `http://localhost:3001`

---

## 7. Verification Steps

### 7.1 Verify Backend
```bash
# Test health check
curl http://localhost:3000

# Test registration endpoint
curl -X POST http://localhost:3000/api/registration \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "test123",
    "fullName": "Test User",
    "regionCode": "1300000000",
    "regionName": "National Capital Region (NCR)",
    "provinceCode": "1376040000",
    "provinceName": "Metro Manila",
    "cityMunicipalityCode": "13760404000",
    "cityMunicipalityName": "City of Manila",
    "cityMunicipalityType": "city",
    "barangayCode": "137604040001",
    "barangayName": "Barangay 1",
    "idPhotoBase64": "base64string",
    "idType": "other"
  }'
```

### 7.2 Verify Mobile App
- Open Expo Go app and scan QR code
- Navigate through onboarding flow
- Test PSGC location selection
- Test camera capture
- Verify Firebase auth works

### 7.3 Verify Web Dashboard
- Open http://localhost:3001
- Verify dashboard loads
- Check if it can connect to backend API

---

## 8. Common Issues & Solutions

### MongoDB Connection Issues
**Problem**: Backend fails to connect to MongoDB
**Solution**:
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Verify MongoDB is listening on port 27017
- Check firewall settings

### Firebase Auth Issues
**Problem**: Firebase authentication fails
**Solution**:
- Verify Firebase project is created
- Check Anonymous auth is enabled
- Verify Firebase configuration in app
- Check network connectivity

### PSGC API Issues
**Problem**: PSGC API returns 404 or 500 errors
**Solution**:
- Use nested endpoints, NOT v1 endpoints
- Check internet connection
- Verify correct parameter names (region_code, province_code, etc.)
- Check API documentation: https://psgc.cloud/api-docs

### Port Conflicts
**Problem**: Port 3000 or 3001 already in use
**Solution**:
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (macOS/Linux)
kill -9 <PID>

# Or change port in .env file
PORT=3001
```

### Dependency Installation Issues
**Problem**: `npm install` fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Expo Build Issues
**Problem**: EAS build fails
**Solution**:
- Ensure EAS CLI is configured
- Check app.json configuration
- Verify environment variables are set in EAS dashboard
- Check Expo SDK version compatibility

---

## 9. IDE Configuration (VS Code)

### Recommended Extensions
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - TypeScript support
- **Tailwind CSS IntelliSense** - Tailwind CSS autocomplete
- **MongoDB for VS Code** - MongoDB integration
- **Expo** - Expo development tools

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "latest",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegexes": [
    ["\\.(css)$", "tailwindcss"]
  ]
}
```

---

## 10. Git Configuration

### Ignore Files
Ensure `.gitignore` files are properly configured in all workspaces to exclude:
- `node_modules/`
- `.env` and `.env.local`
- `.env.example` (should be committed)
- `service-account.json` (Firebase credentials)
- Build artifacts
- OS files (`.DS_Store`, `Thumbs.db`)

### Branch Strategy
- **Current Branch**: `mobile-devin`
- **Main Branch**: `main`
- **Commit to**: `mobile-devin` only (do NOT merge to main)

---

## 11. Production Deployment Preparation

### Backend
- Use MongoDB Atlas for production database
- Set up environment variables in hosting platform
- Configure CORS for production domains
- Enable rate limiting
- Set up monitoring and logging

### Mobile App
- Configure production API URL in EAS
- Set up Firebase for production
- Configure app signing (iOS/Android)
- Submit to App Store/Play Store via EAS Submit

### Web Dashboard
- Configure production API URL
- Set up environment variables in Vercel
- Configure domain and SSL
- Set up build optimization

---

## 12. Troubleshooting Commands

### Check MongoDB Status
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# macOS/Linux
ps aux | grep mongod
```

### Check Backend Logs
```bash
# Backend logs will show in terminal
# Look for MongoDB connection errors
# Look for API errors
# Look for WebSocket connection status
```

### Check Expo Logs
```bash
# Expo logs will show in terminal
# Look for build errors
# Look for network errors
# Look for permission errors
```

### Reset Everything
```bash
# Stop all services
# Kill MongoDB
# Kill backend server
# Stop Expo

# Clear caches
cd backend && rm -rf node_modules && npm install
cd app && rm -rf node_modules && npm install
cd web && rm -rf node_modules && npm install

# Restart services in order:
# 1. MongoDB
# 2. Backend
# 3. Mobile App
# 4. Web Dashboard
```

---

## 13. Team Collaboration

### Sharing Environment Configuration
- **DO NOT** commit `.env` files with real credentials
- **DO** commit `.env.example` files with placeholder values
- Share Firebase and Gemini API keys securely (not in git)
- Share MongoDB Atlas connection string securely (not in git)

### Database Seeding (Optional)
If you need seed data for testing:
```bash
# Create seed script in backend/src/seed.ts
# Run seed script
npm run seed
```

---

## 14. Performance Optimization

### Backend
- Enable MongoDB indexing for frequently queried fields
- Implement response caching where appropriate
- Use connection pooling for database
- Enable gzip compression

### Mobile App
- Use React.memo for expensive components
- Implement lazy loading for large screens
- Optimize image handling (compression, caching)
- Use FlatList for long lists

### Web Dashboard
- Use Next.js image optimization
- Implement code splitting
- Use React Query for data fetching
- Optimize bundle size

---

## 15. Security Best Practices

### Never Commit
- `.env` files with real credentials
- Firebase service account JSON files
- API keys in code
- Database connection strings with passwords
- Any sensitive configuration

### Always Commit
- `.env.example` files with placeholders
- `.gitignore` files
- README with setup instructions
- License file
- Documentation

### In Production
- Use environment variables for all secrets
- Enable HTTPS
- Implement rate limiting
- Use CORS properly (restrict origins)
- Implement input validation
- Sanitize all user inputs
- Use parameterized queries to prevent SQL injection
