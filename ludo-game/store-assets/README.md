# Store Assets for Google Play Store

This folder contains all the content and guidelines needed for your Google Play Store listing.

---

## 📄 Files in This Folder

### play-store-listing.md
**Complete store listing content**

Contains:
- App name and package info
- Short description (80 chars)
- Full description (4000 chars)
- What's new (release notes)
- Keywords for ASO
- Content rating answers
- Target audience info
- Screenshot requirements
- Feature graphic specifications
- Privacy policy URL
- Support information

**How to use**: Copy content from this file when filling out Play Console store listing.

---

## 🎨 Graphics You Need to Create

### 1. App Icon (Already Done! ✅)
- **File**: `../assets/icon.png`
- **Size**: 512 x 512 pixels
- **Format**: PNG
- **Location in Play Console**: Store listing → App icon

### 2. Feature Graphic (You Need to Create)
- **Size**: 1024 x 500 pixels
- **Format**: PNG or JPEG
- **Content**: Ludo board, app name, tagline
- **Tools**: Canva, Adobe Express, Figma (all free)
- **Location in Play Console**: Store listing → Feature graphic

**Tips**:
- Use bright, colorful design
- Include "Ludo Game" title prominently
- Add tagline: "Classic Board Game Fun"
- Show dice and colorful tokens
- Keep text large and readable

### 3. Screenshots (You Need to Create)
- **Minimum**: 2 screenshots
- **Recommended**: 8 screenshots
- **Size**: 1080 x 1920 pixels (phone aspect ratio)
- **Format**: PNG or JPEG
- **Location in Play Console**: Store listing → Phone screenshots

**How to create**:

**Option A - Using Android Emulator**:
```bash
# Start app on emulator
npm run android

# Navigate to different screens and take screenshots:
# 1. Main game board with tokens
# 2. 4-player game in progress
# 3. Win screen showing rankings
# 4. Mode selection screen
# 5. AI opponent playing
# 6. Dice rolling
# 7. Token cutting animation
# 8. Main menu

# Screenshots save to: Android/sdk/platform-tools/
# Or use emulator's screenshot button
```

**Option B - Using Physical Device**:
1. Install app on your Android phone
2. Play through different screens
3. Take screenshots (Power + Volume Down)
4. Transfer to computer via USB
5. Resize to 1080x1920 if needed

**Screenshot Order** (importance):
1. 🎮 Main game board (most important!)
2. 👥 4-player game in action
3. 🤖 AI opponent gameplay
4. 🏆 Win screen with rankings
5. 📱 Mode selection screen
6. 🎲 Dice rolling animation
7. ✂️ Token cutting moment
8. 🏠 Main menu

---

## 📋 Using This Content

### Step 1: App Information
Copy from `play-store-listing.md`:
- App name: `Ludo Game`
- Package: `com.farhatnaz.ludogame`
- Category: `Board Games`

### Step 2: Descriptions
Copy text sections:
- Short description (80 chars)
- Full description (4000 chars)
- Use exactly as written or customize

### Step 3: Release Notes
Copy "What's New" section for version 1.0.0

### Step 4: Content Rating
Use questionnaire answers provided:
- Violence: None
- Sexual content: None
- Language: None
- Result: Everyone (all ages)

### Step 5: Privacy & Data
- Privacy policy: Use `../PRIVACY_POLICY.md`
- Data safety: No data collected
- Permissions: None required

---

## 🎯 Quick Checklist

Before submitting to Play Store:

**Text Content** ✅
- [ ] App name: Ludo Game
- [ ] Short description: Copied
- [ ] Full description: Copied
- [ ] Release notes: Copied
- [ ] Keywords: Reviewed

**Graphics** 📸
- [ ] App icon: 512x512 (✅ Already have!)
- [ ] Feature graphic: 1024x500 (Need to create)
- [ ] Screenshots: 2-8 images (Need to create)

**Policies** 📜
- [ ] Privacy policy URL: Set
- [ ] Data safety: Declared
- [ ] Content rating: Completed

**Build** 🔨
- [ ] AAB file: Built with EAS
- [ ] Version: 1.0.0
- [ ] Package: com.farhatnaz.ludogame

---

## 🛠️ Tools for Creating Graphics

### Free Design Tools
1. **Canva** (Easiest)
   - https://canva.com
   - Templates available
   - Drag and drop interface

2. **Adobe Express** (Free)
   - https://express.adobe.com
   - Professional templates
   - Easy to use

3. **Figma** (Professional)
   - https://figma.com
   - Free for individuals
   - More control

### Screenshot Tools
- **Android Emulator**: Built into Android Studio
- **Scrcpy**: https://github.com/Genymobile/scrcpy (mirror phone to PC)
- **Phone**: Native screenshot (Power + Volume Down)

### Image Editing
- **Photopea**: https://photopea.com (free Photoshop alternative)
- **GIMP**: https://gimp.org (free, powerful)
- **Paint.NET**: https://getpaint.net (Windows, simple)

---

## 📐 Exact Size Requirements

| Asset | Width | Height | Format | Notes |
|-------|-------|--------|--------|-------|
| App Icon | 512px | 512px | PNG | ✅ Already have |
| Feature Graphic | 1024px | 500px | PNG/JPEG | Need to create |
| Phone Screenshots | 1080px | 1920px | PNG/JPEG | 2-8 required |
| Tablet Screenshots | 1920px | 1080px | PNG/JPEG | Optional |

---

## 💡 Pro Tips

1. **Feature Graphic**:
   - Make it eye-catching and colorful
   - Use your brand colors (red, blue, green, yellow)
   - Keep text minimal and large
   - Test on mobile - it appears small!

2. **Screenshots**:
   - Show actual gameplay, not mockups
   - Highlight best features first
   - Add text overlays if helpful (optional)
   - Keep them clean and uncluttered

3. **Descriptions**:
   - Use provided text as-is (already optimized)
   - Or customize to your style
   - Keep features list clear
   - Emphasize "No ads" and "Offline play"

---

## 🚀 Ready to Submit?

Once you have all graphics created:

1. Open Play Console
2. Go to Store listing section
3. Upload all graphics
4. Copy/paste descriptions
5. Review everything
6. Save and submit!

For step-by-step instructions, see:
- `../QUICK_START_ANDROID.md` (fast track)
- `../GOOGLE_PLAY_STORE_GUIDE.md` (detailed guide)

**Good luck with your launch! 🎮**
