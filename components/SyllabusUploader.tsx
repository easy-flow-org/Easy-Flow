"use client"

import React, { useState, useCallback } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  alpha,
  useTheme,
} from "@mui/material"
import { useDropzone } from "react-dropzone"
import { CloudUpload, CheckCircle, Error as ErrorIcon } from "@mui/icons-material"
import { ParsedCourseData, ParsedTaskData } from "@/types/types"

interface SyllabusUploaderProps {
  open: boolean
  onClose: () => void
  onParsed: (courseData: ParsedCourseData, tasksData: ParsedTaskData[]) => Promise<void>
}

export default function SyllabusUploader({
  open,
  onClose,
  onParsed,
}: SyllabusUploaderProps) {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const parseSyllabus = async (file: File): Promise<{ courseData: ParsedCourseData; tasksData: ParsedTaskData[] } | null> => {
    try {
      setLoading(true)
      setError(null)

      // Call the backend API to parse the syllabus with AI
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/parse-syllabus", {
        method: "POST",
        body: formData,
      })

      let parsedResult: any = null

      if (response.ok) {
        parsedResult = await response.json()
        // Validate that we got valid data
        if (!parsedResult || typeof parsedResult !== 'object') {
          throw new Error("Invalid response format from server")
        }
      } else {
        // If AI parsing fails, try to get error details
        let errorData: any = {}
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: `Server error: ${response.status} ${response.statusText}` }
        }
        
        console.warn("AI parsing failed:", errorData)
        
        // Show error to user but still use fallback
        const errorMsg = errorData.error || errorData.details || "AI parsing failed"
        setError(`Warning: ${errorMsg}. Using default course template.`)
        
        parsedResult = getFallbackParsing(file.name)
      }

      // Extract meeting days from parsed data
      const meetingDays = parsedResult.meetingDays || "MWF"
      const parsedDays = parseMeetingDays(meetingDays)

      // Build comprehensive notes with extracted information
      // If API returns notes field, use it; otherwise build from other fields
      let notesContent = ''
      if (parsedResult.notes && typeof parsedResult.notes === 'string' && parsedResult.notes.trim().length > 0) {
        // Use the notes from API if it's comprehensive (more than just a few words)
        if (parsedResult.notes.length > 50) {
          notesContent = parsedResult.notes
        } else {
          // If notes are too short, supplement with built notes
          const builtNotes = buildNotesFromParsedData(parsedResult)
          notesContent = `${parsedResult.notes}\n\n${builtNotes}`
        }
      } else {
        // Build notes from parsed data if API didn't provide notes
        notesContent = buildNotesFromParsedData(parsedResult)
      }

      const courseData: ParsedCourseData = {
        title: parsedResult.courseTitle || file.name.replace(/\.[^/.]+$/, ""),
        days: parsedDays,
        startTime: parsedResult.startTime || "09:00",
        endTime: parsedResult.endTime || "10:30",
        description: parsedResult.description || "Course created from syllabus",
        notes: notesContent,
        instructor: parsedResult.instructor,
        location: parsedResult.location,
        semester: parsedResult.semester,
      }

      // Extract tasks from assignments and exams
      const tasksData: ParsedTaskData[] = []

      // Add assignments as tasks
      if (parsedResult.assignments && Array.isArray(parsedResult.assignments)) {
        parsedResult.assignments.forEach((assignment: any) => {
          // Parse due date safely
          let dueDate = new Date()
          if (assignment.dueDate) {
            const parsedDate = new Date(assignment.dueDate)
            if (!isNaN(parsedDate.getTime())) {
              dueDate = parsedDate
            } else {
              // If date parsing fails, use default (7 days from now)
              dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          } else {
            dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
          
          tasksData.push({
            title: assignment.title || "Assignment",
            description: assignment.description || "",
            dueDate: dueDate,
            importance: assignment.weight ? (assignment.weight > 20 ? "Hard" : "Medium") : "Medium",
            type: "assignment",
            weight: assignment.weight,
          })
        })
      }

      // Add exams as tasks
      if (parsedResult.exams && Array.isArray(parsedResult.exams)) {
        parsedResult.exams.forEach((exam: any) => {
          // Parse exam date safely
          let dueDate = new Date()
          if (exam.date) {
            const parsedDate = new Date(exam.date)
            if (!isNaN(parsedDate.getTime())) {
              dueDate = parsedDate
            } else {
              // If date parsing fails, use default (30 days from now)
              dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          } else {
            dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
          
          tasksData.push({
            title: exam.title || "Exam",
            description: exam.description || "",
            dueDate: dueDate,
            importance: "Hard",
            type: "exam",
          })
        })
      }

      return { courseData, tasksData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to parse syllabus"
      console.error("Parsing error:", errorMessage)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getFallbackParsing = (fileName: string): any => {
    return {
      courseTitle: fileName.replace(/\.[^/.]+$/, ""),
      meetingDays: "MWF",
      startTime: "09:00",
      endTime: "10:30",
      description: "Course created from syllabus upload",
      notes: `Syllabus uploaded from: ${fileName}\n\nPlease manually review and update course details.`,
      courseObjectives: [],
      assignments: [],
      exams: [],
      requirements: [],
      policies: [],
    }
  }

  const parseMeetingDays = (daysString: string): string => {
    const dayMap: Record<string, string> = {
      "monday": "Monday",
      "tuesday": "Tuesday",
      "wednesday": "Wednesday",
      "thursday": "Thursday",
      "friday": "Friday",
      "saturday": "Saturday",
      "sunday": "Sunday",
      "m": "Monday",
      "t": "Tuesday",
      "w": "Wednesday",
      "th": "Thursday",
      "f": "Friday",
      "s": "Saturday",
      "su": "Sunday",
      "mon": "Monday",
      "tue": "Tuesday",
      "wed": "Wednesday",
      "thu": "Thursday",
      "fri": "Friday",
      "sat": "Saturday",
      "sun": "Sunday",
    }

    // Split by common delimiters
    const parts = daysString.toLowerCase().split(/[\s,/-]+/)
    const uniqueDays = new Set<string>()

    parts.forEach(part => {
      const trimmed = part.trim()
      if (trimmed && dayMap[trimmed]) {
        uniqueDays.add(dayMap[trimmed])
      }
    })

    // Return in order
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const result = dayOrder.filter(day => uniqueDays.has(day))

    return result.length > 0 ? result.join(", ") : "MWF"
  }

  const buildNotesFromParsedData = (result: any): string => {
    const lines: string[] = []

    lines.push("=== SYLLABUS INFORMATION ===\n")

    if (result.instructor) {
      lines.push(`Instructor: ${result.instructor}`)
    }

    if (result.location) {
      lines.push(`Location: ${result.location}`)
    }

    if (result.semester) {
      lines.push(`Semester: ${result.semester}`)
    }

    if (result.startTime && result.endTime) {
      lines.push(`Class Time: ${result.startTime} - ${result.endTime}`)
    }

    if (result.description) {
      lines.push(`\nDescription: ${result.description}`)
    }

    // If API provided notes, include them prominently
    if (result.notes && typeof result.notes === 'string' && result.notes.trim().length > 0) {
      lines.push(`\n=== DETAILED SYLLABUS NOTES ===\n${result.notes}\n`)
    }

    if (result.courseObjectives && Array.isArray(result.courseObjectives) && result.courseObjectives.length > 0) {
      lines.push("\n=== COURSE OBJECTIVES ===\n")
      result.courseObjectives.forEach((obj: string) => {
        lines.push(`• ${obj}`)
      })
    }

    if (result.assignments && Array.isArray(result.assignments) && result.assignments.length > 0) {
      lines.push("\n=== ASSIGNMENTS ===\n")
      result.assignments.forEach((assignment: any) => {
        const weight = assignment.weight ? ` (${assignment.weight}%)` : ""
        const dueDate = assignment.dueDate ? ` - Due: ${assignment.dueDate}` : ""
        lines.push(`• ${assignment.title}${weight}${dueDate}`)
        if (assignment.description) {
          lines.push(`  ${assignment.description}`)
        }
      })
    }

    if (result.exams && Array.isArray(result.exams) && result.exams.length > 0) {
      lines.push("\n=== EXAMS ===\n")
      result.exams.forEach((exam: any) => {
        const date = exam.date ? ` - ${exam.date}` : ""
        const weight = exam.weight ? ` (${exam.weight}%)` : ""
        lines.push(`• ${exam.title}${weight}${date}`)
        if (exam.description) {
          lines.push(`  ${exam.description}`)
        }
      })
    }

    if (result.gradingScale) {
      lines.push("\n=== GRADING SCALE ===\n")
      lines.push(result.gradingScale)
    }

    if (result.requirements && Array.isArray(result.requirements) && result.requirements.length > 0) {
      lines.push("\n=== COURSE REQUIREMENTS ===\n")
      result.requirements.forEach((req: string) => {
        lines.push(`• ${req}`)
      })
    }

    if (result.policies && Array.isArray(result.policies) && result.policies.length > 0) {
      lines.push("\n=== POLICIES ===\n")
      result.policies.forEach((policy: string) => {
        lines.push(`• ${policy}`)
      })
    }

    lines.push(`\n=== IMPORTED ===\nDate: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`)

    return lines.join("\n")
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setError("Please upload a valid file (PDF, PNG, JPG, DOCX)")
        return
      }

      const file = acceptedFiles[0]
      const result = await parseSyllabus(file)

      if (result) {
        setSuccess(true)
        // Wait a moment for user feedback, then call the callback
        setTimeout(async () => {
          try {
            await onParsed(result.courseData, result.tasksData)
            handleClose()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to process syllabus data")
            setSuccess(false)
          }
        }, 800)
      }
    },
    [onParsed]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
    disabled: loading,
  })

  const handleClose = () => {
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Syllabus</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error">
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircle sx={{ fontSize: 20 }} />
                <Typography variant="body2">Syllabus parsed successfully!</Typography>
              </Stack>
            </Alert>
          )}

          <Paper
            {...getRootProps()}
            sx={{
              p: 3,
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              cursor: loading ? "not-allowed" : "pointer",
              background: isDragActive
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.02),
              transition: "all 0.3s ease",
              textAlign: "center",
              opacity: loading ? 0.6 : 1,
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.08),
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <input {...getInputProps()} />
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              {loading ? (
                <CircularProgress size={40} />
              ) : isDragActive ? (
                <CloudUpload
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                  }}
                />
              ) : (
                <CloudUpload
                  sx={{
                    fontSize: 40,
                    color: theme.palette.text.secondary,
                  }}
                />
              )}
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                color: isDragActive ? theme.palette.primary.main : theme.palette.text.primary,
              }}
            >
              {loading ? "Parsing syllabus..." : "Drag and drop your syllabus here"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              or click to select a file (PDF, PNG, JPG, DOCX)
            </Typography>
          </Paper>

          <Alert severity="info">
            <Typography variant="caption">
              The uploaded syllabus will be parsed to extract course information and create tasks.
              You can edit these details after creation.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
