import {
  collection,
  doc,
  getDoc,
  getDocs,
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
  const task = {
    userId,
    title: taskData.title || "",
    notes: taskData.notes || "",
    dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : Timestamp.now(),
    importance: taskData.importance || "Easy",
    completed: taskData.completed || false,
  }
  const docRef = await addDoc(tasksCollection, task)
  return { id: docRef.id, ...task }
}

export async function getUserTasks(userId: string) {
  const q = query(
    tasksCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  const taskRef = doc(tasksCollection, taskId)
  await updateDoc(taskRef, {
    ...data
  })
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(tasksCollection, taskId))
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