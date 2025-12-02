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

export async function createTask(taskData: Partial<Task>) {
  const task = {
    title: taskData.title || "",
    notes: taskData.notes || "",
    dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : Timestamp.now(),
    importance: taskData.importance || "Easy",
    completed: taskData.completed || false,
  }
  const docRef = await addDoc(tasksCollection, task)
  return { id: docRef.id, ...task }
}

export async function getUserTodos(userId: string) {
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

export async function getTasks(): Promise<Task[]> {
  const q = query(
    tasksCollection
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id, ...doc.data()
  } as Task))
}