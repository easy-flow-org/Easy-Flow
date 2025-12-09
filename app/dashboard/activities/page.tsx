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
  useTheme,
  alpha,
  Fade,
  Zoom,
  IconButton,
  InputAdornment,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { 
  Search, FilterList, CalendarMonth, CheckCircle, 
  School, Timer, TrendingUp, Download, Share
} from "@mui/icons-material";
import { Course, Task } from "@/types/types";
import { toast } from "react-toastify";

const getActivityIcon = (type: UserActivity["type"]) => {
  switch (type) {
    case "course":
      return <School />;
    case "task":
      return <CheckCircle />;
    case "pomodoro":
      return <Timer />;
    default:
      return <TrendingUp />;
  }
};

const getActivityColor = (type: UserActivity["type"], theme: any) => {
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

export default function ActivitiesPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [allActivities, setAllActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "course" | "task" | "pomodoro">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    courses: 0,
    tasks: 0,
    pomodoros: 0,
  });

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
    calculateStats();
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

    if (filter !== "all") {
      filtered = filtered.filter((activity) => activity.type === filter);
    }

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

  const calculateStats = () => {
    const stats = {
      total: allActivities.length,
      courses: allActivities.filter(a => a.type === "course").length,
      tasks: allActivities.filter(a => a.type === "task").length,
      pomodoros: allActivities.filter(a => a.type === "pomodoro").length,
    };
    setStats(stats);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Fade in={true} timeout={800}>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                Activity Timeline
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your academic journey and productivity
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, borderRadius: 2 }}>
                <Share />
              </IconButton>
              <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, borderRadius: 2 }}>
                <Download />
              </IconButton>
            </Stack>
          </Stack>

          {/* Stats Cards */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {[
              { label: 'Total Activities', value: stats.total, color: theme.palette.primary.main, icon: <TrendingUp /> },
              { label: 'Courses', value: stats.courses, color: theme.palette.info.main, icon: <School /> },
              { label: 'Tasks', value: stats.tasks, color: theme.palette.warning.main, icon: <CheckCircle /> },
              { label: 'Focus Sessions', value: stats.pomodoros, color: theme.palette.success.main, icon: <Timer /> },
            ].map((stat) => (
              <Card key={stat.label} sx={{ 
                flex: 1, 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${alpha(stat.color, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.7),
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
                    background: alpha(stat.color, 0.1),
                    color: stat.color,
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Fade>

      {/* Filters Section */}
      <Zoom in={true} timeout={800}>
        <Card sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
        }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterList sx={{ color: theme.palette.text.secondary }} />
              <Typography variant="h6" fontWeight={600}>
                Filter Activities
              </Typography>
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(e, newFilter) => {
                  if (newFilter !== null) {
                    setFilter(newFilter);
                  }
                }}
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
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="course">Courses</ToggleButton>
                <ToggleButton value="task">Tasks</ToggleButton>
                <ToggleButton value="pomodoro">Focus</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {filteredActivities.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Showing <strong>{filteredActivities.length}</strong> of <strong>{allActivities.length}</strong> activities
                {searchTerm && ` matching "${searchTerm}"`}
              </Typography>
            )}
          </Stack>
        </Card>
      </Zoom>

      {/* Activities List */}
      {loading ? (
        <Box sx={{ p: 4 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Skeleton variant="circular" width={60} height={60} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Skeleton variant="rectangular" width={80} height={24} />
                    <Skeleton variant="rectangular" width={80} height={24} />
                  </Stack>
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>
      ) : filteredActivities.length === 0 ? (
        <Zoom in={true}>
          <Card sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4,
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
          }}>
            <Box sx={{ fontSize: 64, mb: 2, opacity: 0.3 }}>📊</Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {searchTerm ? "No activities found" : "No activities yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "Try a different search term" : "Start by creating your first task or course"}
            </Typography>
          </Card>
        </Zoom>
      ) : (
        <Stack spacing={2}>
          {filteredActivities.map((activity) => (
            <Fade in={true} key={activity.id} timeout={500}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  borderLeft: `4px solid ${getActivityColor(activity.type, theme)}`,
                  background: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`,
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${alpha(getActivityColor(activity.type, theme), 0.3)}, transparent)`,
                  }
                }}
              >
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(getActivityColor(activity.type, theme), 0.1),
                      border: `2px solid ${alpha(getActivityColor(activity.type, theme), 0.2)}`,
                      color: getActivityColor(activity.type, theme),
                      flexShrink: 0,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                          {activity.title}
                        </Typography>
                        {activity.description && (
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        )}
                      </Box>

                      <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                        <Chip
                          label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          size="small"
                          icon={getActivityIcon(activity.type)}
                          sx={{
                            background: alpha(getActivityColor(activity.type, theme), 0.1),
                            color: getActivityColor(activity.type, theme),
                            fontWeight: 500,
                          }}
                        />
                        
                        {activity.type === "task" && (
                          <>
                            <Chip
                              label={(activity.data as Task).completed ? "Completed" : "In Progress"}
                              size="small"
                              color={(activity.data as Task).completed ? "success" : "default"}
                              variant={(activity.data as Task).completed ? "filled" : "outlined"}
                            />
                            <Chip
                              label={(activity.data as Task).importance || "Low"}
                              size="small"
                              sx={{
                                background: (activity.data as Task).importance === "Hard" 
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : (activity.data as Task).importance === "Medium"
                                  ? alpha(theme.palette.warning.main, 0.1)
                                  : alpha(theme.palette.success.main, 0.1),
                                color: (activity.data as Task).importance === "Hard"
                                  ? theme.palette.error.main
                                  : (activity.data as Task).importance === "Medium"
                                  ? theme.palette.warning.main
                                  : theme.palette.success.main,
                              }}
                            />
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Time */}
                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {formatDate(activity.date)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.date.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Fade>
          ))}
        </Stack>
      )}
    </Box>
  );
}