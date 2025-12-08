"use client"

import { useState } from "react"
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

function formatDueDate(d?: Date | string, time?: string) {
  if (!d && !time) return "No due date"
  let date: Date | null = null
  if (d) date = d instanceof Date ? d : new Date(d as any)
  if (time) {
    // Build a local YYYY-MM-DD from the date (or today) using local parts
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = date
      ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
      : new Date().toISOString().slice(0, 10)
    date = new Date(`${dateStr}T${time}`)
  }
  if (!date) return "No due date"
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function TasksPage() {
  // local tasks state (single source for this page)
  const [tasks, setTasks] = useState<Task[]>([...(dummyContent.tasks ?? [])])

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

  const addOrUpdateTask = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.find((p) => p.id === task.id)
      if (exists) return prev.map((p) => (p.id === task.id ? task : p))
      return [task, ...prev]
    })
  }

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
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
        <Button variant="contained" color="secondary" onClick={openNew} sx={{ textTransform: "none" }}>New Task</Button>
      </Stack>

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Paper key={task.id} variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", minWidth: 0 }}>
              <Checkbox color="secondary" checked={task.completed} onChange={() => toggleComplete(task.id)} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{task.notes || "No notes"}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: .5 }}>Due: {formatDueDate(task.dueDate, task.dueTime)}</Typography>
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