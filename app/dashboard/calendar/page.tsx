"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { getCourses } from "@/lib/firebase/courses";
import { getTasks } from "@/lib/firebase/tasks";
import {
  Box,
  Card,
  Stack,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  Grid,
  Badge,
  IconButton,
  alpha,
  useTheme,
  Fade,
  Zoom,
  Grow,
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
} from "@mui/material";
import { 
  ChevronLeft, 
  ChevronRight, 
  Today, 
  CalendarMonth,
  Schedule,
  Event,
  Assignment,
  School,
  Timer,
  TrendingUp,
  FilterList,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  Add
} from "@mui/icons-material";
import { Course, Task } from "@/types/types";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";

type ViewMode = "month" | "week" | "day";

interface CalendarEvent {
  id: string;
  title: string;
  type: "course" | "task" | "focus";
  date: Date;
  startTime?: string;
  endTime?: string;
  color: string;
  data: Course | Task;
}

export default function CalendarPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [filterTypes, setFilterTypes] = useState<string[]>(["course", "task", "focus"]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [events, selectedDate, filterTypes]);

  const loadEvents = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [courses, tasks] = await Promise.all([
        getCourses(user.uid),
        getTasks(user.uid),
      ]);

      const allEvents: CalendarEvent[] = [];

      // Add courses as events for each meeting day
      courses.forEach((course) => {
        const days = course.days.split(",").map(d => d.trim().toLowerCase());
        const daysMap: Record<string, number> = {
          "monday": 1, "tuesday": 2, "wednesday": 3, "thursday": 4,
          "friday": 5, "saturday": 6, "sunday": 0
        };

        // For each day in the next 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dayName = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
          
          if (days.includes(dayName)) {
            allEvents.push({
              id: `course-${course.id}-${i}`,
              title: course.title,
              type: "course",
              date: new Date(date),
              startTime: course.startTime,
              endTime: course.endTime,
              color: theme.palette.info.main,
              data: course,
            });
          }
        }
      });

      // Add tasks as events
      tasks.forEach((task) => {
        if (task.dueDate) {
          allEvents.push({
            id: `task-${task.id}`,
            title: task.title,
            type: "task",
            date: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
            color: task.importance === "Hard" 
              ? theme.palette.error.main 
              : task.importance === "Medium" 
                ? theme.palette.warning.main 
                : theme.palette.success.main,
            data: task,
          });
        }
      });

      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = events.filter(event => filterTypes.includes(event.type));
    
    if (viewMode === "day") {
      filtered = filtered.filter(event => isSameDay(event.date, selectedDate));
    } else if (viewMode === "week") {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      filtered = filtered.filter(event => 
        event.date >= weekStart && event.date <= weekEnd
      );
    }

    // Sort by time if available
    filtered.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return a.date.getTime() - b.date.getTime();
    });

    setFilteredEvents(filtered);
  };

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (viewMode === "month") {
      setViewMode("day");
    }
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding for previous month
    const firstDay = start.getDay();
    const prevMonthDays = [];
    for (let i = 0; i < firstDay; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() - (firstDay - i));
      prevMonthDays.push(date);
    }
    
    // Add padding for next month
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDays = [];
    const remaining = totalCells - (prevMonthDays.length + days.length);
    const lastDate = new Date(end);
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i);
      nextMonthDays.push(date);
    }
    
    return [...prevMonthDays, ...days, ...nextMonthDays];
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "course": return <School fontSize="small" />;
      case "task": return <Assignment fontSize="small" />;
      default: return <Event fontSize="small" />;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={56} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Skeleton variant="rounded" height={500} sx={{ flex: 2 }} />
            <Skeleton variant="rounded" height={500} sx={{ flex: 1 }} />
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      p: { xs: 2, md: 4 },
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`,
    }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.warning.main, 0.3)}`,
                }}>
                  <CalendarMonth sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                    Academic Calendar
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Schedule your courses, tasks, and focus sessions
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<Today />}
                onClick={handleToday}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Today
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Add />}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                }}
              >
                Add Event
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Grow in={true} timeout={500}>
          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
              }}>
                <School fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {events.filter(e => e.type === "course").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Course Sessions
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>

        <Grow in={true} timeout={700}>
          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
              }}>
                <Assignment fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {events.filter(e => e.type === "task").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Tasks
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>

        <Grow in={true} timeout={900}>
          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
              }}>
                <TrendingUp fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {events.filter(e => e.date >= new Date()).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Events
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>
      </Stack>

      {/* Controls */}
      <Zoom in={true} timeout={1000}>
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
        }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
            {/* Navigation */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={handlePrev}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.1),
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
              
              <Typography variant="h6" fontWeight={700} sx={{ minWidth: 200, textAlign: 'center' }}>
                {viewMode === "month" 
                  ? format(currentDate, "MMMM yyyy")
                  : viewMode === "week"
                  ? `Week of ${format(selectedDate, "MMM d")}`
                  : format(selectedDate, "EEEE, MMMM d, yyyy")
                }
              </Typography>
              
              <IconButton
                onClick={handleNext}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.1),
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </Stack>

            {/* View Mode */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&.Mui-selected': {
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  }
                }
              }}
            >
              <ToggleButton value="month">
                <ViewWeek sx={{ mr: 1, fontSize: 16 }} />
                Month
              </ToggleButton>
              <ToggleButton value="week">
                <ViewAgenda sx={{ mr: 1, fontSize: 16 }} />
                Week
              </ToggleButton>
              <ToggleButton value="day">
                <ViewDay sx={{ mr: 1, fontSize: 16 }} />
                Day
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Filters */}
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterList sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              <Chip
                label="Courses"
                onClick={() => setFilterTypes(prev => 
                  prev.includes("course") 
                    ? prev.filter(t => t !== "course") 
                    : [...prev, "course"]
                )}
                color={filterTypes.includes("course") ? "info" : "default"}
                variant={filterTypes.includes("course") ? "filled" : "outlined"}
                size="small"
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label="Tasks"
                onClick={() => setFilterTypes(prev => 
                  prev.includes("task") 
                    ? prev.filter(t => t !== "task") 
                    : [...prev, "task"]
                )}
                color={filterTypes.includes("task") ? "warning" : "default"}
                variant={filterTypes.includes("task") ? "filled" : "outlined"}
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Zoom>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        {/* Calendar Grid */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 66%' } }}>
          <Zoom in={true} timeout={1200}>
            <Card sx={{ 
              p: 3,
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              minHeight: 600,
            }}>
              {/* Day Headers */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 3 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <Box key={day} sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      {day}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {getMonthDays().map((date, index) => {
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isSelected = isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);
                  const dayEvents = getEventsForDate(date);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <Box key={index}>
                      <Paper
                        onClick={() => handleDateSelect(date)}
                        sx={{
                          p: 2,
                          minHeight: 100,
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          background: isSelected
                            ? alpha(theme.palette.primary.main, 0.1)
                            : isTodayDate
                            ? alpha(theme.palette.primary.main, 0.05)
                            : 'transparent',
                          border: `1px solid ${
                            isSelected
                              ? theme.palette.primary.main
                              : isTodayDate
                              ? alpha(theme.palette.primary.main, 0.3)
                              : alpha(theme.palette.divider, 0.1)
                          }`,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          opacity: isCurrentMonth ? 1 : 0.4,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                            borderColor: theme.palette.primary.main,
                          }
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography
                              variant="body2"
                              fontWeight={isTodayDate ? 800 : isSelected ? 700 : 500}
                              color={isTodayDate ? 'primary.main' : 'text.primary'}
                            >
                              {format(date, "d")}
                            </Typography>
                            {hasEvents && (
                              <Badge
                                badgeContent={dayEvents.length}
                                color="secondary"
                                sx={{
                                  '& .MuiBadge-badge': {
                                    fontSize: 10,
                                    height: 18,
                                    minWidth: 18,
                                  }
                                }}
                              />
                            )}
                          </Stack>

                          {/* Event Dots */}
                          {hasEvents && (
                            <Stack spacing={0.5}>
                              {dayEvents.slice(0, 3).map((event, idx) => (
                                <Box
                                  key={event.id}
                                  sx={{
                                    width: '100%',
                                    height: 4,
                                    borderRadius: 2,
                                    background: event.color,
                                    opacity: 0.8,
                                  }}
                                />
                              ))}
                              {dayEvents.length > 3 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{dayEvents.length - 3} more
                                </Typography>
                              )}
                            </Stack>
                          )}
                        </Stack>
                      </Paper>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Zoom>
        </Box>

        {/* Events Panel */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 34%' } }}>
        <Zoom in={true} timeout={1400}>
          <Stack spacing={3}>
            {/* Selected Day Events */}
            <Card sx={{ 
              p: 3,
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <CalendarMonth sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {format(selectedDate, "EEEE, MMMM d")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {filteredEvents.length} events
                  </Typography>
                </Box>
              </Stack>

              {filteredEvents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ fontSize: 48, opacity: 0.3, mb: 2 }}>📅</Box>
                  <Typography variant="body2" color="text.secondary">
                    No events scheduled for this day
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {filteredEvents.map((event, index) => (
                    <Grow in={true} timeout={500 + index * 100} key={event.id}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            borderLeft: `4px solid ${event.color}`,
                            background: alpha(event.color, 0.05),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateX(4px)',
                              boxShadow: `0 8px 24px ${alpha(event.color, 0.1)}`,
                            }
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Typography variant="subtitle1" fontWeight={600}>
                                {event.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getEventIcon(event.type)}
                                <Chip
                                  label={event.type}
                                  size="small"
                                  sx={{
                                    background: alpha(event.color, 0.1),
                                    color: event.color,
                                    fontWeight: 500,
                                    borderRadius: 2,
                                  }}
                                />
                              </Box>
                            </Stack>

                            <Stack spacing={0.5}>
                              {event.startTime && (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatTime(event.startTime)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                  </Typography>
                                </Stack>
                              )}
                              
                              {event.type === "task" && (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Assignment sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {(event.data as Task).completed ? "Completed" : "Pending"}
                                  </Typography>
                                  <Chip
                                    label={(event.data as Task).importance}
                                    size="small"
                                    sx={{
                                      background: (event.data as Task).importance === "Hard"
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : (event.data as Task).importance === "Medium"
                                        ? alpha(theme.palette.warning.main, 0.1)
                                        : alpha(theme.palette.success.main, 0.1),
                                      color: (event.data as Task).importance === "Hard"
                                        ? theme.palette.error.main
                                        : (event.data as Task).importance === "Medium"
                                        ? theme.palette.warning.main
                                        : theme.palette.success.main,
                                      borderRadius: 2,
                                    }}
                                  />
                                </Stack>
                              )}
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grow>
                    ))}
                  </Stack>
                )}
              </Card>

              {/* Upcoming Events */}
              <Card sx={{ 
                p: 3,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Upcoming This Week
                </Typography>
                
                <Stack spacing={2}>
                  {events
                    .filter(event => {
                      const weekStart = new Date();
                      const weekEnd = new Date();
                      weekEnd.setDate(weekEnd.getDate() + 7);
                      return event.date >= weekStart && event.date <= weekEnd;
                    })
                    .slice(0, 5)
                    .map((event, index) => (
                      <Stack key={event.id} direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40,
                          background: alpha(event.color, 0.1),
                          color: event.color,
                          fontWeight: 600,
                          fontSize: 14,
                        }}>
                          {format(event.date, "d")}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {event.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(event.date, "EEE")} • {event.type}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                </Stack>
              </Card>
            </Stack>
          </Zoom>
        </Box>
      </Stack>
    </Box>
  );
}