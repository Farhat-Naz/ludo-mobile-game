# Google Play Store Publishing Guide

Complete step-by-step guide to publish your Ludo Game on Google Play Store.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Play Developer Account Setup](#google-play-developer-account-setup)
3. [Install EAS CLI](#install-eas-cli)
4. [Configure EAS Build](#configure-eas-build)
5. [Build Android App Bundle](#build-android-app-bundle)
6. [Create Play Console Listing](#create-play-console-listing)
7. [Upload and Publish](#upload-and-publish)
8. [Post-Launch](#post-launch)

---

## Prerequisites

### Required:
- ✅ Google account
- ✅ $25 USD one-time Google Play Developer registration fee
- ✅ Expo account (free) - create at https://expo.dev
- ✅ Node.js 18+ installed
- ✅ Your app code (already done!)

### Recommended:
- Valid email address for support
- Credit/debit card for developer fee
- Screenshots of your app (we'll create these)

---

## Google Play Developer Account Setup

### Step 1: Register as Developer

1. **Go to Google Play Console**
   - Visit: https://play.google.com/console
   - Sign in with your Google account

2. **Pay Registration Fee**
   - Click "Create Developer Account"
   - Pay $25 USD one-time fee
   - This gives you lifetime access to publish apps

3. **Complete Account Information**
   - Developer name: "Farhat Naz" (or your choice)
   - Email address: Your contact email
   - Phone number: Your contact number
   - Website: `https://github.com/Farhat-Naz/ludo-mobile-game`

4. **Accept Developer Agreement**
   - Read and accept the Developer Distribution Agreement
   - Complete identity verification (may take 24-48 hours)

---

## Install EAS CLI

EAS (Expo Application Services) will build your Android app in the cloud.

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account (creates account if needed)
eas login

# Navigate to project directory
cd "D:\quarterr 4\game\game-ludo\ludo-game"

# Initialize EAS in your project
eas init

# This will:
# 1. Create an Expo project if you don't have one
# 2. Update app.json with your project ID
# 3. Link project to your Expo account
```

**Important**: When prompted:
- Select "Create a new project"
- Choose your Expo account
- Confirm the project name

---

## Configure EAS Build

### Step 1: Update app.json with EAS Project ID

After running `eas init`, your `app.json` will be updated with:
```json
"extra": {
  "eas": {
    "projectId": "your-project-id-here"
  }
}
```

### Step 2: Configure Build Settings

The `eas.json` file is already configured! It contains:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

This will create an Android App Bundle (.aab) file, which is required by Google Play.

---

## Build Android App Bundle

### Step 1: Configure Android Credentials

```bash
# Build for Android (production)
eas build --platform android --profile production
```

**During first build, you'll be asked:**

1. **Generate new Android Keystore?**
   - Answer: **Yes**
   - EAS will create and manage signing credentials for you
   - These credentials are securely stored in Expo's servers

2. **Build Configuration**
   - Build type: App Bundle (AAB) ✅
   - Credentials: Let EAS manage ✅

### Step 2: Wait for Build to Complete

- Build time: 10-20 minutes
- You'll get email notification when complete
- Progress tracked at: https://expo.dev/accounts/[your-account]/projects/ludo-game/builds

### Step 3: Download the AAB File

```bash
# Option 1: Download via CLI
eas build:list
eas build:download --platform android

# Option 2: Download from Expo website
# Go to: https://expo.dev/accounts/[your-account]/projects/ludo-game/builds
# Click on the latest build → Download .aab file
```

You'll get a file named: `ludo-game-[version]-[build-id].aab`

---

## Create Play Console Listing

### Step 1: Create New App

1. **Go to Play Console**: https://play.google.com/console
2. **Click "Create app"**
3. **Fill in app details**:
   - App name: `Ludo Game`
   - Default language: English (US)
   - App or game: Game
   - Free or paid: Free
   - Declare: Check all applicable boxes

4. **Click "Create app"**

### Step 2: Set Up App Content

#### A. App Category

- Dashboard → App category
- Category: `Games > Board`
- Tags: `Ludo`, `Board game`, `Multiplayer`

#### B. Store Listing

**Dashboard → Store presence → Main store listing**

Fill in from `store-assets/play-store-listing.md`:

- **App name**: Ludo Game
- **Short description**:
  ```
  Classic Ludo board game with AI opponent. Play 1-4 players locally!
  ```
- **Full description**: Copy from `play-store-listing.md`
- **App icon**: Upload `assets/icon.png` (512x512 PNG)
- **Feature graphic**: Create 1024x500 image (instructions below)
- **Screenshots**: Upload 2-8 screenshots (instructions below)

#### C. Privacy Policy

- **Privacy policy URL**:
  ```
  https://github.com/Farhat-Naz/ludo-mobile-game/blob/main/ludo-game/PRIVACY_POLICY.md
  ```

- Or host on Vercel:
  ```
  https://ludo-mobile-game.vercel.app/privacy
  ```

#### D. Data Safety

- Dashboard → App content → Data safety
- **Answer questions**:
  - Does your app collect or share any data? **No**
  - Does your app use encryption? **No**
- This matches our privacy policy (no data collection)

#### E. Content Rating

- Dashboard → App content → Content rating
- **Fill out questionnaire**:
  - Violence: None
  - Sexual content: None
  - Language: None
  - All answers: No/None
- **Result**: Everyone (PEGI 3, ESRB E)

#### F. Target Audience

- Dashboard → App content → Target audience
- **Age groups**:
  - 5 and under: Yes
  - 6-12: Yes
  - 13-17: Yes
  - 18+: Yes
- **Appeal**: All ages

#### G. News App (Skip)

- Select "No" if asked

#### H. COVID-19 Contact Tracing & Status Apps (Skip)

- Select "No"

---

## Upload and Publish

### Step 1: Create Release

1. **Dashboard → Production → Create new release**

2. **Upload AAB**:
   - Click "Upload"
   - Select your `ludo-game-*.aab` file
   - Wait for upload and processing (2-5 minutes)

3. **Release name**: `1.0.0` (matches app version)

4. **Release notes** (copy from store listing):
   ```
   Initial release
   • Classic Ludo gameplay with all traditional rules
   • AI opponent with 3 difficulty levels
   • 1-4 player local multiplayer
   • Smooth animations and haptic feedback
   • Colorblind-accessible design
   • Offline play - no internet required
   ```

### Step 2: Review Release

- Check for warnings or errors
- Fix any issues reported by Play Console
- Common checks:
  - ✅ App bundle uploaded
  - ✅ All store listing fields complete
  - ✅ Content rating received
  - ✅ Privacy policy URL added
  - ✅ Target audience selected

### Step 3: Submit for Review

1. **Click "Review release"**
2. **Review all sections**:
   - Store presence: ✅ Complete
   - App content: ✅ Complete
   - Production release: ✅ Ready
3. **Click "Start rollout to Production"**

### Step 4: Wait for Review

- **Review time**: 24 hours to 7 days (usually 1-3 days)
- **Email notifications**: You'll get updates
- **Status tracking**: Check Play Console dashboard

**Possible outcomes**:
- ✅ **Approved**: App goes live automatically
- ❌ **Rejected**: Fix issues and resubmit

---

## Creating Required Graphics

### App Screenshots (2-8 required)

**Option 1: Use Emulator**

```bash
# Run app on Android emulator
cd "D:\quarterr 4\game\game-ludo\ludo-game"
npm run android

# Take screenshots:
# 1. Main game board
# 2. 4-player game in progress
# 3. Win screen
# 4. Mode selection
# 5. AI opponent playing
# 6. Dice rolling
# 7. Main menu
# 8. Token movement

# Resize to 1080x1920 or 1080x2340 (phone aspect ratio)
```

**Option 2: Use Physical Device**

1. Install app on your Android phone
2. Play through different screens
3. Take screenshots
4. Transfer to computer
5. Resize if needed

**Screenshot Requirements**:
- Format: PNG or JPEG
- Min: 320px on shortest side
- Max: 3840px on longest side
- Recommended: 1080x1920 or 1080x2340
- Minimum: 2 screenshots
- Maximum: 8 screenshots

### Feature Graphic (1024x500 pixels)

**Create using Canva or Photoshop**:

1. **Size**: 1024 x 500 pixels
2. **Content**:
   - Ludo board background
   - "Ludo Game" title (large, bold)
   - Tagline: "Classic Board Game Fun"
   - Colorful dice and tokens
   - Eye-catching colors

**Quick option**: Use online tools
- Canva.com (free templates)
- Adobe Express (free)
- Figma (free)

---

## Post-Launch

### Monitor Your App

1. **Statistics Dashboard**
   - Track installs
   - Monitor ratings and reviews
   - Check crash reports (if any)

2. **Respond to Reviews**
   - Reply to user feedback
   - Address issues quickly
   - Thank positive reviewers

3. **Update Regularly**
   - Fix bugs
   - Add features
   - Improve based on feedback

### App Updates

When you want to release an update:

```bash
# 1. Update version in app.json
# Change version: "1.0.0" → "1.1.0"
# Change android.versionCode: 1 → 2

# 2. Build new AAB
eas build --platform android --profile production

# 3. Upload to Play Console
# Go to Production → Create new release
# Upload new AAB
# Add release notes
# Submit for review
```

### Marketing Your App

1. **Share on Social Media**
   - Post Play Store link
   - Share screenshots and gameplay videos
   - Use hashtags: #LudoGame #BoardGame #AndroidGames

2. **Get Reviews**
   - Ask friends and family to download
   - Request honest reviews
   - Share in gaming communities

3. **ASO (App Store Optimization)**
   - Use relevant keywords in description
   - Update screenshots regularly
   - Respond to all reviews
   - Maintain 4+ star rating

---

## Troubleshooting

### Build Fails

**Error**: "Gradle build failed"
```bash
# Solution: Clear cache and rebuild
rm -rf node_modules
npm install --legacy-peer-deps
eas build --platform android --profile production --clear-cache
```

**Error**: "Keystore error"
```bash
# Solution: Remove existing credentials
eas credentials
# Select: Android → Production → Remove credentials
# Then rebuild
```

### App Rejected

**Common reasons**:
1. **Privacy policy missing/invalid**
   - Ensure URL is accessible
   - Update policy if needed

2. **Content rating incomplete**
   - Complete questionnaire fully
   - Be honest about content

3. **Broken functionality**
   - Test app thoroughly before submission
   - Fix all crashes

4. **Misleading content**
   - Ensure screenshots match actual app
   - Description must be accurate

### App Not Appearing in Search

**After approval**:
- Wait 2-4 hours for indexing
- Search exact app name first
- Share direct link meanwhile

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Google Play Developer Account | $25 USD (one-time) |
| EAS Build (Free tier) | $0 (100 builds/month) |
| App Icons/Graphics | $0 (DIY) or $5-50 (hire designer) |
| **Total Minimum** | **$25 USD** |

---

## Timeline

| Step | Time |
|------|------|
| Developer account setup | 1-2 days (verification) |
| App configuration | 30 minutes |
| Build AAB with EAS | 15-20 minutes |
| Create store listing | 1-2 hours |
| Google review | 1-7 days |
| **Total** | **2-10 days** |

---

## Quick Checklist

Before submitting:
- ✅ Google Play Developer account created ($25 paid)
- ✅ EAS CLI installed and logged in
- ✅ AAB file built successfully
- ✅ App icon (512x512) ready
- ✅ Feature graphic (1024x500) created
- ✅ 2-8 screenshots captured
- ✅ Privacy policy URL added
- ✅ Store listing complete
- ✅ Content rating received
- ✅ Data safety declared
- ✅ Release notes written
- ✅ App tested thoroughly

---

## Support Resources

**Documentation**:
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- Expo EAS Build Docs: https://docs.expo.dev/build/introduction/
- React Native Docs: https://reactnative.dev/

**Community**:
- Expo Discord: https://chat.expo.dev/
- React Native Community: https://reactnative.dev/community/overview
- r/androiddev: https://reddit.com/r/androiddev

---

## Next Steps

1. **Create Expo account**: https://expo.dev/signup
2. **Pay Google Play fee**: https://play.google.com/console
3. **Run first build**: `eas build --platform android --profile production`
4. **Create store listing**: Follow guide above
5. **Submit for review**: Cross fingers! 🤞

**Good luck with your app launch! 🚀**
