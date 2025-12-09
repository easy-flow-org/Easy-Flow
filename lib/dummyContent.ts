import { Course, TaskBase } from "@/types/types"

interface dummyContentTypes {
  courses: Course[]
  tasks: TaskBase[]
}

const dummyContent: dummyContentTypes = {
    courses: [
    {
      id: crypto.randomUUID(),
      title: "MTH 4000",
      description: "Introduction to calculus and mathematical reasoning",
      days: "Monday,Wednesday,Friday",
      startTime: "09:00",
      endTime: "10:15"
    },
    {
      id: crypto.randomUUID(),
      title: "CSC 2200",
      description: "Fundamentals of programming, algorithms, and data structures",
      days: "Tuesday,Thursday",
      startTime: "11:00",
      endTime: "12:15"
    },
    {
      id: crypto.randomUUID(),
      title: "ENG 2100",
      description: "Great works of literature from classical to modern periods",
      days: "Monday,Wednesday",
      startTime: "14:00",
      endTime: "15:15"
    },
    {
      id: crypto.randomUUID(),
      title: "HIS 1001",
      description: "Survey of early world history and major civilizations",
      days: "Tuesday,Thursday",
      startTime: "10:00",
      endTime: "11:15"
    },
    {
      id: crypto.randomUUID(),
      title: "JPN 1001",
      description: "Introductory Japanese language and culture",
      days: "Friday",
      startTime: "10:00",
      endTime: "11:30"
    }
  ],
  tasks: [
    {
      id: crypto.randomUUID(),
      title: "Finish Calculus Homework",
      notes: "Complete problems 1–10 on page 123. Check solutions after attempting.",
      dueDate: new Date("2025-12-04T23:59:00"),
      dueTime: "23:59",
      importance: "Hard" as const,
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Prepare CSC Lab Report",
      notes: "Document experiments and include screenshots. Submit to LMS.",
      dueDate: new Date("2025-12-06T17:00:00"),
      dueTime: "17:00",
      importance: "Medium" as const,
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Read ENG 2100 Chapter 5",
      notes: "Focus on themes and character analysis — prepare notes for discussion.",
      dueDate: new Date("2025-12-02T12:00:00"),
      dueTime: "12:00",
      importance: "Easy" as const,
      completed: true,
    },
    {
      id: crypto.randomUUID(),
      title: "Study for HIS Quiz",
      notes: "Review lecture slides from weeks 1–3 and timeline sheet.",
      dueDate: new Date("2025-12-08T09:00:00"),
      dueTime: "09:00",
      importance: "Medium" as const,
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Practice Japanese Vocabulary",
      notes: "Flashcards: 50 new words, focus on verbs and counters.",
      dueDate: new Date("2025-12-03T20:00:00"),
      dueTime: "20:00",
      importance: "Easy" as const,
      completed: false,
    }
  ]
}

export default dummyContent