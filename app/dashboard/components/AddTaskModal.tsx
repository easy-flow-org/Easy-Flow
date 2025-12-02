"use client"

import React, { useEffect, useRef } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps, MenuItem } from "@mui/material";
import { Task } from "@/types/types";
import Link from "next/link";
import dummyContent from "@/lib/dummyContent";

type ModalProps = {
  open: boolean
  close: () => void
  addNewTask: (newTask: Task) => void
  initialTask?: Task | null
}

export default function AddTaskModal(props: ModalProps) {

  const titleRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (props.open) {
      const t = setTimeout(() => titleRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [props.open])

  function formatForInput(d?: Date | string) {
    if (!d) return ''
    const date = d instanceof Date ? d : new Date(d as any)
    // datetime-local expects YYYY-MM-DDTHH:MM
    return date.toISOString().slice(0, 16)
  }

  // handle submit
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const dueRaw = data.get('dueDate') as string | null
    const due = dueRaw ? new Date(dueRaw) : new Date()

    const newTask: Task = {
      id: props.initialTask?.id ?? crypto.randomUUID(),
      title: (data.get('title') as string) ?? '',
      notes: (data.get('notes') as string) ?? '',
      dueDate: due,
      importance: (data.get('importance') as Task['importance']) ?? 'Easy',
      completed: props.initialTask?.completed ?? false,
      onToggleComplete: (id: string) => { },
      onEdit: (id: string) => { },
      onDelete: (id: string) => { },
    }

    props.addNewTask(newTask)
    props.close()
  }

  const sharedProps: Partial<TextFieldProps> = {
    margin: "normal",
    variant: "outlined",
    color: "secondary",
    size: "small",
  }

  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>{props.initialTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent sx={{ width: '100%', maxWidth: 400 }}>
        <form id="add-task-form" onSubmit={handleSubmit}>
          <TextField
            inputRef={titleRef}
            autoFocus
            name="title"
            label="Title"
            required
            defaultValue={props.initialTask?.title ?? ''}
            {...sharedProps}
            sx={{ width: '100%', maxWidth: 320 }}
          />

          <TextField
            name="notes"
            label="Notes"
            multiline
            rows={4}
            defaultValue={props.initialTask?.notes ?? ''}
            {...sharedProps}
            sx={{ width: '100%', maxWidth: 320 }}
          />

          <TextField
            name="dueDate"
            label="Due Date"
            type="datetime-local"
            defaultValue={formatForInput(props.initialTask?.dueDate)}
            InputLabelProps={{ shrink: true }}
            {...sharedProps}
            sx={{ width: '100%', maxWidth: 320 }}
          />

          <TextField
            select
            name="importance"
            label="Importance"
            defaultValue={props.initialTask?.importance ?? 'Easy'}
            {...sharedProps}
            sx={{ width: '100%', maxWidth: 320 }}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="add-task-form" variant="contained" color="secondary" sx={{ textTransform: 'none' }}><Link href={"dashboard/tasks"} style={{ textDecoration: "none", color: "inherit" }}>Done</Link></Button>
        <Button onClick={props.close} variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}