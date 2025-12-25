# Deploy Ludo Game to Vercel - Step by Step

## ✅ Prerequisites Complete

Your repository is ready for Vercel deployment:
- ✅ Code pushed to GitHub: https://github.com/Farhat-Naz/ludo-mobile-game
- ✅ Web dependencies installed (react-native-web, react-dom)
- ✅ Vercel configuration created (vercel.json)
- ✅ Build script added (npm run build:web)

## 🚀 Deploy to Vercel (Choose One Method)

### Method 1: Vercel Dashboard (Easiest - Recommended)

1. **Go to Vercel**
   - Open https://vercel.com in your browser
   - Click "Sign Up" or "Login"

2. **Connect with GitHub**
   - Click "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

3. **Import Repository**
   - Click "Add New..." → "Project"
   - Find and select `Farhat-Naz/ludo-mobile-game`
   - Click "Import"

4. **Configure Project**
   - **Project Name**: `ludo-mobile-game` (or customize)
   - **Framework Preset**: Vercel will auto-detect (leave as "Other")
   - **Root Directory**: `ludo-game` (IMPORTANT!)
   - **Build & Development Settings**:
     - Build Command: `npx expo export -p web` (auto-filled from vercel.json)
     - Output Directory: `dist` (auto-filled from vercel.json)
     - Install Command: `npm install --legacy-peer-deps` (auto-filled)
   - **Environment Variables**: None needed (skip this section)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for build to complete
   - You'll get a URL like: `https://ludo-mobile-game.vercel.app`

6. **Test Your Game**
   - Click the deployment URL
   - The game should load in your browser
   - Try playing a game to verify everything works

### Method 2: Vercel CLI (For Developers)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd "D:\quarterr 4\game\game-ludo\ludo-game"

# Login to Vercel (opens browser)
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 📱 Important Notes

### What Works on Web
✅ Full game logic (all Ludo rules)
✅ 1-4 player modes
✅ AI opponent
✅ Smooth animations
✅ Visual effects
✅ Audio playback (after user interaction)
✅ Touch controls (works with mouse on desktop)

### What Changes on Web
⚠️ **Haptic Feedback**: Not available on web (gracefully disabled)
⚠️ **Performance**: Slightly lower than native (still 60 FPS capable)
⚠️ **Audio**: May require user interaction before playing (browser policy)

### Recommended Settings
- **Viewport**: Best played on mobile devices or in mobile viewport (F12 → Device toolbar)
- **Browser**: Works best on Chrome, Safari, Firefox
- **Screen Size**: Optimized for 375-430px width (mobile)

## 🔧 Troubleshooting

### Build Fails on Vercel

If deployment fails:

1. **Check Build Logs** in Vercel dashboard
2. **Common Issues**:
   - Root directory not set to `ludo-game`
   - Install command missing `--legacy-peer-deps`
   - Node version mismatch

3. **Fix**: Update Vercel settings:
   - Settings → General → Root Directory: `ludo-game`
   - Settings → General → Node.js Version: `18.x` or `20.x`

### Game Doesn't Load

1. **Clear Browser Cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check Console**: F12 → Console tab for errors
3. **Try Different Browser**: Test in Chrome, Firefox, or Safari

### Routing Issues

If clicking refresh shows 404:
- Check that `vercel.json` includes the rewrite rule
- Redeploy after fixing configuration

## 🎨 Customization After Deployment

### Add Custom Domain

1. Go to Vercel project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `ludo.yourdomain.com`)
4. Update DNS records as instructed by Vercel
5. Wait for SSL certificate (automatic, ~1 hour)

### Enable Analytics

1. Go to project → Analytics tab
2. Click "Enable Analytics"
3. Track page views, performance, and user behavior

### Environment Variables (If Needed Later)

If you add features requiring environment variables:
1. Settings → Environment Variables
2. Add variable name and value
3. Select environments (Production, Preview, Development)
4. Redeploy to apply

## 📊 Next Steps After Deployment

1. ✅ **Test Thoroughly**
   - Play a full game
   - Test all 4 player modes
   - Try AI opponent
   - Check on different devices

2. ✅ **Share Your Game**
   - Share the Vercel URL with friends
   - Post on social media
   - Embed in your portfolio

3. ✅ **Monitor Performance**
   - Check Vercel Analytics
   - Review browser console for errors
   - Gather user feedback

4. ✅ **Iterate**
   - Add sound effects (MP3 files)
   - Implement settings screen
   - Add game statistics tracking
   - Create tutorial screen

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console (F12)
3. Consult documentation:
   - Expo Web: https://docs.expo.dev/workflow/web/
   - Vercel: https://vercel.com/docs
   - React Native Web: https://necolas.github.io/react-native-web/

## 🎉 Success!

Once deployed, your game will be live at:
- **Production**: https://ludo-mobile-game.vercel.app
- **Custom Domain**: (if configured)

Every push to the `main` branch will automatically trigger a new deployment!
