# Easy Flow - Comprehensive Application Documentation

**Version:** 1.0  
**Last Updated:** December 2024  
**Total Pages:** ~20

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Architecture](#application-architecture)
3. [Project Structure](#project-structure)
4. [Technology Stack](#technology-stack)
5. [Core Features & Data Flow](#core-features--data-flow)
6. [Authentication System](#authentication-system)
7. [Firebase Integration](#firebase-integration)
8. [Theme System (Dark/Light Mode)](#theme-system-darklight-mode)
9. [Syllabus AI Parsing](#syllabus-ai-parsing)
10. [Component Architecture](#component-architecture)
11. [State Management](#state-management)
12. [API Routes](#api-routes)
13. [Data Models & Types](#data-models--types)
14. [Calendar Integration](#calendar-integration)
15. [Focus Timer & Games](#focus-timer--games)
16. [Deployment & Configuration](#deployment--configuration)
17. [Code Snippets & Examples](#code-snippets--examples)
18. [Troubleshooting Guide](#troubleshooting-guide)
19. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

**Easy Flow** is a comprehensive student productivity platform built with Next.js 16, React 19, TypeScript, Material-UI, and Firebase. The application helps students manage courses, tasks, schedules, and maintain focus through a Pomodoro-style timer with integrated mini-games.

### Key Capabilities:
- **Course Management**: Create, edit, and delete courses with scheduling
- **Task Management**: Track assignments, exams, and deadlines
- **Calendar View**: Visual representation of courses and tasks
- **AI-Powered Syllabus Parsing**: Automatically extract course information from uploaded syllabi
- **Focus Timer**: Pomodoro technique with break games
- **Dark/Light Mode**: Full theme support
- **Activity Tracking**: Monitor productivity and study sessions

### Architecture Pattern:
- **Frontend**: Next.js App Router (Server/Client Components)
- **Backend**: Firebase Cloud Functions
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **AI Integration**: Anthropic Claude API

---

## 2. Application Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │  Material-UI │  │   React 19   │     │
│  │  App Router  │  │  Components  │  │   Hooks      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Server)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  /api/parse-syllabus (Anthropic Claude API)       │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Firebase SDK
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │  Firestore   │  │  Functions   │     │
│  │  (Users)     │  │  (Data)      │  │  (Backend)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Diagram

**Adding a Course:**
```
User Input (AddCourseModal)
    ↓
Frontend Validation
    ↓
addCourse() → Firebase Functions
    ↓
Cloud Function: addCourse
    ↓
Firestore: courses collection
    ↓
Real-time Update → Frontend
    ↓
UI Refresh (Courses Page + Calendar)
```

**Adding a Task:**
```
User Input (AddTaskModal)
    ↓
Frontend Validation
    ↓
addTask() → Firebase Functions
    ↓
Cloud Function: addTask
    ↓
Firestore: tasks collection
    ↓
Real-time Update → Frontend
    ↓
UI Refresh (Tasks Page + Calendar + Activities)
```

**Syllabus Parsing:**
```
User Uploads File
    ↓
SyllabusUploader Component
    ↓
POST /api/parse-syllabus
    ↓
Extract Text (PDF/DOCX/TXT)
    ↓
Anthropic Claude API
    ↓
Parse JSON Response
    ↓
Create Course + Tasks
    ↓
Save to Firestore
    ↓
UI Update
```

---

## 3. Project Structure

### 3.1 Directory Tree

```
Easy-Flow/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── parse-syllabus/       # AI Syllabus Parser
│   │       └── route.ts
│   ├── context/                  # React Context Providers
│   │   ├── authContext.tsx       # Authentication State
│   │   └── ThemeContext.tsx      # Theme State (Dark/Light)
│   ├── dashboard/                # Protected Dashboard Routes
│   │   ├── activities/           # Activity Feed Page
│   │   ├── calendar/             # Calendar View Page
│   │   ├── courses/              # Courses Management Page
│   │   ├── focus-mode/           # Pomodoro Timer Page
│   │   ├── tasks/                # Tasks Management Page
│   │   ├── components/           # Dashboard Components
│   │   │   ├── AddCourseModal.tsx
│   │   │   ├── AddTaskModal.tsx
│   │   │   ├── SideNav.tsx
│   │   │   └── ...
│   │   ├── layout.tsx            # Dashboard Layout
│   │   └── page.tsx              # Dashboard Home
│   ├── login/                    # Login Page
│   ├── register/                 # Registration Page
│   ├── layout.tsx                # Root Layout
│   ├── theme.tsx                 # MUI Theme Configuration
│   └── globals.css               # Global Styles
├── components/                    # Shared Components
│   ├── LandingPage/              # Landing Page Components
│   └── SyllabusUploader.tsx      # Syllabus Upload Component
├── lib/                          # Utility Libraries
│   ├── firebase/                 # Firebase Wrappers
│   │   ├── courses.ts            # Course CRUD Operations
│   │   ├── tasks.ts              # Task CRUD Operations
│   │   ├── activities.ts         # Activity Queries
│   │   └── pomodoro.ts           # Pomodoro Session Tracking
│   ├── auth.tsx                  # Auth Utilities (Legacy)
│   ├── getDateAbbrev.ts          # Date Formatting
│   └── to12Hour.ts               # Time Conversion
├── firebase/                     # Firebase Configuration
│   └── firebaseConfig.ts         # Firebase Initialization
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts              # All Backend Functions
│   └── package.json
├── types/                        # TypeScript Definitions
│   └── types.ts                  # Core Type Definitions
├── public/                       # Static Assets
├── firestore.rules               # Firestore Security Rules
├── firestore.indexes.json        # Database Indexes
└── package.json                  # Dependencies
```

### 3.2 Key File Descriptions

**`app/layout.tsx`** - Root layout wrapping all pages with providers
**`app/context/ThemeContext.tsx`** - Theme state management (dark/light mode)
**`app/context/authContext.tsx`** - Authentication state management
**`lib/firebase/courses.ts`** - Course data operations (CRUD)
**`lib/firebase/tasks.ts`** - Task data operations (CRUD)
**`functions/src/index.ts`** - Backend Cloud Functions (server-side logic)
**`types/types.ts`** - TypeScript interfaces and types

---

## 4. Technology Stack

### 4.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.0 | React Framework (App Router) |
| React | 19.2.0 | UI Library |
| TypeScript | 5.x | Type Safety |
| Material-UI | 7.3.4 | Component Library |
| @mui/x-date-pickers | 8.19.0 | Date/Time Pickers |
| @mui/x-charts | 8.17.0 | Data Visualization |
| react-dropzone | 14.3.8 | File Upload |
| react-toastify | 11.0.5 | Notifications |
| date-fns | 4.1.0 | Date Manipulation |

### 4.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Firebase | 12.3.0 | Backend Services |
| Firebase Functions | - | Serverless Backend |
| Firestore | - | NoSQL Database |
| Firebase Auth | - | Authentication |
| Anthropic SDK | 0.71.2 | AI (Claude) Integration |

### 4.3 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code Linting |
| TypeScript | Type Checking |
| Firebase CLI | Deployment |

---

## 5. Core Features & Data Flow

### 5.1 Course Management

#### 5.1.1 Adding a Course

**Component:** `app/dashboard/components/AddCourseModal.tsx`

**Flow:**
1. User clicks "Add Course" button
2. Modal opens with form fields
3. User fills: title, days, startTime, endTime, description, notes
4. Form submission triggers `addOrUpdateCourse()`
5. Function calls `addCourse()` from `lib/firebase/courses.ts`
6. Firebase Function `addCourse` executes
7. Course saved to Firestore `courses` collection
8. Frontend refreshes course list
9. Calendar automatically updates (reads from same data source)

**Key Code Snippet:**

```typescript
// app/dashboard/courses/page.tsx
const addOrUpdateCourse = async (newCourse: Course) => {
  if (!user) return
  try {
    const isUpdate = courses.some((c) => c.id === newCourse.id)
    if (isUpdate) {
      await updateCourse(newCourse, user.uid)
      toast.success("Course updated successfully!")
    } else {
      const newId = await addCourse(newCourse, user.uid)
      newCourse.id = newId
      toast.success("Course added successfully!")
    }
    await loadCourses()  // Refresh list
    setSelected((s) => (s?.id === newCourse.id ? newCourse : s))
    closeModal()
  } catch (error) {
    console.error("Error saving course:", error)
    toast.error("Failed to save course. Please try again.")
  }
}
```

**Firebase Function (Backend):**

```typescript
// functions/src/index.ts
export const addCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const course: Course = data.course;
  
  // Validation
  if (!course.title || !course.days || !course.startTime || !course.endTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required course fields"
    );
  }
  
  // Add to Firestore
  const courseRef = db.collection("courses").doc();
  await courseRef.set({
    ...course,
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { success: true, id: courseRef.id };
});
```

#### 5.1.2 Course Data Structure

```typescript
// types/types.ts
export interface Course {
  id: string;
  title: string;
  description?: string;
  days: string;              // "Monday, Wednesday, Friday"
  startTime: string;         // "09:00" (24-hour format)
  endTime: string;           // "10:30" (24-hour format)
  notes?: string;            // Additional course notes
}
```

**Firestore Document:**
```json
{
  "id": "course_123",
  "title": "Introduction to Computer Science",
  "description": "Fundamentals of programming",
  "days": "Monday, Wednesday, Friday",
  "startTime": "09:00",
  "endTime": "10:30",
  "notes": "Office hours: Tuesdays 2-4 PM",
  "userId": "user_abc123",
  "createdAt": "2024-12-13T10:00:00Z"
}
```

### 5.2 Task Management

#### 5.2.1 Adding a Task

**Component:** `app/dashboard/components/AddTaskModal.tsx`

**Flow:**
1. User clicks "Add Task" button
2. Modal opens with form
3. User fills: title, notes, dueDate, importance
4. Form submission calls `addOrUpdateTask()`
5. Function calls `addTask()` from `lib/firebase/tasks.ts`
6. Firebase Function `addTask` executes
7. Task saved to Firestore `tasks` collection
8. Frontend refreshes task list
9. Calendar and Activities pages update automatically

**Key Code Snippet:**

```typescript
// app/dashboard/tasks/page.tsx
const addOrUpdateTask = async (task: TaskBase) => {
  if (!user) return
  try {
    const isUpdate = tasks.some((t) => t.id === task.id)
    if (isUpdate) {
      await updateTask(task, user.uid)
      toast.success("Task updated successfully!")
    } else {
      const newId = await addTask(task, user.uid)
      toast.success("Task added successfully!")
    }
    await loadTasks()  // Refresh list
  } catch (error) {
    console.error("Error saving task:", error)
    toast.error("Failed to save task. Please try again.")
  }
}
```

#### 5.2.2 Task Data Structure

```typescript
// types/types.ts
export interface TaskBase {
  id?: string;
  title: string;
  notes?: string;
  dueDate: Date;
  importance: "Easy" | "Medium" | "Hard";
  completed: boolean;
}

export interface Task extends TaskBase {
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
```

**Firestore Document:**
```json
{
  "id": "task_456",
  "title": "Complete Assignment 3",
  "notes": "Submit on Canvas",
  "dueDate": "2024-12-20T23:59:00Z",
  "importance": "Hard",
  "completed": false,
  "userId": "user_abc123",
  "createdAt": "2024-12-13T10:00:00Z"
}
```

### 5.3 Calendar Integration

#### 5.3.1 How Calendar Populates

**Component:** `app/dashboard/calendar/page.tsx`

**Data Sources:**
1. **Courses**: Fetched from `courses` collection
2. **Tasks**: Fetched from `tasks` collection
3. **Combined**: Merged and displayed by date

**Key Code Snippet:**

```typescript
// app/dashboard/calendar/page.tsx
useEffect(() => {
  if (user) {
    loadCourses()
    loadTasks()
  }
}, [user])

// Combine courses and tasks for calendar display
const calendarEvents = useMemo(() => {
  const events: CalendarEvent[] = []
  
  // Add courses (recurring weekly)
  courses.forEach(course => {
    const days = course.days.split(',').map(d => d.trim())
    days.forEach(day => {
      const dayIndex = getDayIndex(day) // Monday = 0, etc.
      events.push({
        id: `course-${course.id}-${day}`,
        title: course.title,
        type: 'course',
        startTime: course.startTime,
        endTime: course.endTime,
        day: dayIndex,
        color: getCourseColor(course),
      })
    })
  })
  
  // Add tasks (one-time events)
  tasks.forEach(task => {
    if (!task.completed) {
      events.push({
        id: `task-${task.id}`,
        title: task.title,
        type: 'task',
        date: task.dueDate,
        importance: task.importance,
        color: getImportanceColor(task.importance),
      })
    }
  })
  
  return events
}, [courses, tasks])
```

**Calendar Display Logic:**

```typescript
// Render weekly calendar with courses and tasks
const renderCalendarWeek = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  return days.map((day, index) => {
    const dayEvents = calendarEvents.filter(event => {
      if (event.type === 'course') {
        return event.day === index
      } else if (event.type === 'task') {
        const taskDate = new Date(event.date)
        return taskDate.getDay() === (index + 1) % 7
      }
      return false
    })
    
    return (
      <CalendarDay
        key={day}
        day={day}
        events={dayEvents}
      />
    )
  })
}
```

---

## 6. Authentication System

### 6.1 Authentication Flow

**Provider:** `app/context/authContext.tsx`

**Features:**
- Email/Password Authentication
- Google Sign-In
- Email Verification
- Session Persistence
- Protected Routes

**Key Code:**

```typescript
// app/context/authContext.tsx
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleSignIn = () => signInWithPopup(auth, googleProvider);

  const logout = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, googleSignIn, logout, sendVerification }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

### 6.2 Protected Routes

**Implementation:** Dashboard routes are protected by checking `user` state

```typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <CircularProgress />;
  if (!user) return null;

  // Dashboard content...
}
```

### 6.3 Firebase Auth Configuration

```typescript
// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

---

## 7. Firebase Integration

### 7.1 Firestore Database Structure

**Collections:**

1. **`courses`** - Course documents
   - Fields: id, title, description, days, startTime, endTime, notes, userId, createdAt
   - Indexes: userId, createdAt

2. **`tasks`** - Task documents
   - Fields: id, title, notes, dueDate, importance, completed, userId, createdAt
   - Indexes: userId, dueDate, completed

3. **`pomodoroSessions`** - Focus session documents
   - Fields: id, userId, duration, mode, completedAt
   - Indexes: userId, completedAt

### 7.2 Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId) && 
                      request.resource.data.userId == resource.data.userId;
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId) && 
                      request.resource.data.userId == resource.data.userId;
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```

### 7.3 Cloud Functions

**Location:** `functions/src/index.ts`

**Available Functions:**

1. **`getCourses`** - Fetch all courses for authenticated user
2. **`addCourse`** - Create new course
3. **`updateCourse`** - Update existing course
4. **`deleteCourse`** - Delete course
5. **`getTasks`** - Fetch all tasks for authenticated user
6. **`addTask`** - Create new task
7. **`updateTask`** - Update existing task
8. **`deleteTask`** - Delete task
9. **`toggleTaskComplete`** - Toggle task completion status
10. **`getUserActivities`** - Fetch combined activities (courses, tasks, sessions)

**Example Function:**

```typescript
// functions/src/index.ts
export const addCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const course: Course = data.course;
  
  if (!course.title || !course.days || !course.startTime || !course.endTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required course fields"
    );
  }
  
  const courseRef = db.collection("courses").doc();
  await courseRef.set({
    ...course,
    id: courseRef.id,
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { success: true, id: courseRef.id };
});
```

### 7.4 Data Access Layer

**Location:** `lib/firebase/`

**Pattern:** All data operations go through Firebase Functions (not direct Firestore access)

```typescript
// lib/firebase/courses.ts
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

export const addCourse = async (course: Course, userId: string): Promise<string> => {
  const addCourseFunction = httpsCallable(functions, "addCourse");
  const result = await addCourseFunction({ course });
  
  if (result.data && (result.data as any).success) {
    return (result.data as any).id;
  }
  throw new Error("Failed to add course");
};
```

---

## 8. Theme System (Dark/Light Mode)

### 8.1 Theme Context

**Location:** `app/context/ThemeContext.tsx`

**Features:**
- Dark/Light mode toggle
- System preference detection
- LocalStorage persistence
- MUI theme integration

**Key Code:**

```typescript
// app/context/ThemeContext.tsx
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setMode(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Create MUI theme
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}
```

### 8.2 Theme Configuration

```typescript
// app/context/ThemeContext.tsx (getTheme function)
const getTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      primary: { main: "#206cb9ff" },
      secondary: { main: "#f50057" },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
    // ... component overrides
  });
};
```

### 8.3 Theme Toggle UI

**Location:** `app/dashboard/components/SideNav.tsx`

```typescript
// Theme toggle button in sidebar
const { mode, toggleTheme } = useThemeMode();

<Button
  fullWidth
  startIcon={mode === 'dark' ? <LightMode /> : <DarkMode />}
  onClick={toggleTheme}
>
  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
</Button>
```

---

## 9. Syllabus AI Parsing

### 9.1 Overview

The syllabus parsing feature uses Anthropic's Claude AI to extract course information from uploaded documents (PDF, DOCX, TXT).

### 9.2 Flow Diagram

```
User Uploads File
    ↓
SyllabusUploader Component
    ↓
POST /api/parse-syllabus
    ↓
Extract Text (mammoth/pdf-parse)
    ↓
Truncate to 50,000 chars
    ↓
Send to Claude API
    ↓
Parse JSON Response
    ↓
Extract: courseTitle, meetingDays, times, assignments, exams
    ↓
Build Notes Content
    ↓
Create Course + Tasks
    ↓
Save to Firestore
```

### 9.3 API Route

**Location:** `app/api/parse-syllabus/route.ts`

**Key Code:**

```typescript
export async function POST(request: NextRequest) {
  // 1. Get file from FormData
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // 2. Extract text based on file type
  let extractedText = '';
  if (file.type === 'text/plain') {
    extractedText = await file.text();
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = await import('mammoth');
    const buffer = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
    extractedText = res.value || '';
  } else if (file.type === 'application/pdf') {
    const pdfParse = await import('pdf-parse');
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));
    extractedText = data?.text || '';
  }
  
  // 3. Truncate for token limits
  const truncatedText = extractedText.slice(0, 50000);
  
  // 4. Build prompt for Claude
  const prompt = `You are a syllabus parser. Extract all relevant course and assignment information...
  
  Return EXACTLY this JSON structure:
  {
    "courseTitle": "course name/title",
    "meetingDays": "full day names like 'Monday, Wednesday, Friday'",
    "startTime": "HH:MM in 24-hour format",
    "endTime": "HH:MM in 24-hour format",
    "instructor": "instructor name or null",
    "location": "classroom location or null",
    "semester": "semester info or null",
    "description": "course description",
    "assignments": [...],
    "exams": [...],
    "notes": "detailed syllabus notes"
  }
  
  Syllabus text:
  ${truncatedText}`;
  
  // 5. Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
  
  // 6. Parse JSON response
  const responseText = message?.content[0]?.text || '';
  let cleanedResponse = responseText.trim();
  if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
  const parsedData = JSON.parse(jsonMatch[0]);
  
  // 7. Return parsed data
  return NextResponse.json(parsedData);
}
```

### 9.4 Frontend Processing

**Location:** `components/SyllabusUploader.tsx`

```typescript
const parseSyllabus = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/parse-syllabus", {
    method: "POST",
    body: formData,
  });
  
  const parsedResult = await response.json();
  
  // Extract meeting days
  const meetingDays = parsedResult.meetingDays || "MWF";
  const parsedDays = parseMeetingDays(meetingDays);
  
  // Build notes (prioritize API notes if comprehensive)
  let notesContent = '';
  if (parsedResult.notes && parsedResult.notes.length > 50) {
    notesContent = parsedResult.notes;
  } else {
    notesContent = buildNotesFromParsedData(parsedResult);
  }
  
  // Create course data
  const courseData: ParsedCourseData = {
    title: parsedResult.courseTitle || file.name.replace(/\.[^/.]+$/, ""),
    days: parsedDays,
    startTime: parsedResult.startTime || "09:00",
    endTime: parsedResult.endTime || "10:30",
    description: parsedResult.description || "Course created from syllabus",
    notes: notesContent,
    instructor: parsedResult.instructor,
    location: parsedResult.location,
    semester: parsedResult.semester,
  };
  
  // Extract tasks from assignments and exams
  const tasksData: ParsedTaskData[] = [];
  
  if (parsedResult.assignments && Array.isArray(parsedResult.assignments)) {
    parsedResult.assignments.forEach((assignment: any) => {
      tasksData.push({
        title: assignment.title || "Assignment",
        description: assignment.description || "",
        dueDate: new Date(assignment.dueDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
        importance: assignment.weight > 20 ? "Hard" : "Medium",
        type: "assignment",
      });
    });
  }
  
  if (parsedResult.exams && Array.isArray(parsedResult.exams)) {
    parsedResult.exams.forEach((exam: any) => {
      tasksData.push({
        title: exam.title || "Exam",
        description: exam.description || "",
        dueDate: new Date(exam.date || Date.now() + 30 * 24 * 60 * 60 * 1000),
        importance: "Hard",
        type: "exam",
      });
    });
  }
  
  return { courseData, tasksData };
};
```

### 9.5 Notes Building Function

```typescript
const buildNotesFromParsedData = (result: any): string => {
  const lines: string[] = [];
  
  lines.push("=== SYLLABUS INFORMATION ===\n");
  
  if (result.instructor) lines.push(`Instructor: ${result.instructor}`);
  if (result.location) lines.push(`Location: ${result.location}`);
  if (result.semester) lines.push(`Semester: ${result.semester}`);
  if (result.startTime && result.endTime) {
    lines.push(`Class Time: ${result.startTime} - ${result.endTime}`);
  }
  if (result.description) lines.push(`\nDescription: ${result.description}`);
  
  // Include API notes if available
  if (result.notes && result.notes.trim().length > 0) {
    lines.push(`\n=== DETAILED SYLLABUS NOTES ===\n${result.notes}\n`);
  }
  
  // Add course objectives
  if (result.courseObjectives && Array.isArray(result.courseObjectives)) {
    lines.push("\n=== COURSE OBJECTIVES ===\n");
    result.courseObjectives.forEach((obj: string) => {
      lines.push(`• ${obj}`);
    });
  }
  
  // Add assignments
  if (result.assignments && Array.isArray(result.assignments)) {
    lines.push("\n=== ASSIGNMENTS ===\n");
    result.assignments.forEach((assignment: any) => {
      const weight = assignment.weight ? ` (${assignment.weight}%)` : "";
      const dueDate = assignment.dueDate ? ` - Due: ${assignment.dueDate}` : "";
      lines.push(`• ${assignment.title}${weight}${dueDate}`);
      if (assignment.description) {
        lines.push(`  ${assignment.description}`);
      }
    });
  }
  
  // Add exams
  if (result.exams && Array.isArray(result.exams)) {
    lines.push("\n=== EXAMS ===\n");
    result.exams.forEach((exam: any) => {
      const date = exam.date ? ` - ${exam.date}` : "";
      const weight = exam.weight ? ` (${exam.weight}%)` : "";
      lines.push(`• ${exam.title}${weight}${date}`);
      if (exam.description) {
        lines.push(`  ${exam.description}`);
      }
    });
  }
  
  // Add grading scale, requirements, policies
  if (result.gradingScale) {
    lines.push("\n=== GRADING SCALE ===\n");
    lines.push(result.gradingScale);
  }
  
  lines.push(`\n=== IMPORTED ===\nDate: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`);
  
  return lines.join("\n");
};
```

---

## 10. Component Architecture

### 10.1 Component Hierarchy

```
RootLayout
├── ThemeProvider
│   ├── AuthProvider
│   │   ├── LandingPage (/) OR
│   │   ├── LoginPage (/login) OR
│   │   ├── RegisterPage (/register) OR
│   │   └── DashboardLayout (/dashboard)
│   │       ├── SideNav
│   │       └── Dashboard Pages
│   │           ├── DashboardHome
│   │           ├── CoursesPage
│   │           │   ├── AddCourseModal
│   │           │   └── SyllabusUploader
│   │           ├── TasksPage
│   │           │   └── AddTaskModal
│   │           ├── CalendarPage
│   │           ├── ActivitiesPage
│   │           └── FocusModePage
│   │               └── Game Components
```

### 10.2 Key Components

#### 10.2.1 SideNav Component

**Location:** `app/dashboard/components/SideNav.tsx`

**Features:**
- Navigation menu
- Theme toggle
- User profile
- Responsive (mobile drawer, desktop sidebar)
- Collapsible sidebar

**Key Props/State:**
- `pathname` - Current route (for active highlighting)
- `mobileOpen` - Mobile drawer state
- `desktopCollapsed` - Sidebar collapse state
- `hoveredItem` - Hover state for animations

#### 10.2.2 AddCourseModal Component

**Location:** `app/dashboard/components/AddCourseModal.tsx`

**Features:**
- Form validation
- Day selector (CourseDaySelector)
- Time pickers
- Notes field
- Edit mode support

**Key Code:**

```typescript
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const newCourse: Course = {
    id: props.editingCourse?.id ?? crypto.randomUUID(),
    title: data.get('courseTitle') as string,
    description: data.get('courseDescription') as string,
    days: data.get('courseDays') as string,
    startTime: data.get('startTime') as string,
    endTime: data.get('endTime') as string,
    notes: data.get('courseNotes') as string,
  };
  props.addNewCourse(newCourse);
  props.close();
}
```

#### 10.2.3 SyllabusUploader Component

**Location:** `components/SyllabusUploader.tsx`

**Features:**
- File upload (drag & drop)
- File type validation (PDF, DOCX, TXT)
- AI parsing
- Preview parsed data
- Error handling
- Fallback parsing

---

## 11. State Management

### 11.1 Context Providers

**1. ThemeContext** - Theme state (dark/light mode)
**2. AuthContext** - Authentication state (user, loading)

### 11.2 Local State Management

Most components use React `useState` and `useEffect` for local state:

```typescript
// Example: Courses Page
const [courses, setCourses] = useState<Course[]>([]);
const [selected, setSelected] = useState<Course | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (user) {
    loadCourses();
  }
}, [user]);
```

### 11.3 Data Fetching Pattern

```typescript
const loadCourses = async () => {
  if (!user) return;
  try {
    setLoading(true);
    const fetchedCourses = await getCourses(user.uid);
    setCourses(fetchedCourses);
  } catch (error) {
    console.error("Error loading courses:", error);
    toast.error("Failed to load courses");
  } finally {
    setLoading(false);
  }
};
```

---

## 12. API Routes

### 12.1 Available Routes

**`POST /api/parse-syllabus`**
- Purpose: Parse syllabus file with AI
- Input: FormData with `file` field
- Output: JSON with parsed course and task data
- Authentication: None (public route, but should be protected in production)

### 12.2 Route Implementation

See Section 9.3 for detailed implementation.

---

## 13. Data Models & Types

### 13.1 Core Types

**Location:** `types/types.ts`

```typescript
// Course
export interface Course {
  id: string;
  title: string;
  description?: string;
  days: string;              // "Monday, Wednesday, Friday"
  startTime: string;         // "09:00"
  endTime: string;           // "10:30"
  notes?: string;
}

// Task
export interface TaskBase {
  id?: string;
  title: string;
  notes?: string;
  dueDate: Date;
  importance: "Easy" | "Medium" | "Hard";
  completed: boolean;
}

export interface Task extends TaskBase {
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// Parsed Data (from AI)
export interface ParsedCourseData {
  title: string;
  days: string;
  startTime: string;
  endTime: string;
  description?: string;
  notes?: string;
  instructor?: string;
  location?: string;
  semester?: string;
}

export interface ParsedTaskData {
  title: string;
  description?: string;
  dueDate: Date;
  importance: "Easy" | "Medium" | "Hard";
  type?: "assignment" | "exam";
  weight?: number;
}
```

---

## 14. Calendar Integration

### 14.1 Calendar Data Flow

**How Courses Appear:**
1. Courses stored with `days` field (e.g., "Monday, Wednesday, Friday")
2. Calendar parses days string
3. Creates recurring weekly events
4. Displays on corresponding days

**How Tasks Appear:**
1. Tasks stored with `dueDate` field
2. Calendar extracts date from `dueDate`
3. Displays as one-time events
4. Color-coded by importance

### 14.2 Calendar Component

**Location:** `app/dashboard/calendar/page.tsx`

**Key Features:**
- Weekly view
- Daily breakdown
- Course time slots
- Task deadlines
- Color coding
- Responsive design

**Key Code:**

```typescript
// Combine courses and tasks
const calendarEvents = useMemo(() => {
  const events: CalendarEvent[] = [];
  
  // Process courses (recurring)
  courses.forEach(course => {
    const days = course.days.split(',').map(d => d.trim());
    days.forEach(day => {
      const dayIndex = getDayIndex(day);
      events.push({
        id: `course-${course.id}-${day}`,
        title: course.title,
        type: 'course',
        startTime: course.startTime,
        endTime: course.endTime,
        day: dayIndex,
        color: getCourseColor(course),
      });
    });
  });
  
  // Process tasks (one-time)
  tasks.forEach(task => {
    if (!task.completed) {
      const taskDate = new Date(task.dueDate);
      events.push({
        id: `task-${task.id}`,
        title: task.title,
        type: 'task',
        date: taskDate,
        importance: task.importance,
        color: getImportanceColor(task.importance),
      });
    }
  });
  
  return events;
}, [courses, tasks]);
```

---

## 15. Focus Timer & Games

### 15.1 Pomodoro Timer

**Location:** `app/dashboard/focus-mode/page.tsx`

**Features:**
- Work sessions (25 min default)
- Short breaks (5 min)
- Long breaks (15 min)
- Customizable durations
- Progress tracking
- Session statistics

### 15.2 Timer Implementation

```typescript
const TIMER_SETTINGS = {
  work: 25 * 60,        // 25 minutes
  shortBreak: 5 * 60,  // 5 minutes
  longBreak: 15 * 60,  // 15 minutes
};

const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
const [isRunning, setIsRunning] = useState(false);

useEffect(() => {
  if (isRunning && timeLeft > 0) {
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  } else if (timeLeft === 0) {
    handleTimerComplete();
  }
}, [isRunning, timeLeft]);
```

### 15.3 Break Games

**Available Games:**
1. **Tic Tac Toe** - Classic 3x3 game
2. **Memory Game** - Card matching
3. **Dice Roll** - Target number challenge
4. **Word Scramble** - Unscramble words (60s timer)
5. **Quick Math** - Solve math problems (60s timer)
6. **Reaction Time** - Test reaction speed (5 rounds)
7. **Pattern Memory** - Simon Says style (progressive difficulty)
8. **Number Sequence** - Complete sequences (60s timer)

**Game Integration:**

```typescript
const handleTimerComplete = () => {
  setIsRunning(false);
  if (mode === 'work') {
    setPomodorosCompleted((prev) => prev + 1);
    const nextMode = (pomodorosCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
    setMode(nextMode);
    setTimeLeft(TIMER_SETTINGS[nextMode]);
    
    // Suggest game after work session
    if (nextMode === 'shortBreak' || nextMode === 'longBreak') {
      setTimeout(() => {
        setShowGameModal(true);
      }, 500);
    }
  }
};
```

---

## 16. Deployment & Configuration

### 16.1 Environment Variables

**Required Variables:**

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Anthropic (Claude AI)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 16.2 Firebase Deployment

**Deploy Functions:**
```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

**Deploy Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

**Deploy Firestore Indexes:**
```bash
firebase deploy --only firestore:indexes
```

### 16.3 Next.js Deployment

**Build:**
```bash
npm run build
```

**Start Production:**
```bash
npm start
```

**Deploy to Vercel:**
```bash
vercel deploy
```

---

## 17. Code Snippets & Examples

### 17.1 Adding a Course (Complete Flow)

```typescript
// 1. User clicks "Add Course" → Opens modal
<Button onClick={() => setShowAddCourseModal(true)}>
  Add Course
</Button>

// 2. User fills form and submits
<AddCourseModal
  open={showAddCourseModal}
  close={() => setShowAddCourseModal(false)}
  addNewCourse={addOrUpdateCourse}
/>

// 3. Form submission handler
const addOrUpdateCourse = async (newCourse: Course) => {
  if (!user) return;
  try {
    const newId = await addCourse(newCourse, user.uid);
    await loadCourses();  // Refresh
    toast.success("Course added!");
  } catch (error) {
    toast.error("Failed to add course");
  }
};

// 4. Firebase function call
export const addCourse = async (course: Course, userId: string) => {
  const addCourseFunction = httpsCallable(functions, "addCourse");
  const result = await addCourseFunction({ course });
  return (result.data as any).id;
};

// 5. Backend function (Cloud Function)
export const addCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const course = data.course;
  const courseRef = db.collection("courses").doc();
  await courseRef.set({
    ...course,
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { success: true, id: courseRef.id };
});
```

### 17.2 Calendar Event Rendering

```typescript
// Render events for a specific day
const renderDayEvents = (dayIndex: number) => {
  const dayEvents = calendarEvents.filter(event => {
    if (event.type === 'course') {
      return event.day === dayIndex;
    } else if (event.type === 'task') {
      const taskDate = new Date(event.date);
      return taskDate.getDay() === (dayIndex + 1) % 7;
    }
    return false;
  });
  
  return dayEvents.map(event => (
    <Box
      key={event.id}
      sx={{
        p: 1,
        mb: 0.5,
        borderRadius: 1,
        bgcolor: event.color,
        color: 'white',
        fontSize: '0.875rem',
      }}
    >
      {event.type === 'course' ? (
        <>
          <Typography variant="caption">{event.title}</Typography>
          <Typography variant="caption" display="block">
            {to12Hour(event.startTime)} - {to12Hour(event.endTime)}
          </Typography>
        </>
      ) : (
        <Typography variant="caption">{event.title}</Typography>
      )}
    </Box>
  ));
};
```

### 17.3 Theme Toggle Implementation

```typescript
// In SideNav component
const { mode, toggleTheme } = useThemeMode();

<Button
  onClick={toggleTheme}
  startIcon={mode === 'dark' ? <LightMode /> : <DarkMode />}
>
  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
</Button>

// Theme context updates
const toggleTheme = () => {
  setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light');
};
```

---

## 18. Troubleshooting Guide

### 18.1 Common Issues

**Issue: Courses not appearing in calendar**
- Check: `days` field format (should be "Monday, Wednesday, Friday")
- Check: Calendar parsing logic in `calendar/page.tsx`
- Check: Data is loaded before calendar renders

**Issue: Tasks not saving**
- Check: Firebase Functions deployed
- Check: User authentication
- Check: Firestore rules allow write
- Check: Network tab for errors

**Issue: Syllabus parsing fails**
- Check: ANTHROPIC_API_KEY is set
- Check: File format supported (PDF/DOCX/TXT)
- Check: File size (truncated at 50,000 chars)
- Check: API response format

**Issue: Theme not persisting**
- Check: localStorage available
- Check: ThemeProvider mounted
- Check: Browser allows localStorage

**Issue: Authentication not working**
- Check: Firebase config in `.env.local`
- Check: Auth domain matches Firebase project
- Check: Browser console for errors

### 18.2 Debug Checklist

1. ✅ Firebase config variables set
2. ✅ Firebase Functions deployed
3. ✅ Firestore rules deployed
4. ✅ ANTHROPIC_API_KEY set
5. ✅ User authenticated
6. ✅ Network requests successful
7. ✅ No console errors
8. ✅ Data structure matches types

---

## 19. Future Enhancements

### 19.1 Planned Features

- **Notifications**: Browser notifications for upcoming tasks
- **Export/Import**: Export calendar as iCal, import from other platforms
- **Collaboration**: Share courses/tasks with other users
- **Analytics**: Study time tracking and insights
- **Mobile App**: React Native version
- **Offline Support**: Service workers for offline access
- **Advanced Filtering**: Filter tasks by course, date range, importance
- **Recurring Tasks**: Automatically create recurring assignments
- **Grade Tracking**: Track assignment grades and calculate GPA
- **Study Groups**: Group study session scheduling

### 19.2 Technical Improvements

- **Real-time Updates**: Firestore listeners for live updates
- **Optimistic UI**: Update UI before server confirmation
- **Caching**: Implement React Query or SWR
- **Performance**: Code splitting, lazy loading
- **Testing**: Unit tests, integration tests
- **Accessibility**: ARIA labels, keyboard navigation
- **Internationalization**: Multi-language support

---

## Appendix A: File Size & Performance

### A.1 Bundle Analysis

- **Main Bundle**: ~500KB (gzipped)
- **Material-UI**: ~200KB
- **Firebase SDK**: ~150KB
- **Other Dependencies**: ~150KB

### A.2 Optimization Strategies

1. Code splitting by route
2. Lazy load heavy components
3. Tree shaking unused MUI components
4. Image optimization
5. Font optimization

---

## Appendix B: Security Considerations

### B.1 Current Security

- ✅ Firestore security rules
- ✅ Authentication required for data access
- ✅ User isolation (users can only access their data)
- ✅ Input validation on backend
- ✅ HTTPS only

### B.2 Recommendations

- Add rate limiting to API routes
- Implement CSRF protection
- Add input sanitization
- Regular security audits
- Monitor for suspicious activity

---

## Appendix C: API Reference

### C.1 Firebase Functions

**getCourses()**
- Input: None (uses auth context)
- Output: `{ success: true, data: Course[] }`

**addCourse(course: Course)**
- Input: `{ course: Course }`
- Output: `{ success: true, id: string }`

**updateCourse(course: Course)**
- Input: `{ course: Course }`
- Output: `{ success: true }`

**deleteCourse(courseId: string)**
- Input: `{ courseId: string }`
- Output: `{ success: true }`

**getTasks()**
- Input: None (uses auth context)
- Output: `{ success: true, data: Task[] }`

**addTask(task: TaskBase)**
- Input: `{ task: TaskBase }`
- Output: `{ success: true, id: string }`

**updateTask(task: TaskBase)**
- Input: `{ task: TaskBase }`
- Output: `{ success: true }`

**deleteTask(taskId: string)**
- Input: `{ taskId: string }`
- Output: `{ success: true }`

**toggleTaskComplete(taskId: string, completed: boolean)**
- Input: `{ taskId: string, completed: boolean }`
- Output: `{ success: true }`

---

## Conclusion

This documentation provides a comprehensive overview of the Easy Flow application architecture, features, and implementation details. For specific questions or clarifications, refer to the code comments or contact the development team.

**Last Updated:** December 2024  
**Document Version:** 1.0  
**Total Pages:** ~20

---

*End of Documentation*


