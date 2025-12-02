"use client"

import React, { useState } from "react"
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
import dummyContent from "@/lib/dummyContent"
import { Task } from "@/types/types"

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
  // Keep a local copy of tasks so the UI is interactive
  const [tasks, setTasks] = useState<Task[]>(() => [...(dummyContent.tasks ?? [])])

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const editTask = (id: string) => {
    const t = tasks.find((x) => x.id === id)
    if (!t) return
    const title = window.prompt("Edit task title", t.title)
    if (title == null) return
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, title } : x)))
  }

  // FIX this using Add Task Modal (need to make the modal)
  const addTask = () => {
    const title = window.prompt("New task title")
    if (!title) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      notes: "",
      dueDate: new Date(),
      importance: "Easy",
      completed: false,
      onToggleComplete: () => {},
      onEdit: () => {},
      onDelete: () => {},
    }
    setTasks((prev) => [newTask, ...prev])
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
        <Button variant="contained" color="secondary" onClick={addTask}>New Task</Button>
      </Stack>

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Paper key={task.id} variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", minWidth: 0 }}>
              <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{task.notes || "No notes"}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: .5 }}>Due: {formatDueDate(task.dueDate)}</Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={task.importance} size="small" color={importanceColor(task.importance)} />
              <IconButton size="small" onClick={() => editTask(task.id)} aria-label="edit">
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => removeTask(task.id)} aria-label="delete">
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}