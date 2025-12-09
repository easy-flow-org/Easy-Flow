# Firebase Functions Setup Guide

This project now uses **Firebase Functions** as the backend API layer, providing better security, centralized logic, and server-side processing.

## Architecture

```
Frontend (Next.js) 
    ↓ HTTP Calls
Firebase Functions (Backend API)
    ↓ Direct Access
Firestore Database
```

## Benefits

✅ **Security**: All database operations happen server-side
✅ **Centralized Logic**: Business logic in one place
✅ **Better Error Handling**: Consistent error responses
✅ **Scalability**: Server-side processing for complex operations
✅ **No Index Issues**: Functions handle queries server-side

## Setup Instructions

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Build Functions

```bash
cd functions
npm run build
cd ..
```

### 5. Deploy Functions to Firebase

```bash
firebase deploy --only functions
```

Or deploy specific functions:
```bash
firebase deploy --only functions:getCourses,functions:addCourse
```

## Development Workflow

### Local Development with Emulator

1. **Start Firebase Emulators:**
   ```bash
   firebase emulators:start
   ```

2. **Update frontend config** (uncomment in `firebase/firebaseConfig.ts`):
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     connectFunctionsEmulator(functions, 'localhost', 5001);
   }
   ```

3. **Run your Next.js app:**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Deploy Functions:**
   ```bash
   firebase deploy --only functions
   ```

2. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy Firestore Indexes:**
   ```bash
   firebase deploy --only firestore:indexes
   ```

## Available Functions

### Courses
- `getCourses()` - Get all courses for authenticated user
- `addCourse(course)` - Add a new course
- `updateCourse(course)` - Update an existing course
- `deleteCourse(courseId)` - Delete a course

### Tasks
- `getTasks()` - Get all tasks for authenticated user
- `addTask(task)` - Add a new task
- `updateTask(task)` - Update an existing task
- `deleteTask(taskId)` - Delete a task
- `toggleTaskComplete(taskId, completed)` - Toggle task completion

### Pomodoro
- `recordPomodoroSession(mode, duration, completed)` - Record a session
- `getPomodoroSessions()` - Get all sessions for authenticated user
- `getCompletedPomodoros()` - Get count of completed work sessions

## Function Structure

All functions:
- ✅ Verify user authentication automatically
- ✅ Enforce user-specific data access
- ✅ Return consistent `{ success: boolean, data?: any }` format
- ✅ Handle errors with proper HTTP error codes

## Security

Functions automatically:
- ✅ Verify the user is authenticated
- ✅ Ensure users can only access their own data
- ✅ Validate input parameters
- ✅ Return appropriate error messages

## Troubleshooting

### Functions not deploying
- Check that you're logged in: `firebase login`
- Verify project: `firebase use <project-id>`
- Check function logs: `firebase functions:log`

### Functions timeout
- Default timeout is 60 seconds
- Increase in `functions/src/index.ts` if needed:
  ```typescript
  export const myFunction = functions
    .runWith({ timeoutSeconds: 300 })
    .https.onCall(...)
  ```

### CORS Issues
- Firebase Functions handle CORS automatically for callable functions
- No additional CORS configuration needed

## Cost Considerations

- **Free Tier**: 2 million invocations/month
- **Pricing**: $0.40 per million invocations after free tier
- **Cold Starts**: First invocation may be slower (~1-2 seconds)

## Next Steps

1. Deploy functions: `firebase deploy --only functions`
2. Test the application - all CRUD operations now go through functions
3. Monitor usage in Firebase Console → Functions

