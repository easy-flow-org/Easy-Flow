# Firestore Indexes Setup Guide

Firestore requires composite indexes for queries that use both `where` and `orderBy` clauses. You'll need to create indexes for the following queries.

## Quick Setup (Easiest Method)

When you see an error like this in your browser console:
```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

**Simply click the link in the error message** - Firebase will automatically create the index for you! This is the fastest way.

## Required Indexes

### 1. Tasks Collection

**Index for:** `getTasks()` - Get all tasks sorted by due date

**Fields:**
- `userId` (Ascending)
- `dueDate` (Ascending)

**How to create:**
1. Click the link in the error message, OR
2. Go to Firebase Console → Firestore Database → Indexes
3. Click "Create Index"
4. Collection ID: `tasks`
5. Add fields:
   - `userId` - Ascending
   - `dueDate` - Ascending
6. Click "Create"

### 2. Courses Collection

**Index for:** `getCourses()` - Get all courses sorted by creation date

**Fields:**
- `userId` (Ascending)
- `createdAt` (Descending)

**How to create:**
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection ID: `courses`
4. Add fields:
   - `userId` - Ascending
   - `createdAt` - Descending
5. Click "Create"

### 3. Pomodoro Sessions Collection

**Index 1 for:** `getPomodoroSessions()` - Get all sessions sorted by timestamp

**Fields:**
- `userId` (Ascending)
- `timestamp` (Descending)

**How to create:**
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection ID: `pomodoroSessions`
4. Add fields:
   - `userId` - Ascending
   - `timestamp` - Descending
5. Click "Create"

**Index 2 for:** `getCompletedPomodoros()` - Count completed work sessions

**Fields:**
- `userId` (Ascending)
- `mode` (Ascending)
- `completed` (Ascending)

**How to create:**
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection ID: `pomodoroSessions`
4. Add fields:
   - `userId` - Ascending
   - `mode` - Ascending
   - `completed` - Ascending
5. Click "Create"

## Step-by-Step Instructions

### Method 1: Using Error Links (Recommended)

1. Run your application
2. When you see an index error in the console, click the link
3. Firebase Console will open with the index pre-configured
4. Click "Create Index"
5. Wait for the index to build (usually takes 1-2 minutes)
6. Refresh your app

### Method 2: Manual Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **easy-flow-5a461**
3. Click **Firestore Database** in the left sidebar
4. Click on the **Indexes** tab
5. Click **Create Index**
6. Fill in the fields as specified above
7. Click **Create**
8. Wait for the index to build (status will show "Building" then "Enabled")

## Index Building Time

- Indexes typically take **1-2 minutes** to build
- You'll see a status indicator in the Indexes tab
- Your app will work once the index status shows "Enabled"

## Troubleshooting

**Q: The index is taking too long to build**
- A: Large collections may take longer. Wait a few minutes and check again.

**Q: I'm still getting index errors after creating the index**
- A: Make sure the index status is "Enabled" (not "Building"). Refresh your app.

**Q: Can I use the app while indexes are building?**
- A: The queries that need indexes will fail until the index is ready. Other features will work.

## Summary

You need to create **4 indexes** total:
1. ✅ Tasks: `userId` + `dueDate`
2. ✅ Courses: `userId` + `createdAt`
3. ✅ Pomodoro Sessions: `userId` + `timestamp`
4. ✅ Pomodoro Sessions: `userId` + `mode` + `completed`

**Tip:** The easiest way is to just click the links in the error messages - Firebase will create them for you automatically!

