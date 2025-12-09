# Firebase Integration Quick Start

## Step 1: Deploy Firebase Functions

Before using any features, you need to deploy your Firebase functions to production.

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

This will deploy all these functions to Firebase:
- `getCourses` - Fetch all courses for logged-in user
- `addCourse` - Create a new course
- `updateCourse` - Modify an existing course
- `deleteCourse` - Remove a course
- `getTasks` - Fetch all tasks for logged-in user
- `addTask` - Create a new task
- `updateTask` - Modify an existing task
- `deleteTask` - Remove a task
- `toggleTaskComplete` - Mark task as done/incomplete
- `recordPomodoroSession` - Log a pomodoro session
- `getPomodoroSessions` - Fetch focus sessions
- `getCompletedPomodoros` - Get count of completed work sessions

---

## Step 2: User Authentication

### Login Flow
1. User navigates to `/login`
2. Enters email and password
3. Firebase Auth verifies credentials
4. User is redirected to `/dashboard`
5. Auth context automatically retrieves user ID for data queries

**Files:**
- `app/login/page.tsx` - Login form
- `app/context/authContext.tsx` - Auth state & functions
- `firebase/firebaseConfig.ts` - Firebase setup

### Register Flow
1. User goes to `/register`
2. Enters email and password
3. Firebase creates new user
4. User can then login

---

## Step 3: User Data - Dashboard

Once logged in, the dashboard automatically loads:

### Courses
- User's registered courses
- Displayed as cards showing title, days, times
- Can add/edit/delete courses

### Tasks
- User's to-do items
- Shows 3 most recent tasks
- Can toggle completion, edit, or delete

### Pomodoro Sessions
- Tracked focus sessions
- Displayed in charts
- Can record new sessions in Focus Mode

**Dashboard Page:** `app/dashboard/page.tsx`

---

## Step 4: Additional Pages

### Calendar (`/dashboard/calendar`)
- Visual calendar for current month
- Shows courses and tasks by date
- Click any date to see activities for that day
- Badge shows count of items per day

### Activities (`/dashboard/activities`)
- Timeline of all user activities
- Shows courses, tasks, and pomodoro sessions
- Filter by type or search by keyword
- Displays completion status and importance

### Courses (`/dashboard/courses`)
- List all courses
- Show course schedule
- Edit or delete courses
- Add new courses

### Focus Mode (`/dashboard/focus-mode`)
- Pomodoro timer
- Track work/break sessions
- Records completed sessions to database
- View focus statistics

---

## Step 5: How Data is Organized

### Firestore Database Structure

```
/courses
  ├── {courseId}
  │   ├── title: "Introduction to React"
  │   ├── days: "Monday, Wednesday"
  │   ├── startTime: "10:00 AM"
  │   ├── endTime: "11:30 AM"
  │   └── userId: "user-123"
  └── {courseId}

/tasks
  ├── {taskId}
  │   ├── title: "Complete project report"
  │   ├── notes: "Include graphs and analysis"
  │   ├── dueDate: {Timestamp}
  │   ├── importance: "Hard"
  │   ├── completed: false
  │   └── userId: "user-123"
  └── {taskId}

/pomodoroSessions
  ├── {sessionId}
  │   ├── userId: "user-123"
  │   ├── mode: "work" | "shortBreak" | "longBreak"
  │   ├── duration: 1500 (seconds)
  │   ├── completed: true
  │   └── timestamp: {Timestamp}
  └── {sessionId}
```

### Security

Each collection is protected by Firestore rules:
- Users can only read their own data
- Users can only write to their own data
- All operations verified server-side by Firebase Functions

---

## Step 6: Common Operations

### Add a Course
```typescript
import { addCourse } from "@/lib/firebase/courses";

const handleAddCourse = async (courseData: Course) => {
  const courseId = await addCourse(courseData, user.uid);
  // Reload courses to show new item
};
```

### Get All Tasks
```typescript
import { getTasks } from "@/lib/firebase/tasks";

const handleLoadTasks = async () => {
  const tasks = await getTasks(user.uid);
  setTasks(tasks);
};
```

### Record Focus Session
```typescript
import { recordPomodoroSession } from "@/lib/firebase/pomodoro";

const handleCompleteSession = async () => {
  await recordPomodoroSession(
    user.uid,
    "work",      // mode: "work" | "shortBreak" | "longBreak"
    1500,        // duration in seconds
    true         // completed: boolean
  );
};
```

### Get User Activities
```typescript
import { getUserActivities } from "@/lib/firebase/activities";

const handleViewAll = async () => {
  const allActivities = await getUserActivities(user.uid);
  // Activities = courses + tasks + pomodoro sessions combined
};
```

---

## Step 7: Testing Everything

### Test Login
1. Go to http://localhost:3000/login
2. Use Google Sign-in or create an email account
3. Verify you're redirected to dashboard

### Test Adding Items
1. On dashboard, click "New Course" or "New Task"
2. Fill in details and submit
3. Verify item appears immediately

### Test Calendar
1. Go to `/dashboard/calendar`
2. Click on a day to see activities for that date
3. Verify courses and tasks appear

### Test Activities Page
1. Go to `/dashboard/activities`
2. Try filtering by type
3. Try searching by keyword
4. Verify all items load correctly

### Test Focus Mode
1. Go to `/dashboard/focus-mode`
2. Start a pomodoro session
3. Complete it
4. Verify session is recorded and visible in dashboard

---

## Troubleshooting

### "User must be authenticated" error
- Ensure you're logged in (check `/login`)
- Check that Firebase Auth is initialized in `firebase/firebaseConfig.ts`
- Verify `.env.local` has correct Firebase credentials

### "Permission denied" errors
- This happens if Firestore rules are blocking access
- Verify the `userId` field is set in each document
- Check Firestore rules in `firestore.rules`

### Functions not working
- Ensure functions are deployed: `firebase deploy --only functions`
- Check function names match exactly (case-sensitive)
- Look at Firebase Functions logs in console

### Data not loading
- Check browser console for errors
- Verify network request in DevTools
- Ensure user ID is being passed correctly

---

## Next Steps

1. **Deploy to Firebase:** `firebase deploy`
2. **Set up email templates:** Firebase Console → Authentication → Email Templates
3. **Configure domain:** Add your domain to Firebase Console
4. **Monitor:** Set up error tracking and analytics
5. **Enhance:** Add notes, file attachments, reminders, etc.

---

## Files Reference

| File | Purpose |
|------|---------|
| `app/context/authContext.tsx` | Authentication state & context |
| `app/login/page.tsx` | Login page |
| `app/register/page.tsx` | Registration page |
| `app/dashboard/page.tsx` | Main dashboard |
| `app/dashboard/calendar/page.tsx` | Calendar view |
| `app/dashboard/activities/page.tsx` | Activity timeline |
| `lib/firebase/courses.ts` | Course API wrapper |
| `lib/firebase/tasks.ts` | Task API wrapper |
| `lib/firebase/pomodoro.ts` | Pomodoro API wrapper |
| `lib/firebase/activities.ts` | Activity helpers |
| `functions/src/index.ts` | Firebase Functions (backend) |
| `FIREBASE_INTEGRATION_GUIDE.md` | Detailed architecture guide |
