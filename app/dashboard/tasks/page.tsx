"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Checkbox,
  CircularProgress,
} from "@mui/material"
import { Edit, Delete } from "@mui/icons-material"
import { Task } from "@/types/types"
import AddTaskModal from "../components/AddTaskModal"
import { useAuth } from "@/app/context/authContext"
import { getTasks, addTask, updateTask, deleteTask, toggleTaskComplete } from "@/lib/firebase/tasks"

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
  const { user } = useAuth()
  // local tasks state (single source for this page)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // modal state
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Load tasks from Firebase
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const loadTasks = async () => {
    if (!user) return
    try {
      setLoading(true)
      const fetchedTasks = await getTasks(user.uid)
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

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
    if (!user) return
    try {
      const isUpdate = tasks.some((t) => t.id === task.id)
      if (isUpdate) {
        await updateTask(task, user.uid)
      } else {
        const newId = await addTask(task, user.uid)
        task.id = newId
      }
      // Reload tasks to get the latest data
      await loadTasks()
      closeModal()
    } catch (error) {
      console.error("Error saving task:", error)
      alert("Failed to save task. Please try again.")
    }
  }

  const toggleComplete = async (id: string) => {
    if (!user) return
    try {
      const task = tasks.find((t) => t.id === id)
      if (task) {
        await toggleTaskComplete(id, !task.completed)
        await loadTasks()
      }
    } catch (error) {
      console.error("Error toggling task completion:", error)
      alert("Failed to update task. Please try again.")
    }
  }

  const removeTask = async (id: string) => {
    if (!user) return
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      await deleteTask(id)
      await loadTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
      alert("Failed to delete task. Please try again.")
    }
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Please log in to view your tasks.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Tasks</Typography>
        <Button variant="contained" color="secondary" onClick={openNew}>New Task</Button>
      </Stack>

      {tasks.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No tasks yet. Create your first task!
          </Typography>
        </Paper>
      ) : (
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
      )}
      <AddTaskModal open={showModal} close={closeModal} addNewTask={addOrUpdateTask} initialTask={editingTask} />
    </Box>
  )
}