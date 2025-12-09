import { getFunctions, httpsCallable } from "firebase/functions";
import { Course } from "@/types/types";

// Initialize Firebase Functions
const functions = getFunctions();

// Get all courses for a user
export const getCourses = async (userId: string): Promise<Course[]> => {
  try {
    const getCoursesFunction = httpsCallable(functions, "getCourses");
    const result = await getCoursesFunction();
    
    if (result.data && (result.data as any).success) {
      const courses = (result.data as any).data.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        days: doc.days,
        startTime: doc.startTime,
        endTime: doc.endTime,
      }));
      return courses;
    }
    throw new Error("Failed to get courses");
  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

// Add a new course
export const addCourse = async (course: Course, userId: string): Promise<string> => {
  try {
    const addCourseFunction = httpsCallable(functions, "addCourse");
    const result = await addCourseFunction({ course });
    
    if (result.data && (result.data as any).success) {
      return (result.data as any).id;
    }
    throw new Error("Failed to add course");
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (course: Course, userId: string): Promise<void> => {
  try {
    const updateCourseFunction = httpsCallable(functions, "updateCourse");
    const result = await updateCourseFunction({ course });
    
    if (result.data && (result.data as any).success) {
      return;
    }
    throw new Error("Failed to update course");
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    const deleteCourseFunction = httpsCallable(functions, "deleteCourse");
    const result = await deleteCourseFunction({ courseId });
    
    if (result.data && (result.data as any).success) {
      return;
    }
    throw new Error("Failed to delete course");
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

