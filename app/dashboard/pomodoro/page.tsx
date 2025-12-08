"use client"


import HeroNav from "@/components/LandingPage/HeroNav";
import SideNav from "@/app/dashboard/components/SideNav";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Typography, 
  LinearProgress,
  Stack,
  IconButton,
  Chip
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/authContext";
import { recordPomodoroSession, getCompletedPomodoros } from "@/lib/firebase/pomodoro";

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export default function PomodoroPage(){
  const { user } = useAuth();
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);  // Store the interval ID so we can stop the timer later
  const sessionStartTime = useRef<number | null>(null); // Track when the current session started

  // Load completed pomodoros count from Firebase
  useEffect(() => {
    if (user) {
      loadCompletedPomodoros();
    }
  }, [user]);

  const loadCompletedPomodoros = async () => {
    if (!user) return;
    try {
      const count = await getCompletedPomodoros(user.uid);
      setPomodorosCompleted(count);
    } catch (error) {
      console.error("Error loading completed pomodoros:", error);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      if (sessionStartTime.current === null) {
        sessionStartTime.current = Date.now();
      }
      intervalRef.current = setInterval(() => { //Store the interval id
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); //Stop the timer when needed
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Record the completed session in Firebase
    if (user && sessionStartTime.current !== null) {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      try {
        await recordPomodoroSession(user.uid, mode, duration, true);
        if (mode === 'work') {
          await loadCompletedPomodoros(); // Reload count from Firebase
        }
      } catch (error) {
        console.error("Error recording pomodoro session:", error);
      }
    }
    sessionStartTime.current = null;

    if (mode === 'work') {
      // Auto-switch to break after work session
      const nextMode = (pomodorosCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(TIMER_SETTINGS[nextMode]);
    } else {
      // Auto-switch to work after break
      setMode('work');
      setTimeLeft(TIMER_SETTINGS.work);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      sessionStartTime.current = Date.now();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
    sessionStartTime.current = null;
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode]);
    sessionStartTime.current = null;
  };

  const skipToNext = async () => {
    setIsRunning(false);
    
    // Record the incomplete session if it was running
    if (user && sessionStartTime.current !== null) {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      try {
        await recordPomodoroSession(user.uid, mode, duration, false);
      } catch (error) {
        console.error("Error recording pomodoro session:", error);
      }
    }
    sessionStartTime.current = null;

    if (mode === 'work') {
      const nextMode = pomodorosCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(TIMER_SETTINGS[nextMode]);
    } else {
      setMode('work');
      setTimeLeft(TIMER_SETTINGS.work);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100;

  return (
    <>
      <SideNav />
      
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Pomodoro Timer
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Stay focused and productive with the Pomodoro Technique
          </Typography>

          <Card elevation={3} sx={{ borderRadius: 3, overflow: 'visible' }}>
            <CardContent sx={{ p: 4 }}>
              {/* Mode Selection */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                <Chip 
                  label="Work" 
                  onClick={() => switchMode('work')}
                  color={mode === 'work' ? 'primary' : 'default'}
                  variant={mode === 'work' ? 'filled' : 'outlined'}
                  sx={{ px: 2, fontSize: '1rem' }}
                />
                <Chip 
                  label="Short Break" 
                  onClick={() => switchMode('shortBreak')}
                  color={mode === 'shortBreak' ? 'secondary' : 'default'}
                  variant={mode === 'shortBreak' ? 'filled' : 'outlined'}
                  sx={{ px: 2, fontSize: '1rem' }}
                />
                <Chip 
                  label="Long Break" 
                  onClick={() => switchMode('longBreak')}
                  color={mode === 'longBreak' ? 'success' : 'default'}
                  variant={mode === 'longBreak' ? 'filled' : 'outlined'}
                  sx={{ px: 2, fontSize: '1rem' }}
                />
              </Stack>

              {/* Timer Display */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h1" 
                  component="div" 
                  sx={{ 
                    fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    color: mode === 'work' ? '#1976d2' : 
                           mode === 'shortBreak' ? '#9c27b0' : '#2e7d32'
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
              </Box>

              {/* Progress Bar */}
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5, 
                  mb: 4,
                  backgroundColor: 'grey.200'
                }}
                color={mode === 'work' ? 'primary' : 
                       mode === 'shortBreak' ? 'secondary' : 'success'}
              />

              {/* Control Buttons */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <IconButton 
                  onClick={toggleTimer}
                  sx={{ 
                    width: 64, 
                    height: 64,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    }
                  }}
                >
                  {isRunning ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
                
                <IconButton 
                  onClick={resetTimer}
                  sx={{ 
                    width: 64, 
                    height: 64,
                    backgroundColor: '#f50057',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#c51162',
                    }
                  }}
                >
                  <RestartAltIcon fontSize="large" />
                </IconButton>

                <IconButton 
                  onClick={skipToNext}
                  sx={{ 
                    width: 64, 
                    height: 64,
                    backgroundColor: '#0288d1',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#01579b',
                    }
                  }}
                >
                  <SkipNextIcon fontSize="large" />
                </IconButton>
              </Stack>

              {/* Pomodoros Completed */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  Pomodoros Completed: <strong>{pomodorosCompleted}</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>1. Work Session (25 min):</strong> Focus on your task without distractions
              </Typography>
              <Typography variant="body1">
                <strong>2. Short Break (5 min):</strong> Take a quick break after each work session
              </Typography>
              <Typography variant="body1">
                <strong>3. Long Break (15 min):</strong> After 4 work sessions, take a longer break
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}