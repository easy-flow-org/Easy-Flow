# Deployment Checklist

## Pre-Deployment Verification

### Firebase Configuration
- [ ] `.env.local` has all Firebase credentials:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Firebase project created in Firebase Console
- [ ] Authentication enabled (Email/Password and Google Sign-in)
- [ ] Firestore database created

### Development Testing
- [ ] User registration works
- [ ] User login works (Email and Google)
- [ ] Adding courses works
- [ ] Adding tasks works
- [ ] Editing items works
- [ ] Deleting items works
- [ ] Dashboard loads all data correctly
- [ ] Calendar displays properly
- [ ] Activities page shows all items
- [ ] No console errors

---

## Deployment Steps

### 1. Deploy Firebase Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

- [ ] Build completes without errors
- [ ] Deployment successful (check Firebase Console)
- [ ] Functions log appears in Console

### 2. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

- [ ] Rules deployed successfully
- [ ] Test that:
  - [ ] Users can read only their own data
  - [ ] Users can write only to their own data

### 3. Deploy Firestore Indexes (if needed)

```bash
firebase deploy --only firestore:indexes
```

- [ ] Any custom indexes deploy successfully
- [ ] Note: Deployment may take a few minutes

### 4. Deploy Next.js Frontend

```bash
# Option 1: Firebase Hosting
npm run build
firebase deploy --only hosting

# Option 2: Vercel
npm run build
# Push to GitHub and Vercel will auto-deploy
```

- [ ] Build succeeds: `npm run build`
- [ ] No build errors
- [ ] Deployment successful
- [ ] Website accessible at live URL

---

## Post-Deployment Testing

### Authentication
- [ ] Can register new account
- [ ] Can login with email
- [ ] Can login with Google
- [ ] Can logout
- [ ] Protected pages redirect to login when not authenticated

### Data Operations
- [ ] Can add new course
- [ ] Can view all courses
- [ ] Can edit course
- [ ] Can delete course
- [ ] Can add new task
- [ ] Can view all tasks
- [ ] Can toggle task completion
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can record pomodoro session

### Pages
- [ ] Dashboard loads and displays data
- [ ] Calendar shows courses and tasks
- [ ] Activities page displays all items
- [ ] Courses page lists all courses
- [ ] Tasks page shows all tasks
- [ ] Focus mode page works

### Performance
- [ ] Pages load quickly (< 3 seconds)
- [ ] No console errors
- [ ] Network requests are fast
- [ ] Mobile responsive

---

## Security Verification

### Firestore Rules
- [ ] Users can only access their own data
- [ ] Unauthenticated users cannot read data
- [ ] Users cannot modify other users' data
- [ ] All documents have `userId` field

### Authentication
- [ ] Email verification is enabled
- [ ] Password reset works
- [ ] Google Sign-in works correctly
- [ ] Session persists on page refresh

### API
- [ ] Firebase Functions verify user authentication
- [ ] Functions validate input data
- [ ] Functions return appropriate error messages

---

## Performance Checklist

- [ ] Lighthouse score > 80 for all metrics
- [ ] Time to First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images are optimized
- [ ] CSS/JS is minified

---

## Monitoring Setup

### Firebase Console
- [ ] Enable Google Analytics
- [ ] Set up error reporting
- [ ] Monitor Functions execution

### Development Tools
- [ ] Set up error tracking (Sentry, Rollbar, etc.)
- [ ] Monitor database operations
- [ ] Track user analytics

---

## Database Backup

- [ ] Enable Firestore automatic backups
- [ ] Test restore process
- [ ] Document backup recovery procedure

---

## Scaling Considerations

### Current Limits
- Firestore: 50,000 reads/day free tier
- Functions: 2 million invocations/month free tier
- Hosting: 10 GB/month free tier

### If approaching limits
- [ ] Implement caching strategy
- [ ] Add database indexes for slow queries
- [ ] Consider paid tier upgrade

---

## Post-Launch Checklist

### User Communication
- [ ] Email notification to beta testers
- [ ] In-app announcement (if applicable)
- [ ] Social media announcement
- [ ] Update README with access instructions

### Documentation
- [ ] User guide published
- [ ] Troubleshooting guide available
- [ ] API documentation updated
- [ ] Known issues documented

### Monitoring
- [ ] Set up alerts for errors
- [ ] Monitor database performance
- [ ] Track user signup rate
- [ ] Monitor feature usage

---

## Rollback Plan

If issues occur after deployment:

### For Code Issues
```bash
# Revert to previous version
git revert <commit-hash>
firebase deploy --only functions
firebase deploy --only hosting
```

### For Database Issues
- Use Firestore backups to restore previous state
- Check error logs in Firebase Console

---

## Troubleshooting During Deployment

### Functions Won't Deploy
- Check for TypeScript errors: `npm run build` in functions folder
- Verify Firebase CLI is up to date: `npm install -g firebase-tools`
- Check Firebase project permissions

### Frontend Won't Build
- Clear cache: `rm -rf .next node_modules`
- Reinstall dependencies: `npm install`
- Check for TypeScript errors: `npm run build`

### Authentication Not Working
- Verify Firebase credentials in `.env.local`
- Check authentication is enabled in Firebase Console
- Verify sign-in methods are enabled

### Data Not Loading
- Check Firestore rules allow access
- Verify functions are deployed
- Check browser console for error messages
- Look at Functions logs in Firebase Console

---

## Version Control

Before deployment:
- [ ] All changes committed to main branch
- [ ] No uncommitted changes
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Create release tag: `git tag -a v1.0.0`
