"use client"

import { useContext, useEffect, useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Checkbox,
} from "@mui/material"
import { Edit, Delete } from "@mui/icons-material"
import { Task } from "@/types/types"
import AddTaskModal from "../components/AddTaskModal"
import dummyContent from "@/lib/dummyContent"
import { getTasks, getUserTasks, createTask, deleteTask, updateTask } from "@/firebase/firestore"
import { useAuth } from "@/app/context/authContext"

function formatDueDate(d?: Date | string) {
  if (!d) return "No due date"
  const date = d instanceof Date ? d : new Date(d as any)
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function TasksPage() {
  // local tasks state (single source for this page)
  const [tasks, setTasks] = useState<Task[]>([])
  const { user } = useAuth();

  //
  const updateTasks = async (uid: string) => {
    //setTasks(await getUserTasks(user.uid))
  }

  useEffect(() => {
    console.log(!user);
    if (!user) return;
    (async () => {
      const tasks = await getUserTasks(user.uid);
      setTasks(tasks);
    })();
  }, [user])


  // modal state
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const openNew = () => {
    setEditingTask(null)
    setShowModal(true)
  }

  const openEdit = (t: Task) => {
    setEditingTask(t)
    setShowModal(true)
  }

  const closeModal = () => {
    setEditingTask(null)
    setShowModal(false)
  }

  const addOrUpdateTask = async (task: Task) => {
    const exists = tasks.find(t => t.id === task.id);

    if (!exists) {
      // Create in Firestore first
      if (!user) {
        console.log("user doesn't exist");
        return;
      };
      const created = await createTask(user.uid, task); // returns { id, ... }

      const hydrated: Task = {
        ...created,
        dueDate: created.dueDate.toDate(),
        onToggleComplete: task.onToggleComplete,
        onEdit: task.onEdit,
        onDelete: task.onDelete,
      };

      // Now update state with real Firestore ID
      setTasks(prev => [hydrated, ...prev]);
      return;
    }

    // If exists, update Firestore + state
    await updateTask(task.id, task);

    setTasks(prev =>
      prev.map(p => p.id === task.id ? task : p)
    );
  }

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    deleteTask(id)
  }

  const importanceColor = (importance: Task["importance"]) => {
    switch (importance) {
      case "Hard":
        return "error"
      case "Medium":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Tasks</Typography>
        <Button variant="contained" color="secondary" onClick={openNew}>New Task</Button>
      </Stack>

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Paper key={task.id} variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", minWidth: 0 }}>
              <Checkbox color="secondary" checked={task.completed} onChange={() => toggleComplete(task.id)} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{task.notes || "No notes"}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: .5 }}>Due: {formatDueDate(task.dueDate)}</Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={task.importance} size="small" color={importanceColor(task.importance)} />
              <IconButton size="small" onClick={() => openEdit(task)} aria-label="edit">
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => removeTask(task.id)} aria-label="delete">
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <AddTaskModal open={showModal} close={closeModal} addNewTask={addOrUpdateTask} initialTask={editingTask} />
    </Box>
  )
}