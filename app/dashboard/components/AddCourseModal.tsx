"use client"

import React, { useEffect, useRef } from "react"
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps } from "@mui/material";
import CourseDaySelector from "./CourseDaySelector";

type ModalProps = {
  open: boolean
  close?: () => void
}

export default function AddCourseModal(props: ModalProps) {
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const json = Object.fromEntries((data as any).entries());
    console.log(json)
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
        <DialogContent  sx={{width:"100%", maxWidth:"400px"}}>
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
              sx={{width: "100%", maxWidth:"320px"}}
            />
            <CourseDaySelector></CourseDaySelector>
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