# User Flow & Feature Map

## Complete User Journey

### 1. **Landing Page** (Public)
```
User visits site → /
   ↓
See landing page with features
   ↓
Click "Get Started" or "Sign In"
```

### 2. **Authentication Flow**

#### Option A: Email Registration
```
/register
   ↓
Enter: Email, Password
   ↓
Click "Sign Up"
   ↓
Firebase creates account
   ↓
User logged in
   ↓
Redirect to /dashboard
```

#### Option B: Google Sign-In
```
Click "Sign in with Google"
   ↓
Google auth popup
   ↓
User grants permission
   ↓
Account created/linked
   ↓
Redirect to /dashboard
```

#### Option C: Email Login
```
/login
   ↓
Enter: Email, Password
   ↓
Click "Sign In"
   ↓
Firebase verifies
   ↓
User logged in
   ↓
Redirect to /dashboard
```

### 3. **Dashboard Flow**

```
/dashboard (Main Hub)
├── Left Panel: Courses List
│   ├── Quick view of all courses
│   └── Click to see course details
│
├── Center Panel: Overview
│   ├── Focus Chart (productivity stats)
│   ├── Start Focus Mode button
│   └── Upcoming items preview
│
└── Right Panel: Tasks & Actions
    ├── 3 upcoming tasks
    ├── Quick Actions
    │   ├── New Task
    │   ├── New Course
    │   └── Edit
    └── Links to other pages
```

### 4. **Adding a Course**

```
Dashboard → "New Course" button
   ↓
Modal opens
   ↓
Fill in:
  - Course Name
  - Days (checkboxes)
  - Start Time
  - End Time
   ↓
Click "Add Course"
   ↓
addCourse() Firebase Function
   ↓
Course added to Firestore
   ↓
Dashboard refreshes
   ↓
Course appears in list ✓
```

### 5. **Adding a Task**

```
Dashboard → "New Task" button
   ↓
Modal opens
   ↓
Fill in:
  - Task Title
  - Due Date
  - Importance (Easy/Medium/Hard)
  - Notes (optional)
   ↓
Click "Add Task"
   ↓
addTask() Firebase Function
   ↓
Task added to Firestore
   ↓
Dashboard refreshes
   ↓
Task appears in upcoming ✓
```

### 6. **Calendar View**

```
/dashboard/calendar
   ↓
Visual month calendar
   ↓
Each day shows:
  - Badge with count of items
  - Color indicator
   ↓
Click on day
   ↓
Right panel shows all activities for that day
   ↓
Activities = Courses + Tasks for that date
```

### 7. **Activities Timeline**

```
/dashboard/activities
   ↓
List of ALL activities
   ↓
Activities = Courses + Tasks + Pomodoro Sessions
   ↓
Each activity shows:
  - Title
  - Type (icon + label)
  - Status (if applicable)
  - Date/Time
   ↓
Features:
  - Filter by type
  - Search by keyword
  - Sort by date (newest first)
```

### 8. **Focus Mode (Pomodoro)**

```
/dashboard/focus-mode
   ↓
Timer UI
   ↓
Click "Start Work Session"
   ↓
Timer counts down (25 min)
   ↓
When done:
  - Popup notification
  - Option to log session
   ↓
recordPomodoroSession() Function
   ↓
Session recorded to Firestore
   ↓
Can view stats in dashboard
```

---

## Feature Map

### 📊 DASHBOARD PAGE
**URL:** `/dashboard`
**Purpose:** Central hub showing all user data at a glance
**Features:**
- Course list (left)
- Focus chart (center)
- Upcoming tasks (right)
- Quick action buttons
- Real-time data sync

### 📚 COURSES PAGE
**URL:** `/dashboard/courses`
**Purpose:** Manage all courses
**Features:**
- List all courses
- Add new course
- Edit course
- Delete course
- View course schedule
- Filter/search

### ✓ TASKS PAGE
**URL:** `/dashboard/tasks` (implied)
**Purpose:** Manage all tasks
**Features:**
- List all tasks
- Add new task
- Edit task
- Delete task
- Toggle completion
- Filter by:
  - Importance
  - Completion status
  - Due date

### 📅 CALENDAR PAGE
**URL:** `/dashboard/calendar`
**Purpose:** Visual view of activities by date
**Features:**
- Month view
- Badge shows item count per day
- Click to see details
- Activity list shows:
  - Title
  - Type
  - Time
  - Details

### 📋 ACTIVITIES PAGE
**URL:** `/dashboard/activities`
**Purpose:** Timeline of all activities
**Features:**
- All items in chronological order
- Filter options (type, status)
- Search by keyword
- Activity icons and colors
- Detailed metadata

### 🍅 FOCUS MODE PAGE
**URL:** `/dashboard/focus-mode`
**Purpose:** Pomodoro timer for productivity
**Features:**
- Timer display
- Work session (25 min)
- Short break (5 min)
- Long break (15 min)
- Session history
- Stats/charts
- Log sessions

### 🔐 LOGIN PAGE
**URL:** `/login`
**Purpose:** User authentication
**Features:**
- Email + password login
- Google Sign-in button
- Error messages
- Loading states
- Link to register

### ✍️ REGISTER PAGE
**URL:** `/register`
**Purpose:** New user signup
**Features:**
- Email input
- Password input
- Password confirmation
- Terms acceptance
- Error validation
- Link to login

---

## Data Flow Diagram

```
USER ACTIONS (Frontend)
        ↓
    React Component
        ↓
    Firebase Wrapper (lib/firebase/*)
        ↓
    Firebase Functions (Backend Logic)
        ↓
    Firebase Authentication (User Verification)
        ↓
    Firestore Database (Data Storage)
        ↓
    Firestore Rules (Security Check)
        ↓
    Document Update ✓ or Error ✗
        ↓
    Return to Frontend
        ↓
    Update Component State
        ↓
    UI Reflects Changes
```

---

## User Roles & Permissions

### Unauthenticated Users
- Can view: Landing page
- Cannot: Access dashboard, see any data
- Redirect to: `/login`

### Authenticated Users
- Can: See only their own data
- Can: Create courses, tasks, sessions
- Can: Edit their own items
- Can: Delete their own items
- Cannot: See other users' data
- Cannot: Modify other users' items

### Admin/Future
- (Not implemented yet)
- Could manage: User accounts, system settings
- Could view: Global analytics

---

## Component Hierarchy

```
app/
├── page.tsx (Landing Page)
├── login/page.tsx
├── register/page.tsx
└── dashboard/
    ├── layout.tsx (Dashboard Layout)
    ├── page.tsx (Main Dashboard)
    ├── calendar/page.tsx (Calendar)
    ├── activities/page.tsx (Activities)
    ├── courses/page.tsx (Courses List)
    ├── focus-mode/page.tsx (Focus Timer)
    └── components/
        ├── AddCourseModal.tsx
        ├── AddTaskModal.tsx
        ├── CourseCard.tsx
        ├── FocusChart.tsx
        ├── SideNav.tsx
        ├── NavButton.tsx
        └── ... other components
```

---

## State Management

### AuthContext
- **Purpose:** Global auth state
- **Provides:**
  - `user` - Current user object
  - `loading` - Auth loading state
  - `login()` - Login function
  - `signup()` - Register function
  - `logout()` - Logout function
  - `googleSignIn()` - Google auth
- **Used in:** All pages that need user data

### Component Local State
- **Dashboard:** courses, tasks, loading states
- **Calendar:** current date, selected date activities
- **Activities:** all activities, filters, search term

---

## Data Synchronization

### Auto-Load on User Login
```
User logs in
   ↓
useEffect triggers (user dependency)
   ↓
loadCourses() → getCourses() → Firebase Function
loadTasks() → getTasks() → Firebase Function
loadPomodoroSessions() → getPomodoroSessions() → Firebase Function
   ↓
Data displayed in Dashboard
```

### Manual Refresh
```
User adds item
   ↓
Modal closes
   ↓
loadCourses() / loadTasks() called
   ↓
New data fetched from Firestore
   ↓
Component state updated
   ↓
UI refreshes immediately
```

### Real-Time (Future Enhancement)
```
Could use onSnapshot() for real-time updates
User 1 adds course
   ↓
All users with onSnapshot() listener see update instantly
(Not currently implemented)
```

---

## Error Handling Flow

```
User performs action
   ↓
Try/Catch block
   ↓
If Success: Update state, show toast
   ↓
If Error:
  ├── Log to console
  ├── Show error toast to user
  ├── Revert optimistic updates (if any)
  └── Keep UI functional
```

### Common Error Messages
- "User must be authenticated" → Redirect to login
- "Permission denied" → Check data ownership
- "Failed to load [items]" → Retry or check network
- "[Item] not found" → Item was deleted

---

## Performance Considerations

### Current Setup
- Data loaded on route/user change
- State cached in component
- Each action triggers manual refresh
- No real-time listeners

### Future Optimizations
- Implement Redux or Zustand for global state
- Use `onSnapshot()` for real-time updates
- Add pagination for large lists
- Implement local caching
- Add service worker for offline support

---

## Security Flow

```
User enters credentials
   ↓
Frontend validates format
   ↓
Send to Firebase Auth
   ↓
Firebase verifies email/password or Google token
   ↓
If valid: Return auth token
   ↓
Token sent with all Firebase Function calls
   ↓
Backend Function verifies token
   ↓
If valid: Get userId from token
   ↓
Query Firestore with userId filter
   ↓
Firestore Rules check: userId === document.userId
   ↓
If valid: Return data
   ↓
If invalid: Return error
```

---

## Testing Checklist

### Functional Tests
- [ ] Can register new account
- [ ] Can login with email
- [ ] Can login with Google
- [ ] Can add course
- [ ] Can add task
- [ ] Can edit items
- [ ] Can delete items
- [ ] Can toggle task completion
- [ ] Can record pomodoro session

### Page Tests
- [ ] Dashboard loads data
- [ ] Calendar displays correctly
- [ ] Activities timeline works
- [ ] Courses page functional
- [ ] Focus mode works

### Cross-Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Devices
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

---

## Quick Reference

| Action | Function | Collection | Page |
|--------|----------|-----------|------|
| Add Course | `addCourse()` | courses | Dashboard |
| View Courses | `getCourses()` | courses | Dashboard, Calendar |
| Edit Course | `updateCourse()` | courses | Dashboard |
| Delete Course | `deleteCourse()` | courses | Dashboard |
| Add Task | `addTask()` | tasks | Dashboard |
| View Tasks | `getTasks()` | tasks | Dashboard, Calendar, Activities |
| Edit Task | `updateTask()` | tasks | Dashboard |
| Delete Task | `deleteTask()` | tasks | Dashboard |
| Mark Complete | `toggleTaskComplete()` | tasks | Dashboard, Activities |
| Record Session | `recordPomodoroSession()` | sessions | Focus Mode |
| View Sessions | `getPomodoroSessions()` | sessions | Dashboard, Activities |

---

## Next Feature Ideas

### Short Term
- [ ] Edit profile picture
- [ ] Change password
- [ ] Email notifications
- [ ] Task reminders

### Medium Term
- [ ] Notes/Journal entries
- [ ] File attachments
- [ ] Recurring tasks
- [ ] Course materials storage
- [ ] Grade tracking

### Long Term
- [ ] Share courses with friends
- [ ] Leaderboards
- [ ] Study groups
- [ ] Mobile app
- [ ] Offline support
- [ ] Social features

