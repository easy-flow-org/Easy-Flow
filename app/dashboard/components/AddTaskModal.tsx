"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps, MenuItem, useMediaQuery } from "@mui/material";
import { Task, TaskBase } from "@/types/types";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type ModalProps = {
  open: boolean
  close: () => void
  addNewTask: (newTask: TaskBase) => void
  initialTask?: Task | null
}

export default function AddTaskModal(props: ModalProps) {
  const isMobile = useMediaQuery('(min-width:600px)');

  // use a small-screen query so we can render Mobile vs Desktop pickers correctly
  const isSmallScreen = useMediaQuery('(max-width:600px)')

  // controlled due date state so picker + hidden input stay in sync
  const [due, setDue] = useState<Date | null>(() => {
    if (props.initialTask?.dueDate) return new Date(props.initialTask.dueDate)
    return null
  })

  // For autofocus of form
  const titleRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (props.open) {
      const t = setTimeout(() => titleRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [props.open])
  //

  function formatForInput(d?: Date | string) {
    // Use local date/time parts to produce a string suitable for
    // <input type="datetime-local" value="YYYY-MM-DDTHH:MM">.
    if (!d) return ''
    const date = d instanceof Date ? d : new Date(d as any)
    const pad = (n: number) => String(n).padStart(2, '0')
    const Y = date.getFullYear()
    const M = pad(date.getMonth() + 1)
    const D = pad(date.getDate())
    const H = pad(date.getHours())
    const m = pad(date.getMinutes())
    return `${Y}-${M}-${D}T${H}:${m}`
  }

  function getDatePart(d?: Date | string) {
    if (!d) return ''
    const date = d instanceof Date ? d : new Date(d as any)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }

  function getTimePart(d?: Date | string) {
    if (!d) return ''
    const date = d instanceof Date ? d : new Date(d as any)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  // handle submit
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const dueRaw = data.get('dueDate') as string | null
    const due = dueRaw ? new Date(dueRaw) : new Date()

    const newTask: TaskBase = {
      id: props.initialTask?.id ?? crypto.randomUUID(),
      title: (data.get('title') as string) ?? '',
      notes: (data.get('notes') as string) ?? '',
      dueDate: due,
      importance: (data.get('importance') as TaskBase['importance']) ?? 'Easy',
      completed: props.initialTask?.completed ?? false,
    }

    props.addNewTask(newTask)
    props.close()
  }

  const sharedProps: Partial<TextFieldProps> = {
    variant: "outlined",
    color: "secondary",
    size: "small",
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              sx={{ width: '100%', maxWidth: 320, mt: 1, mb: 2 }}
            />
            <TextField
              name="notes"
              label="Notes"
              multiline
              rows={4}
              defaultValue={props.initialTask?.notes ?? ''}
              {...sharedProps}
              sx={{ width: '100%', maxWidth: 320, mb: 2 }}
            />
            {/* Date input handling: on small screens render separate native date + time
                controls (better mobile UX), on larger screens use a single
                datetime-local input. A hidden `dueDate` input formatted as
                YYYY-MM-DDTHH:MM keeps FormData consistent for handleSubmit. */}
            {isSmallScreen ? (
              <>
                <TextField
                  label="Due Date"
                  type="date"
                  name="dueDate_date"
                  defaultValue={due ? getDatePart(due) : ''}
                  {...sharedProps}
                  sx={{ width: '100%', maxWidth: 320, mb: 1 }}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    // combine date + existing time (or 00:00) into `due`
                    const date = e.target.value
                    const time = getTimePart(due ?? undefined) || '00:00'
                    setDue(date ? new Date(`${date}T${time}`) : null)
                  }}
                />
                <TextField
                  label="Due Time"
                  type="time"
                  name="dueDate_time"
                  defaultValue={due ? getTimePart(due) : ''}
                  {...sharedProps}
                  sx={{ width: '100%', maxWidth: 320, mb: 2 }}
                  onChange={(e) => {
                    const time = e.target.value
                    const date = getDatePart(due ?? undefined) || new Date()
                    const dateStr = typeof date === 'string' ? date : new Date().toISOString().slice(0,10)
                    setDue(time ? new Date(`${dateStr}T${time}`) : null)
                  }}
                />
              </>
            ) : (
              <TextField
                label="Due Date & Time"
                type="datetime-local"
                name="dueDatePicker"
                defaultValue={due ? formatForInput(due) : ''}
                {...sharedProps}
                sx={{ width: '100%', maxWidth: 320, mb: 2 }}
                onChange={(e) => setDue(e.target.value ? new Date(e.target.value) : null)}
              />
            )}

            {/* Hidden input for FormData (datetime-local format) */}
            <input type="hidden" name="dueDate" value={formatForInput(due ?? undefined)} />
            <TextField
              select
              name="importance"
              label="Importance"
              defaultValue={props.initialTask?.importance ?? 'Easy'}
              {...sharedProps}
              sx={{ width: '100%', maxWidth: 320, mb: 2 }}
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="add-task-form" variant="contained" color="secondary" sx={{ textTransform: 'none' }}>Done</Button>
          <Button onClick={props.close} variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}