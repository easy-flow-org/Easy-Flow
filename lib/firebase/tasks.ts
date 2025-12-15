import { getFunctions, httpsCallable } from "firebase/functions";
import { Task, TaskBase } from "@/types/types";

// Initialize Firebase Functions
const functions = getFunctions();

// Get all tasks for a user
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const getTasksFunction = httpsCallable(functions, "getTasks");
    const result = await getTasksFunction();
    
    if (result.data && (result.data as any).success) {
      const tasks = (result.data as any).data.map((task: any) => ({
        id: task.id,
        title: task.title,
        notes: task.notes || "",
        dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
        importance: task.importance || "Easy",
        completed: task.completed || false,
        onToggleComplete: () => {},
        onEdit: () => {},
        onDelete: () => {},
      }));
      return tasks;
    }
    throw new Error("Failed to get tasks");
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw error;
  }
};

// Add a new task
export const addTask = async (task: TaskBase, userId: string): Promise<string> => {
  try {
    const addTaskFunction = httpsCallable(functions, "addTask");
    const result = await addTaskFunction({ task });
    
    if (result.data && (result.data as any).success) {
      return (result.data as any).id;
    }
    throw new Error("Failed to add task");
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (task: TaskBase, userId: string): Promise<void> => {
  try {
    const updateTaskFunction = httpsCallable(functions, "updateTask");
    const result = await updateTaskFunction({ task });
    
    if (result.data && (result.data as any).success) {
      return;
    }
    throw new Error("Failed to update task");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const deleteTaskFunction = httpsCallable(functions, "deleteTask");
    const result = await deleteTaskFunction({ taskId });
    
    if (result.data && (result.data as any).success) {
      return;
    }
    throw new Error("Failed to delete task");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Toggle task completion status
export const toggleTaskComplete = async (taskId: string, completed: boolean): Promise<void> => {
  try {
    const toggleTaskCompleteFunction = httpsCallable(functions, "toggleTaskComplete");
    const result = await toggleTaskCompleteFunction({ taskId, completed });
    
    if (result.data && (result.data as any).success) {
      return;
    }
    throw new Error("Failed to toggle task completion");
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

