"use client"

import React, { useEffect, useRef } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps } from "@mui/material";

type ModalProps = {
  open: boolean
  close?: () => void
}

export default function AddCourseModal(props: ModalProps) {
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    console.log({
      courseName: data.get("courseName"),
      testName: data.get("testName"),
    })
    props.close?.()
  }

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
  const sharedProps:  Partial<TextFieldProps> = {
    margin: "normal",
    variant: "outlined",
    color: "secondary",
    size: "small",
  }
  //

  return (
    <>
      <Dialog open={props.open} onClose={props.close}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} action="#" id="add-course-form" >
            <TextField
              inputRef={firstRef}
              autoFocus
              id="course-name"
              name="courseName"
              label="Course Name"
              type="text"
              required
              fullWidth
              {...sharedProps}
            />
            <TextField
              id="test-name"
              name="testName"
              label="Test Name"
              type="text"
              required
              fullWidth
              {...sharedProps}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="add-course-form" variant="contained" color="secondary" sx={{ textTransform: "none" }}>Done</Button>
          <Button onClick={props.close} variant="outlined" color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}