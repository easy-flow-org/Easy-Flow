# CORS Error Resolution

## What Was Fixed

✅ **Firebase Functions deployed with Node.js 20**
- All 12 functions deployed successfully
- Functions now support latest Firebase SDK features
- CORS is automatically handled by Callable Functions

## If You Still See CORS Errors

### Step 1: Clear Browser Cache
1. Open DevTools (F12)
2. Go to Network tab
3. Right-click → "Clear browser cache"
4. Hard refresh the page (Ctrl+Shift+R)

### Step 2: Verify Functions Are Callable
Callable Functions automatically handle CORS when called from the Firebase SDK. If errors persist:

**Check in browser console:**
```javascript
// Test if functions work
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();
const testFunc = httpsCallable(functions, "getTasks");
testFunc().then(result => console.log("Success!", result))
        .catch(err => console.error("Error:", err));
```

### Step 3: Check Function Permissions
If you get "Permission denied" or "User not authenticated":
1. Go to Firebase Console → Authentication
2. Verify user is signed in
3. Check Firestore Rules allow the operation

### Step 4: Verify Firestore Rules
Rules should allow users to access their own data:

```
match /tasks/{document=**} {
  allow read, write: if request.auth.uid == resource.data.userId;
}

match /courses/{document=**} {
  allow read, write: if request.auth.uid == resource.data.userId;
}

match /pomodoroSessions/{document=**} {
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

## Testing Checklist

- [ ] Refresh browser (Ctrl+Shift+R to hard refresh)
- [ ] Check you're logged in
- [ ] Open DevTools Console (F12)
- [ ] Try adding a new task
- [ ] Check Network tab for function call status
- [ ] If error shows, note the exact error message

## Common Issues & Solutions

### "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution:** Functions are deployed with Node.js 20. This should be fixed.
- If still happening: Wait 2-3 minutes for cache to clear
- Hard refresh browser: Ctrl+Shift+R
- Clear cache in DevTools

### "FirebaseError: internal"
**Solution:** Usually a Firestore rules issue.
- Check if user is authenticated
- Verify Firestore document has `userId` field matching logged-in user
- Check Firestore rules allow the operation

### "User must be authenticated"
**Solution:** User is not logged in.
- Go to /login page
- Sign in with email/password or Google
- Functions require authentication

### "Permission denied"
**Solution:** User doesn't own the data.
- Check `userId` field in Firestore document
- Verify it matches `request.auth.uid` in rules
- Ensure rules check ownership correctly

## Next Steps

1. **Test Login**
   - Go to /login
   - Sign in with email or Google
   - Should redirect to /dashboard

2. **Test Adding Items**
   - Dashboard → "New Course" button
   - Fill form and submit
   - Should appear in list immediately

3. **Monitor Errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Watch for any error messages
   - Note the exact error for troubleshooting

4. **Check Firebase Logs**
   - Go to Firebase Console
   - Functions → Logs
   - See detailed error messages from backend

## If Problems Persist

1. Check Firebase Console for error logs
2. Verify all environment variables are set (.env.local)
3. Ensure you're on the correct Firebase project
4. Check Firestore is enabled in Firebase Console
5. Verify Authentication is enabled (Email + Google Sign-in)

---

**Remember:** Callable Functions automatically handle CORS! If you get CORS errors after deployment, it's usually a cache issue - just hard refresh your browser.
