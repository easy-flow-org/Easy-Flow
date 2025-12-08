"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { getCourses } from "@/lib/firebase/courses";
import { getTasks } from "@/lib/firebase/tasks";
import { getActivitiesForDate, getActivitiesInRange, UserActivity } from "@/lib/firebase/activities";
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
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Course, Task } from "@/types/types";
import { toast } from "react-toastify";

export default function CalendarPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedDateActivities, setSelectedDateActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities when user changes or date changes
  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user, currentDate]);

  const loadActivities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [courses, tasks] = await Promise.all([
        getCourses(user.uid),
        getTasks(user.uid),
      ]);

      const allActivities: UserActivity[] = [];

      // Add courses
      courses.forEach((course) => {
        allActivities.push({
          id: `course-${course.id}`,
          type: "course",
          title: course.title,
          description: course.description,
          date: new Date(),
          data: course,
        });
      });

      // Add tasks
      tasks.forEach((task) => {
        allActivities.push({
          id: `task-${task.id}`,
          type: "task",
          title: task.title,
          description: task.notes,
          date: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
          data: task,
        });
      });

      setActivities(allActivities);
      updateSelectedDateActivities(currentDate, allActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedDateActivities = (date: Date, allActivities: UserActivity[]) => {
    const selected = allActivities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getFullYear() === date.getFullYear() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getDate() === date.getDate()
      );
    });
    setSelectedDateActivities(selected);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setCurrentDate(newDate);
    updateSelectedDateActivities(newDate, activities);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getActivitiesForDay = (day: number): UserActivity[] => {
    return activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getFullYear() === currentDate.getFullYear() &&
        activityDate.getMonth() === currentDate.getMonth() &&
        activityDate.getDate() === day
      );
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Calendar
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Calendar Grid */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2 }}>
              {/* Month Navigation */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <IconButton onClick={handlePrevMonth} size="small">
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" fontWeight={600}>
                  {monthName}
                </Typography>
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRight />
                </IconButton>
              </Stack>

              {/* Day Headers */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <Grid item xs={12 / 7} key={day} sx={{ textAlign: "center" }}>
                    <Typography variant="caption" fontWeight={600}>
                      {day}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar Days */}
              <Grid container spacing={1}>
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return (
                      <Grid item xs={12 / 7} key={`empty-${index}`}>
                        <Box sx={{ aspectRatio: "1", opacity: 0.3 }} />
                      </Grid>
                    );
                  }

                  const dayActivities = getActivitiesForDay(day);
                  const isSelected =
                    currentDate.getDate() === day &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  const isCurrentDay =
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();

                  return (
                    <Grid item xs={12 / 7} key={day}>
                      <Paper
                        onClick={() => handleDateSelect(day)}
                        sx={{
                          p: 1,
                          aspectRatio: "1",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? theme.palette.primary.main
                            : isCurrentDay
                            ? theme.palette.action.hover
                            : "transparent",
                          color: isSelected ? theme.palette.primary.contrastText : "inherit",
                          border: isCurrentDay ? `2px solid ${theme.palette.primary.main}` : "none",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? theme.palette.primary.dark
                              : theme.palette.action.hover,
                          },
                        }}
                      >
                        <Badge
                          badgeContent={dayActivities.length}
                          color="secondary"
                          overlap="circular"
                        >
                          <Typography
                            variant="body2"
                            fontWeight={isCurrentDay ? 700 : 500}
                          >
                            {day}
                          </Typography>
                        </Badge>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Card>
          </Grid>

          {/* Selected Date Activities */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, maxHeight: "600px", overflow: "auto" }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {currentDate.toLocaleString("default", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>

              {selectedDateActivities.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No activities scheduled for this day
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {selectedDateActivities.map((activity) => (
                    <Paper
                      key={activity.id}
                      sx={{
                        p: 1.5,
                        borderLeft: `4px solid ${
                          activity.type === "course"
                            ? theme.palette.info.main
                            : activity.type === "task"
                            ? theme.palette.warning.main
                            : theme.palette.success.main
                        }`,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        {activity.title}
                      </Typography>
                      {activity.description && (
                        <Typography variant="caption" color="text.secondary">
                          {activity.description}
                        </Typography>
                      )}
                      <Stack direction="row" gap={0.5} mt={0.5}>
                        <Chip
                          label={activity.type}
                          size="small"
                          variant="outlined"
                          color={
                            activity.type === "course"
                              ? "info"
                              : activity.type === "task"
                              ? "warning"
                              : "success"
                          }
                        />
                        {activity.type === "task" && (
                          <Chip
                            label={
                              (activity.data as Task).importance || "Easy"
                            }
                            size="small"
                            color={
                              (activity.data as Task).importance === "Hard"
                                ? "error"
                                : (activity.data as Task).importance === "Medium"
                                ? "warning"
                                : "default"
                            }
                          />
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}