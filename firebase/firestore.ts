import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import type { Course, Task } from '@/types/types'

export const tasksCollection = collection(db, 'tasks');

export const timestampToDate = (timestamp: Timestamp) => timestamp.toDate();

export async function createTask(userId: string, taskData: Partial<Task>) {
  const docRef = doc(tasksCollection);
  const task = {
    userId,
    id: docRef.id,
    title: taskData.title || "",
    notes: taskData.notes || "",
    dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : Timestamp.now(),
    importance: taskData.importance || "Easy",
    completed: taskData.completed || false,
  }
  await setDoc(docRef, task)
  return task;
}

export async function getUserTasks(userId: string) {
  const q = query(
    tasksCollection,
    where('userId', '==', userId),
    //orderBy('title', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  const taskRef = doc(tasksCollection, taskId)
  await updateDoc(taskRef, {                          
    id: taskId,
    title: taskData.title || "",
    notes: taskData.notes || "",
    dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : Timestamp.now(),
    importance: taskData.importance || "Easy",
    completed: taskData.completed || false,
  })
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(tasksCollection, taskId))
  console.log(`delete of ${taskId} successful`);
}

export async function getTasks(): Promise<Task[]> { 
  const q = query(
    tasksCollection
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id, ...doc.data()
  } as Task))
}