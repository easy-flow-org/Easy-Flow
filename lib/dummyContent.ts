const dummyContent = {
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
  ]
}

export default dummyContent