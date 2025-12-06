export default function getDateAbbrev(days: string) {
    return days
      .split(",")
      .map((d) => d.trim())
      .map((day) => {
        switch (day.toLowerCase()) {
          case "monday":
            return "Mon"
          case "tuesday":
            return "Tues"
          case "wednesday":
            return "Wed"
          case "thursday":
            return "Thurs"
          case "friday":
            return "Fri"
          case "saturday":
            return "Sat"
          case "sunday":
            return "Sun"
          default:
            return day
        }
      })
      .join(" ")
  }