# Deployment Guide

## Web Deployment (Vercel)

This Ludo game is built with React Native and Expo, which supports web deployment through `react-native-web`.

### Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works)
- GitHub repository connected

### Local Web Build

Test the web build locally before deploying:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run web development server
npm run web

# Build for production
npm run build:web
```

The build output will be in the `dist/` directory.

### Deploy to Vercel

#### Option 1: Automatic Deployment (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `ludo-mobile-game` repository
5. Vercel will auto-detect the configuration from `vercel.json`
6. Click "Deploy"

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd ludo-game
vercel

# Deploy to production
vercel --prod
```

### Configuration

The project is pre-configured with:

- **vercel.json**: Deployment configuration
  - Build command: `npx expo export -p web`
  - Output directory: `dist`
  - Install command: `npm install --legacy-peer-deps`
  - SPA routing: All routes redirect to `index.html`

- **package.json**:
  - Added `build:web` script for production builds
  - Includes `react-native-web` and `react-dom` dependencies

### Environment Variables

No environment variables are required for the basic game. If you add features that need environment variables:

1. In Vercel dashboard: Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy to apply changes

### Custom Domain

To add a custom domain:

1. Go to Vercel project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### Performance Considerations

**Web vs Native:**
- Web version uses `react-native-web` to render React Native components in the browser
- Animations powered by Reanimated v3 may have reduced performance on web
- Haptic feedback is not available on web (gracefully degrades)
- Audio playback works but may require user interaction first (autoplay policies)

**Optimizations:**
- The game is optimized for mobile viewports
- Responsive design scales to larger screens
- Static export for fast loading
- All assets are bundled and optimized by Expo

## Mobile Deployment (Native Apps)

For deploying native iOS and Android apps, see:
- [iOS Deployment](./docs/deployment.md#ios)
- [Android Deployment](./docs/deployment.md#android)

## Monitoring

After deployment, monitor your app:

- **Vercel Analytics**: Automatic traffic and performance metrics
- **Console Logs**: Check browser console for errors
- **Vercel Logs**: Real-time deployment and runtime logs

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist .expo
npm install --legacy-peer-deps
npm run build:web
```

### Routing Issues

Ensure `vercel.json` has the rewrite rule for SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Dependency Conflicts

Use `--legacy-peer-deps` flag when installing:

```bash
npm install --legacy-peer-deps
```

## Next Steps

After deployment:

1. Test the game on different browsers (Chrome, Firefox, Safari)
2. Test on different devices (desktop, tablet, mobile)
3. Set up analytics to track usage
4. Add custom domain for professional appearance
5. Enable Vercel Analytics for performance monitoring

## Support

For issues:
- Check [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- Check [Vercel Documentation](https://vercel.com/docs)
- Review browser console for errors
