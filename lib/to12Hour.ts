export default function to12Hour(time24?: string | null): string {
  if (!time24) return ""
  const m = time24.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return time24
  let hh = parseInt(m[1], 10)
  const mm = m[2]
  const ampm = hh >= 12 ? "PM" : "AM"
  hh = hh % 12 || 12
  return `${hh}:${mm} ${ampm}`
}