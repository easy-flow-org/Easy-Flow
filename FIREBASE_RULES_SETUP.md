# Firebase Security Rules Setup Guide

## Firestore Security Rules

Copy the rules from `firestore.rules` file and paste them into your Firebase Console.

### How to Set Up Firestore Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **easy-flow-5a461**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the rules from `firestore.rules`
6. Click **Publish** to save the rules

### What These Rules Do:

✅ **Courses Collection**
- Users can only read/write their own courses
- Prevents users from accessing other users' data
- Ensures `userId` matches the authenticated user

✅ **Tasks Collection**
- Users can only read/write their own tasks
- Prevents unauthorized access to task data
- Ensures `userId` matches the authenticated user

✅ **Pomodoro Sessions Collection**
- Users can only read/write their own pomodoro sessions
- Prevents access to other users' session history
- Ensures `userId` matches the authenticated user

### Testing the Rules:

After publishing, test your rules:

1. Try creating a course while logged in - should work ✅
2. Try creating a course while logged out - should fail ❌
3. Try accessing another user's data - should fail ❌

### Important Notes:

- These rules require authentication for all operations
- Each user can only access their own data
- The `userId` field must match the authenticated user's UID
- All other collections are denied by default

## Storage Rules (if you plan to use Firebase Storage)

If you need to store files (images, documents, etc.), add these Storage rules:

1. Go to **Storage** in Firebase Console
2. Click on the **Rules** tab
3. Add these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User-specific files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Need Help?

If you encounter permission errors:
1. Check that you're logged in
2. Verify the rules are published
3. Check the browser console for specific error messages
4. Ensure your Firestore indexes are created (Firebase will prompt you)

