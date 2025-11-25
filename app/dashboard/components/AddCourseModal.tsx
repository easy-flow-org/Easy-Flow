"use client"

import React, { useEffect, useRef } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps } from "@mui/material";
import CourseDaySelector from "./CourseDaySelector";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type ModalProps = {
  open: boolean
  close?: () => void
}

export default function AddCourseModal(props: ModalProps) {

  // This is for when the user submits the form
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const json = Object.fromEntries((data as any).entries());
    console.log(json)
    props.close?.()
  }
  //

  // This is for hover effect when opening modal
  const firstRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (props.open) {
      // Focus after mount/transition; a small timeout ensures the Dialog transition finished.
      const t = setTimeout(() => firstRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [props.open])
  //

  // This is for convienience
  const sharedProps: Partial<TextFieldProps> = {
    margin: "normal",
    variant: "outlined",
    color: "secondary",
    size: "small",
  }
  //

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={props.open} onClose={props.close}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent sx={{ width: "100%", maxWidth: "400px" }}>
          {/* This is the actual modal form */}
          <form onSubmit={handleSubmit} action="#" id="add-course-form">
            <TextField
              inputRef={firstRef}
              autoFocus
              id="course-name"
              name="courseName"
              label="Course Name"
              type="text"
              required
              {...sharedProps}
              sx={{ width: "100%", maxWidth: "320px" }}
            />
            <CourseDaySelector></CourseDaySelector>
            <TextField
              id="course-start-time"
              name="startTime"
              label="Start Time"
              type="time"
              required
              {...sharedProps}
            />
            <TextField
              id="course-end-time"
              name="endTime"
              label="End Time"
              type="time"
              required
              {...sharedProps}
              sx={{ ml: 2 }}
            />
            <TextField
              id="course-description"
              name="courseDescription"
              label="Course Description"
              type="text"
              {...sharedProps}
              multiline
              rows={4}
              sx={{ width: "100%", maxWidth: "320px" }} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="add-course-form" variant="contained" color="secondary" sx={{ textTransform: "none" }}>Done</Button>
          <Button onClick={props.close} variant="outlined" color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}