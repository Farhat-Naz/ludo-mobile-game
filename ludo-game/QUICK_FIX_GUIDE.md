# Quick Fix Guide - Run the Game

## 🚀 Simple 3-Step Fix

Follow these steps **exactly** to run your game:

### Step 1: Clean and Reinstall

Open Command Prompt (cmd) and run:

```bash
cd "D:\quarterr 4\game\game-ludo\ludo-game"
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
```

**Wait** for installation to complete (2-3 minutes)

---

### Step 2: Start Expo Server

After installation finishes, run:

```bash
npx expo start --clear
```

**You will see:**
- A QR code in the terminal
- Text like "Metro waiting on exp://..."
- Options to press 'a', 'w', etc.

---

### Step 3: Scan QR Code

**On your phone:**
1. Open **Expo Go** app
2. Tap **"Scan QR code"**
3. Point camera at QR code in terminal
4. Game loads! (may take 30-60 seconds first time)

---

## 🎮 What You'll See

1. **First time**: Progress bar (building app)
2. **Main Menu** appears
3. Click **"New Game"**
4. Select **2 players** (easiest to test)
5. **Play!** Roll dice, move tokens

---

## ⚠️ If Still Getting Errors

**Copy the error message** you see on your phone and send it to me.

Common fixes:
- Make sure phone and computer are on **same WiFi**
- Close and reopen Expo Go app
- Run `npx expo start --clear` again

---

## 📝 Commands Summary

All in one (copy and paste):

```bash
cd "D:\quarterr 4\game\game-ludo\ludo-game"
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
npx expo start --clear
```

Then scan QR code with Expo Go app!
