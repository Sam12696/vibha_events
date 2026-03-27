# Deployment Guide - Vibha Events

## Pre-Deployment Checklist ✅

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Run type checking: `npm run type-check`
- [ ] All tests passing: `npm test`
- [ ] No console errors/warnings
- [ ] No hardcoded secrets/passwords

### Before Merging to Main
- [ ] Code reviewed by team
- [ ] All PRs approved
- [ ] Tests passing in CI/CD
- [ ] Version number updated
- [ ] CHANGELOG.md updated

### Environment Setup
- [ ] `.env.production` configured
- [ ] Database credentials secured
- [ ] API keys in secure vault
- [ ] CORS origins configured correctly
- [ ] Security headers configured

### Testing
- [ ] Tested on iPhone 12+
- [ ] Tested on Android devices
- [ ] Tested on desktop (Chrome, Safari, Firefox)
- [ ] Form validations working
- [ ] API endpoints responding
- [ ] Images loading correctly
- [ ] Performance check (Lighthouse score > 80)

---

## Deployment Steps

### Step 1: Create Release Branch
```bash
git checkout main
git pull origin main
git checkout -b release/v1.0.0
```

### Step 2: Update Version
```bash
# Update package.json versions
# Update CHANGELOG.md
git add .
git commit -m "chore: release v1.0.0"
```

### Step 3: Create Pull Request
- Go to GitHub
- Create PR from `release/v1.0.0` to `main`
- Add release notes
- Request review
- Wait for approval

### Step 4: Merge & Deploy
Once approved:
```bash
# GitHub will automatically deploy via CI/CD
# Or manually on Vercel:
# 1. Go to Vercel Dashboard
# 2. Create deployment from main branch
# 3. Monitor deployment progress
```

### Step 5: Verify Production
- [ ] Website loads at vibhaevents.com
- [ ] All pages accessible
- [ ] Forms working
- [ ] No console errors
- [ ] Analytics tracking
- [ ] Email notifications working

### Step 6: Post-Deployment
```bash
# Create tag for release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

---

## Rollback Procedure

If something goes wrong:
```bash
# Revert to previous version on Vercel
# 1. Go to Vercel Dashboard
# 2. Click on deployments
# 3. Find previous stable version
# 4. Click "Rollback"

# Or manually:
git revert <commit-hash>
git push origin main
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://vibhaevents.com/api
VITE_GA_ID=your-google-analytics-id
```

### Backend (.env.production)
```
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://vibhaevents.com,https://www.vibhaevents.com
LOG_LEVEL=info
```

---

## Performance Targets

- [ ] First Contentful Paint (FCP): < 1.5s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.5s
- [ ] Lighthouse Score: >= 80

Check with:
```bash
npm run lighthouse
```

---

## Monitoring

After deployment, monitor:
- Server logs
- Error tracking (Sentry)
- Performance metrics
- User analytics
- Uptime monitoring

---

## Support

For deployment issues:
1. Check deployment logs
2. Review recent commits
3. Check environment variables
4. Verify database connection
5. Check API endpoints

Contact: team@vibhaevents.com
