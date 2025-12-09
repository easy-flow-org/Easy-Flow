# Firebase Integration Setup

This document describes the Firebase integration for the Easy-Flow application.

## Firebase Services Configured

### 1. Authentication
- **Location**: `firebase/firebaseConfig.ts`
- **Services**: Email/Password and Google Sign-In
- **Status**: ✅ Already configured and working

### 2. Firestore Database
- **Location**: `firebase/firebaseConfig.ts`
- **Collections**:
  - `courses` - User courses with schedule information
  - `tasks` - User tasks with due dates and importance
  - `pomodoroSessions` - Pomodoro timer session history

### 3. Storage
- **Location**: `firebase/firebaseConfig.ts`
- **Status**: ✅ Configured and ready for file uploads

## Data Structure

### Courses Collection
```typescript
{
  id: string (document ID)
  title: string
  description: string
  days: string (comma-separated)
  startTime: string (HH:mm format)
  endTime: string (HH:mm format)
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Tasks Collection
```typescript
{
  id: string (document ID)
  title: string
  notes: string
  dueDate: Timestamp
  importance: "Easy" | "Medium" | "Hard"
  completed: boolean
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Pomodoro Sessions Collection
```typescript
{
  id: string (document ID)
  userId: string
  mode: "work" | "shortBreak" | "longBreak"
  duration: number (seconds)
  completed: boolean
  timestamp: Timestamp
  createdAt: Timestamp
}
```

## Firebase Service Functions

### Courses (`lib/firebase/courses.ts`)
- `getCourses(userId)` - Get all courses for a user
- `addCourse(course, userId)` - Add a new course
- `updateCourse(course, userId)` - Update an existing course
- `deleteCourse(courseId)` - Delete a course

### Tasks (`lib/firebase/tasks.ts`)
- `getTasks(userId)` - Get all tasks for a user
- `addTask(task, userId)` - Add a new task
- `updateTask(task, userId)` - Update an existing task
- `deleteTask(taskId)` - Delete a task
- `toggleTaskComplete(taskId, completed)` - Toggle task completion status

### Pomodoro (`lib/firebase/pomodoro.ts`)
- `recordPomodoroSession(userId, mode, duration, completed)` - Record a session
- `getPomodoroSessions(userId)` - Get all sessions for a user
- `getCompletedPomodoros(userId)` - Get count of completed work sessions

## Firestore Indexes

Firebase requires composite indexes for queries that use both `where` and `orderBy`. **See `FIRESTORE_INDEXES.md` for detailed setup instructions.**

**Quick Setup:** When you see an index error in the console, click the link provided - Firebase will create the index automatically!

The following indexes are needed:

1. **Tasks**: `userId` (ascending) + `dueDate` (ascending)
2. **Courses**: `userId` (ascending) + `createdAt` (descending)
3. **Pomodoro Sessions**: `userId` (ascending) + `timestamp` (descending)
4. **Pomodoro Sessions (completed count)**: `userId` (ascending) + `mode` (ascending) + `completed` (ascending)

## Environment Variables Required

### Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app yet:
   - Click "Add app" and select the web icon `</>`
   - Register your app (you can name it "Easy-Flow")
   - Copy the configuration values

### Step 2: Create `.env.local` File

Create a file named `.env.local` in the root directory of your project (same level as `package.json`) with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Replace the placeholder values with your actual Firebase config values from Step 1.**

### Step 3: Restart Your Development Server

After creating/updating `.env.local`, you must restart your Next.js development server:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

**Important Notes:**
- The `.env.local` file should NOT be committed to git (it's already in `.gitignore`)
- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Never share your Firebase API keys publicly

## Features Integrated

✅ **Courses Management**
- Create, read, update, delete courses
- User-specific data isolation
- Real-time data loading

✅ **Tasks Management**
- Create, read, update, delete tasks
- Toggle completion status
- User-specific data isolation
- Sorted by due date

✅ **Pomodoro Timer**
- Session tracking
- Completed pomodoros count
- Session history

✅ **Dashboard**
- Displays user's courses and tasks
- Real-time data updates

## Security Rules (Firestore)

Make sure to set up proper security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Courses collection
    match /courses/{courseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Pomodoro sessions collection
    match /pomodoroSessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Testing

1. Make sure you're logged in
2. Try creating a course - it should save to Firestore
3. Try creating a task - it should save to Firestore
4. Complete a pomodoro session - it should be recorded
5. Check Firebase Console to verify data is being saved

