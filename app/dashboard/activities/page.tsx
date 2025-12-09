"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { getUserActivities, UserActivity } from "@/lib/firebase/activities";
import {
  Box,
  Card,
  Stack,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Course, Task } from "@/types/types";
import { toast } from "react-toastify";

export default function ActivitiesPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [allActivities, setAllActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "course" | "task" | "pomodoro">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [allActivities, filter, searchTerm]);

  const loadActivities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const activities = await getUserActivities(user.uid);
      setAllActivities(activities);
    } catch (error) {
      console.error("Error loading activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allActivities;

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter((activity) => activity.type === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(term) ||
          activity.description?.toLowerCase().includes(term)
      );
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (type: UserActivity["type"]) => {
    switch (type) {
      case "course":
        return "📚";
      case "task":
        return "✓";
      case "pomodoro":
        return "🍅";
      default:
        return "•";
    }
  };

  const getActivityColor = (type: UserActivity["type"]) => {
    switch (type) {
      case "course":
        return theme.palette.info.main;
      case "task":
        return theme.palette.warning.main;
      case "pomodoro":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        All Activities
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {/* Filters */}
          <Card sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center" }}>
                <TextField
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{ flex: 1, minWidth: 200 }}
                />
                <Typography variant="body2" fontWeight={600}>
                  Filter:
                </Typography>
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={(e, newFilter) => {
                    if (newFilter !== null) {
                      setFilter(newFilter);
                    }
                  }}
                  size="small"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="course">Courses</ToggleButton>
                  <ToggleButton value="task">Tasks</ToggleButton>
                  <ToggleButton value="pomodoro">Focus</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Showing {filteredActivities.length} of {allActivities.length} activities
              </Typography>
            </Stack>
          </Card>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                {searchTerm ? "No activities match your search" : "No activities yet"}
              </Typography>
            </Card>
          ) : (
            <Stack spacing={1.5}>
              {filteredActivities.map((activity, index) => (
                <Paper
                  key={activity.id}
                  sx={{
                    p: 2,
                    borderLeft: `4px solid ${getActivityColor(activity.type)}`,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 2,
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: getActivityColor(activity.type),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {activity.title}
                        </Typography>
                        {activity.description && (
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        )}
                        <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                          <Chip
                            label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
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
                                (activity.data as Task).completed ? "Completed" : "Pending"
                              }
                              size="small"
                              color={(activity.data as Task).completed ? "success" : "default"}
                            />
                          )}
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
                      </Stack>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                      {activity.date.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}
