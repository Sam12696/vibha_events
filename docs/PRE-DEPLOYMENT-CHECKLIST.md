# Pre-Deployment Checklist

Use this checklist **BEFORE** merging to main branch or deploying to production.

---

## ✅ Code Quality Checks

### TypeScript & Linting
- [ ] `npm run lint` passes with no errors
- [ ] `npx tsc --noEmit` shows no type errors
- [ ] No `// @ts-ignore` comments in code
- [ ] All imports are used
- [ ] No console.log() statements left in production code

### Manual Code Review
- [ ] Code is readable and well-commented
- [ ] No magic numbers (use named constants)
- [ ] Error messages are user-friendly
- [ ] No hardcoded secrets/passwords
- [ ] No credentials in code (use .env)

### Testing
- [ ] Manual testing on Chrome ✓
- [ ] Manual testing on Firefox ✓
- [ ] Manual testing on Safari ✓
- [ ] Manual testing on iPhone ✓
- [ ] Manual testing on Android ✓
- [ ] All forms validated before submission
- [ ] API endpoints return correct data
- [ ] No console errors in any browser

---

## 🏗️ Build & Performance Checks

### Build Process
- [ ] `npm run build` completes without errors
- [ ] No warnings in build output
- [ ] Build output size is reasonable (check dist/ folder)
- [ ] Source maps are generated

### Performance
- [ ] Lighthouse score > 80 (run: `npm run lighthouse`)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images are optimized
- [ ] No unused dependencies in package.json

### Browser Compatibility
- [ ] Works in Chrome 90+
- [ ] Works in Firefox 88+
- [ ] Works in Safari 14+
- [ ] Works in Edge 90+
- [ ] Responsive on mobile (320px width)
- [ ] Responsive on tablet (768px width)
- [ ] Responsive on desktop (1920px width)

---

## 🔒 Security Checks

### Code Security
- [ ] No hardcoded API keys in code
- [ ] No hardcoded passwords
- [ ] No sensitive data in comments
- [ ] CORS properly configured
- [ ] HTTPS enforced (on production)
- [ ] Security headers set (Helmet.js)
- [ ] Input validation on all forms
- [ ] SQL injection prevention (if using DB)

### Environment Variables
- [ ] `.env.production` is NOT committed
- [ ] `.env.example` shows required variables
- [ ] All required vars are documented
- [ ] Sensitive values in secure vault

### Dependencies
- [ ] No known vulnerabilities: `npm audit`
- [ ] All dependencies are up-to-date
- [ ] No unused dependencies
- [ ] Lock file is committed

---

## 🗂️ File & Configuration Checks

### Essential Files
- [ ] `package.json` has correct version number
- [ ] `tsconfig.json` properly configured
- [ ] `vite.config.ts` configured correctly
- [ ] `.gitignore` excludes secrets and node_modules
- [ ] `README.md` is up-to-date
- [ ] `CHANGELOG.md` documents changes

### Documentation
- [ ] Code comments explain complex logic
- [ ] API endpoints are documented
- [ ] Deployment guide is up-to-date
- [ ] Setup instructions are clear

---

## 🌐 Frontend Checks

### Functionality
- [ ] All pages load without errors
- [ ] All links work correctly
- [ ] Navigation works on mobile
- [ ] Forms submit successfully
- [ ] Contact form validation works
- [ ] Date picker displays correctly
- [ ] Gallery filters work
- [ ] Images display properly
- [ ] Videos load and play
- [ ] Animations are smooth

### Accessibility
- [ ] Alt text on all images
- [ ] Proper heading hierarchy (H1, H2, H3)
- [ ] Color contrast is sufficient (WCAG AA)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### SEO
- [ ] Meta description is set
- [ ] Title tag is descriptive
- [ ] Open Graph tags configured
- [ ] Schema markup for business info
- [ ] Robots.txt configured
- [ ] Sitemap.xml exists

---

## 🔌 Backend Checks

### API Endpoints
- [ ] `/api/projects` returns 200
- [ ] `/api/health` check passes
- [ ] Error handling works
- [ ] Error messages are helpful
- [ ] Response times are acceptable
- [ ] No stack traces exposed to client

### Data Handling
- [ ] Data validation on all inputs
- [ ] Proper error responses (400, 404, 500)
- [ ] Rate limiting configured
- [ ] CORS headers correct
- [ ] Content-Type headers correct

### Server Configuration
- [ ] Environment variables loaded
- [ ] Database connection works
- [ ] Caching configured
- [ ] Logging configured
- [ ] Error tracking setup (Sentry, etc.)

---

## 📋 Git & Deployment Checks

### Git Hygiene
- [ ] All changes committed
- [ ] Commit messages are descriptive
- [ ] No secrets in git history
- [ ] Branch is up-to-date with main
- [ ] No merge conflicts

### Pull Request
- [ ] PR title is descriptive
- [ ] PR description is complete
- [ ] Related issues linked
- [ ] Code reviewed by team
- [ ] All checks passed

### Version Management
- [ ] Version number incremented (semantic versioning)
- [ ] CHANGELOG.md updated
- [ ] Package.json version matches
- [ ] Git tag ready: `v1.0.0`

---

## 🚀 Ready to Deploy?

Once all checks pass:

```bash
# Run pre-deployment script
npm run pre-deploy

# If everything passes:
git checkout -b release/v1.0.0
npm run build
git add .
git commit -m "chore: release v1.0.0"
git push origin release/v1.0.0

# Create PR on GitHub
# Request review
# Merge after approval
# Monitor deployment
```

---

## ⚠️ Common Issues to Avoid

1. **Don't push secrets** - Use .env files
2. **Don't hardcode URLs** - Use environment variables
3. **Don't deploy without testing** - Test all devices
4. **Don't merge without review** - Get approval first
5. **Don't ignore console errors** - Fix all errors
6. **Don't commit node_modules** - Add to .gitignore
7. **Don't forget CORS** - Configure for your domain
8. **Don't skip backups** - Keep previous versions ready

---

## 🆘 If Something Goes Wrong

### Immediate Actions
1. Check deployment logs
2. Review recent changes
3. Check environment variables
4. Verify database connection
5. Check for TypeScript errors

### Rollback
```bash
# Revert last commit
git revert <commit-hash>
git push origin main

# Or use Vercel's built-in rollback
```

### Contact
- **Dev Team**: dev@vibhaevents.com
- **Emergency**: +91-XXXX-XXXX-XX
- **Status Page**: status.vibhaevents.com

---

Last Updated: 2024-01-15
Maintained by: Vibha Events Dev Team
