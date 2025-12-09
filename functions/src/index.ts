import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// Helper function to verify authentication
const verifyAuth = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }
  return context.auth.uid;
};

// ==================== COURSES FUNCTIONS ====================

interface Course {
  id?: string;
  title: string;
  description?: string;
  days: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

// Get all courses for the authenticated user
export const getCourses = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);

  try {
    const snapshot = await db
      .collection("courses")
      .where("userId", "==", userId)
      .get();

    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })).sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

    return { success: true, data: courses };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      "internal",
      "Error fetching courses",
      error.message
    );
  }
});

// Add a new course
export const addCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const course: Course = data.course;

  if (!course.title || !course.days || !course.startTime || !course.endTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required course fields"
    );
  }

  try {
    const courseData = {
      title: course.title,
      description: course.description || "",
      days: course.days,
      startTime: course.startTime,
      endTime: course.endTime,
      notes: course.notes || "",
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("courses").add(courseData);

    return { success: true, id: docRef.id };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      "internal",
      "Error adding course",
      error.message
    );
  }
});

// Update an existing course
export const updateCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const course: Course = data.course;

  if (!course.id) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Course ID is required"
    );
  }

  try {
    const courseRef = db.collection("courses").doc(course.id);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Course not found");
    }

    if (courseDoc.data()?.userId !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only update your own courses"
      );
    }

    await courseRef.update({
      title: course.title,
      description: course.description || "",
      days: course.days,
      startTime: course.startTime,
      endTime: course.endTime,
      notes: course.notes || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error updating course",
      error.message
    );
  }
});

// Delete a course
export const deleteCourse = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const { courseId } = data;

  if (!courseId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Course ID is required"
    );
  }

  try {
    const courseRef = db.collection("courses").doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Course not found");
    }

    if (courseDoc.data()?.userId !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only delete your own courses"
      );
    }

    await courseRef.delete();

    return { success: true };
  } catch (error: any) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error deleting course",
      error.message
    );
  }
});

// ==================== TASKS FUNCTIONS ====================

interface Task {
  id?: string;
  title: string;
  notes?: string;
  dueDate: any;
  importance: "Easy" | "Medium" | "Hard";
  completed: boolean;
}

// Get all tasks for the authenticated user
export const getTasks = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);

  try {
    const snapshot = await db
      .collection("tasks")
      .where("userId", "==", userId)
      .get();

    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        notes: data.notes || "",
        dueDate: data.dueDate?.toDate() || new Date(),
        importance: data.importance || "Easy",
        completed: data.completed || false,
      };
    }).sort((a: any, b: any) => {
      const dateA = a.dueDate instanceof Date ? a.dueDate.getTime() : 0;
      const dateB = b.dueDate instanceof Date ? b.dueDate.getTime() : 0;
      return dateA - dateB;
    });

    return { success: true, data: tasks };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      "internal",
      "Error fetching tasks",
      error.message
    );
  }
});

// Add a new task
export const addTask = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const task: Task = data.task;

  if (!task.title) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Task title is required"
    );
  }

  try {
    const dueDate = task.dueDate
      ? admin.firestore.Timestamp.fromDate(
          task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)
        )
      : admin.firestore.Timestamp.now();

    const taskData = {
      title: task.title,
      notes: task.notes || "",
      dueDate,
      importance: task.importance || "Easy",
      completed: task.completed || false,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("tasks").add(taskData);

    return { success: true, id: docRef.id };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      "internal",
      "Error adding task",
      error.message
    );
  }
});

// Update an existing task
export const updateTask = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const task: Task = data.task;

  if (!task.id) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Task ID is required"
    );
  }

  try {
    const taskRef = db.collection("tasks").doc(task.id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Task not found");
    }

    if (taskDoc.data()?.userId !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only update your own tasks"
      );
    }

    const dueDate = task.dueDate
      ? admin.firestore.Timestamp.fromDate(
          task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)
        )
      : taskDoc.data()?.dueDate;

    await taskRef.update({
      title: task.title,
      notes: task.notes || "",
      dueDate,
      importance: task.importance,
      completed: task.completed,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error updating task",
      error.message
    );
  }
});

// Delete a task
export const deleteTask = functions.https.onCall(async (data, context) => {
  const userId = verifyAuth(context);
  const { taskId } = data;

  if (!taskId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Task ID is required"
    );
  }

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Task not found");
    }

    if (taskDoc.data()?.userId !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only delete your own tasks"
      );
    }

    await taskRef.delete();

    return { success: true };
  } catch (error: any) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error deleting task",
      error.message
    );
  }
});

// Toggle task completion
export const toggleTaskComplete = functions.https.onCall(
  async (data, context) => {
    const userId = verifyAuth(context);
    const { taskId, completed } = data;

    if (!taskId || typeof completed !== "boolean") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Task ID and completed status are required"
      );
    }

    try {
      const taskRef = db.collection("tasks").doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Task not found");
      }

      if (taskDoc.data()?.userId !== userId) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "You can only update your own tasks"
        );
      }

      await taskRef.update({
        completed,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "Error toggling task completion",
        error.message
      );
    }
  }
);

// ==================== POMODORO FUNCTIONS ====================

// Record a pomodoro session
export const recordPomodoroSession = functions.https.onCall(
  async (data, context) => {
    const userId = verifyAuth(context);
    const { mode, duration, completed } = data;

    if (!mode || typeof duration !== "number" || typeof completed !== "boolean") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Mode, duration, and completed status are required"
      );
    }

    try {
      const sessionData = {
        userId,
        mode,
        duration,
        completed,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection("pomodoroSessions").add(sessionData);

      return { success: true, id: docRef.id };
    } catch (error: any) {
      throw new functions.https.HttpsError(
        "internal",
        "Error recording pomodoro session",
        error.message
      );
    }
  }
);

// Get all pomodoro sessions for the authenticated user
export const getPomodoroSessions = functions.https.onCall(
  async (data, context) => {
    const userId = verifyAuth(context);

    try {
      const snapshot = await db
        .collection("pomodoroSessions")
        .where("userId", "==", userId)
        .get();

      const sessions = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          mode: data.mode,
          duration: data.duration,
          completed: data.completed,
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      }).sort((a: any, b: any) => (b.timestamp?.getTime?.() || 0) - (a.timestamp?.getTime?.() || 0));

      return { success: true, data: sessions };
    } catch (error: any) {
      throw new functions.https.HttpsError(
        "internal",
        "Error fetching pomodoro sessions",
        error.message
      );
    }
  }
);

// Get completed pomodoros count
export const getCompletedPomodoros = functions.https.onCall(
  async (data, context) => {
    const userId = verifyAuth(context);

    try {
      const snapshot = await db
        .collection("pomodoroSessions")
        .where("userId", "==", userId)
        .where("mode", "==", "work")
        .where("completed", "==", true)
        .get();

      return { success: true, count: snapshot.size };
    } catch (error: any) {
      throw new functions.https.HttpsError(
        "internal",
        "Error getting completed pomodoros",
        error.message
      );
    }
  }
);

