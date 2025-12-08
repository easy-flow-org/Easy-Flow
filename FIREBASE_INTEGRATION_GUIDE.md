# Firebase Integration Guide - Easy Flow

This guide explains how all features connect to Firebase functions for user authentication and data management.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  (Login → Dashboard → Courses, Tasks, Calendar, Pomodoro)   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Calls (Firebase SDK)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Firebase Authentication                         │
│  ✓ Email/Password login  ✓ Google Sign-in                   │
│  ✓ User session management                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    Firebase      Firebase      Firestore
    Functions     Auth          Database
    (Backend)     (Users)       (Data)
```

## Complete User Flow

### 1. **Authentication (Login/Register)**

**Files Involved:**
- `app/login/page.tsx` - Login UI
- `app/register/page.tsx` - Registration UI
- `app/context/authContext.tsx` - Auth state management
- `firebase/firebaseConfig.ts` - Firebase initialization

**Flow:**
```
User enters email + password 
        ↓
authContext.login() → Firebase Auth
        ↓
User authenticated ✓
        ↓
Redirect to /dashboard
        ↓
Firebase functions verify user with context.auth
```

**Key Code (authContext.tsx):**
```typescript
const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
```

---

### 2. **Dashboard - View All Activities**

**Files Involved:**
- `app/dashboard/page.tsx` - Main dashboard
- `lib/firebase/courses.ts` - Course functions wrapper
- `lib/firebase/tasks.ts` - Task functions wrapper
- `lib/firebase/pomodoro.ts` - Pomodoro functions wrapper
- `functions/src/index.ts` - Backend Firebase functions

**Data Loaded:**
1. **Courses** - User's registered courses (getCourses function)
2. **Tasks** - User's tasks/to-dos (getTasks function)
3. **Pomodoro Sessions** - Focus mode history (getPomodoroSessions function)

**Flow:**
```
Dashboard loads
        ↓
useEffect: Check if user exists (from authContext)
        ↓
Call getCourses(userId) ← Firebase Function
Call getTasks(userId) ← Firebase Function
Call getPomodoroSessions(userId) ← Firebase Function
        ↓
Firestore queries filtered by userId
        ↓
Display data in UI components
```

**Example - Loading Courses:**
```typescript
const loadCourses = async () => {
  if (!user) return;
  try {
    setCoursesLoading(true);
    const fetchedCourses = await getCourses(user.uid);
    setCourses(fetchedCourses);
  } catch (error) {
    console.error("Error loading courses:", error);
  } finally {
    setCoursesLoading(false);
  }
};
```

---

### 3. **Add/Create New Items**

#### Adding a Course:
```typescript
// Frontend (AddCourseModal.tsx)
const handleAddCourse = async (courseData) => {
  try {
    const courseId = await addCourse(courseData, user.uid);
    // Reload courses to show new entry
    loadCourses();
  } catch (error) {
    console.error("Error adding course:", error);
  }
};
```

#### Backend Function:
```typescript
// functions/src/index.ts
export const addCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const course: Course = data.course;
  
  // Validate input
  // Add to Firestore with userId
  // Return success
});
```

---

### 4. **Edit/Update Items**

**Available Update Functions:**
- `updateCourse()` - Modify course details
- `updateTask()` - Change task info or completion status
- `toggleTaskComplete()` - Quick toggle for task done/not done

**Example:**
```typescript
const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    await updateTask({ id: taskId, ...updates }, user.uid);
    loadTasks(); // Refresh
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
```

---

### 5. **Delete Items**

**Available Delete Functions:**
- `deleteCourse(courseId)` - Remove a course
- `deleteTask(taskId)` - Remove a task

**Example:**
```typescript
const handleDeleteTask = async (taskId: string) => {
  if (!confirm("Are you sure?")) return;
  try {
    await deleteTask(taskId);
    loadTasks(); // Refresh
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
```

---

## Feature Details

### **Courses**
- **Collection:** `courses`
- **Functions:** `getCourses`, `addCourse`, `updateCourse`, `deleteCourse`
- **Fields:** title, description, days, startTime, endTime, userId, createdAt
- **Use In:** Dashboard, Calendar

### **Tasks**
- **Collection:** `tasks`
- **Functions:** `getTasks`, `addTask`, `updateTask`, `deleteTask`, `toggleTaskComplete`
- **Fields:** title, notes, dueDate, importance, completed, userId, createdAt
- **Use In:** Dashboard, To-Do list page

### **Pomodoro Sessions**
- **Collection:** `pomodoroSessions`
- **Functions:** `recordPomodoroSession`, `getPomodoroSessions`, `getCompletedPomodoros`
- **Fields:** userId, mode, duration, completed, timestamp
- **Use In:** Focus mode page, Dashboard charts

### **Calendar**
- **Combines:** Courses + Tasks filtered by date
- **Use Functions:** `getCourses`, `getTasks`
- **Sort By:** dueDate / course day

---

## Setting Up Each Page

### Dashboard (`app/dashboard/page.tsx`)

```typescript
const [courses, setCourses] = useState<Course[]>([]);
const [tasks, setTasks] = useState<Task[]>([]);
const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);

useEffect(() => {
  if (user) {
    loadCourses();
    loadTasks();
    loadPomodoroSessions();
  }
}, [user]);

const loadCourses = async () => {
  const data = await getCourses(user.uid);
  setCourses(data);
};

const loadTasks = async () => {
  const data = await getTasks(user.uid);
  setTasks(data);
};

const loadPomodoroSessions = async () => {
  const data = await getPomodoroSessions(user.uid);
  setPomodoroSessions(data);
};
```

### Calendar Page (`app/dashboard/calendar/page.tsx`)

```typescript
// Filter and display courses + tasks by date
const getItemsForDate = (date: Date) => {
  const coursesOnDate = courses.filter(/* match course days */);
  const tasksOnDate = tasks.filter(t => t.dueDate.toDateString() === date.toDateString());
  return [...coursesOnDate, ...tasksOnDate];
};
```

### Courses Page (`app/dashboard/courses/page.tsx`)

```typescript
// List all user courses with edit/delete options
// Connect AddCourseModal to add new courses
// Show course schedules
```

### Focus Mode (`app/dashboard/focus-mode/page.tsx`)

```typescript
// After pomodoro session completes:
const recordSession = async () => {
  await recordPomodoroSession(user.uid, "work", 1500, true);
  // Update completed count for charts
};
```

---

## Authentication & Security

### How Firebase Verifies Users:

1. **On Frontend:**
   - User logs in via Firebase Auth
   - Gets ID token automatically
   - Token sent with Firebase Functions calls

2. **On Backend (Functions):**
   ```typescript
   const verifyAuth = (context: functions.https.CallableContext) => {
     if (!context.auth) {
       throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
     }
     return context.auth.uid;
   };
   ```

3. **Firestore Security Rules:**
   - Each document checks: `request.auth.uid == resource.data.userId`
   - Users can only access their own data
   - Functions verify user ID before accessing database

### Requirements:
- ✓ User must be logged in (Firebase handles this automatically)
- ✓ Every function call is authenticated via Firebase Auth
- ✓ Backend verifies user ownership of data

---

## Common Patterns

### Loading Data with Error Handling:
```typescript
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) loadData();
}, [user]);
```

### Optimistic Updates:
```typescript
const handleDelete = async (id: string) => {
  const original = data;
  setData(data.filter(item => item.id !== id)); // Optimistic
  
  try {
    await deleteFunction(id);
  } catch (error) {
    setData(original); // Revert on error
    toast.error("Failed to delete");
  }
};
```

---

## Deployment Checklist

- [ ] Firebase functions deployed: `firebase deploy --only functions`
- [ ] Firestore rules deployed: `firebase deploy --only firestore:rules`
- [ ] Firestore indexes deployed: `firebase deploy --only firestore:indexes`
- [ ] Environment variables set in `.env.local`
- [ ] Authentication email templates configured (Firebase Console)
- [ ] Database rules tested and verified

---

## Troubleshooting

### "User must be authenticated" Error
- Check if user is logged in (check authContext state)
- Verify Firebase Auth is properly initialized
- Check `.env.local` has correct Firebase config

### "Permission denied" Error
- Function verified wrong userId
- Check Firestore rules and userId field in documents
- Verify function is sending userId correctly

### Functions not accessible
- Check if functions are deployed: `firebase deploy --only functions`
- Verify function names match exactly (case-sensitive)
- Check Firebase project ID in config

---

## Next Steps

1. Test login flow with email/password
2. Add courses and verify they appear in dashboard
3. Add tasks and check completion toggle
4. Run a pomodoro session and verify it's recorded
5. Check calendar displays courses + tasks correctly
6. Deploy functions to Firebase
