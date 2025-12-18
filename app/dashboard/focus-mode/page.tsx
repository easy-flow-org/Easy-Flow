"use client"

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
  Chip,
  alpha,
  useTheme,
  Fade,
  Zoom,
  Grow,
  Paper,
  Avatar,
  AvatarGroup,
  Tabs,
  Tab,
  Divider,
  Modal,
  Backdrop,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  FormControlLabel,
  Switch
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import TimerIcon from '@mui/icons-material/Timer';
import CoffeeIcon from '@mui/icons-material/Coffee';
import SpaIcon from '@mui/icons-material/Spa';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import MemoryIcon from '@mui/icons-material/Memory';
import CasinoIcon from '@mui/icons-material/Casino';
import SettingsIcon from '@mui/icons-material/Settings';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CalculateIcon from '@mui/icons-material/Calculate';
import SpeedIcon from '@mui/icons-material/Speed';
import RepeatIcon from '@mui/icons-material/Repeat';
import NumbersIcon from '@mui/icons-material/Numbers';
import { useState, useEffect, useRef } from "react";

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type GameType = 'tic-tac-toe' | 'memory' | 'dice-roll' | 'word-scramble' | 'quick-math' | 'reaction-time' | 'pattern-memory' | 'number-sequence' | null;

interface GameScore {
  ticTacToe: number;
  memory: number;
  diceRoll: number;
  wordScramble: number;
  quickMath: number;
  reactionTime: number;
  patternMemory: number;
  numberSequence: number;
}

const TIMER_SETTINGS = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

// Mini-game: Tic Tac Toe
const TicTacToeGame = ({ onComplete }: { onComplete: () => void }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setTimeout(() => onComplete(), 1500);
    } else if (newBoard.every(cell => cell)) {
      // Draw
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Tic Tac Toe
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 1,
        maxWidth: 300,
        mx: 'auto',
        mb: 3
      }}>
        {board.map((cell, index) => (
          <Button
            key={index}
            onClick={() => handleClick(index)}
            sx={{
              aspectRatio: '1',
              fontSize: '2rem',
              fontWeight: 'bold',
              minWidth: 0,
              bgcolor: alpha('#1976d2', 0.1),
              border: `2px solid ${alpha('#1976d2', 0.2)}`,
              '&:hover': {
                bgcolor: alpha('#1976d2', 0.2),
              }
            }}
            disabled={!!cell || !!winner}
          >
            {cell}
          </Button>
        ))}
      </Box>
      {winner && (
        <Typography variant="h6" color="primary">
          {winner} wins!
        </Typography>
      )}
    </Box>
  );
};

// Mini-game: Memory Card Game
const MemoryGame = ({ onComplete }: { onComplete: () => void }) => {
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const numbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (matched.length === 12) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [matched, onComplete]);

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Memory Game - Moves: {moves}
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 1,
        maxWidth: 300,
        mx: 'auto',
        mb: 3
      }}>
        {cards.map((value, index) => (
          <Button
            key={index}
            onClick={() => handleCardClick(index)}
            sx={{
              aspectRatio: '1',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              minWidth: 0,
              bgcolor: flipped.includes(index) || matched.includes(index) 
                ? alpha('#9c27b0', 0.2)
                : alpha('#9c27b0', 0.1),
              border: `2px solid ${alpha('#9c27b0', 0.2)}`,
              '&:hover': {
                bgcolor: alpha('#9c27b0', 0.2),
              }
            }}
            disabled={matched.includes(index)}
          >
            {flipped.includes(index) || matched.includes(index) ? value : '?'}
          </Button>
        ))}
      </Box>
      {matched.length === 12 && (
        <Typography variant="h6" color="secondary">
          Perfect! All matches found!
        </Typography>
      )}
    </Box>
  );
};

// Mini-game: Dice Roll Challenge
const DiceRollGame = ({ onComplete }: { onComplete: () => void }) => {
  const [target, setTarget] = useState(0);
  const [rolls, setRolls] = useState<number[]>([]);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTarget(Math.floor(Math.random() * 6) + 1);
  }, []);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setCurrentRoll(roll);
    setRolls([...rolls, roll]);
    
    if (roll === target) {
      setMessage('🎯 Bullseye! You matched the target!');
      setTimeout(() => onComplete(), 1500);
    } else if (rolls.length >= 2) {
      setMessage('Try again next time!');
      setTimeout(() => onComplete(), 1500);
    } else {
      setMessage(`Rolled ${roll}, target is ${target}`);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Dice Roll Challenge
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Target: <strong>{target}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Roll the dice to match the target number
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        {currentRoll && (
          <Box sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            bgcolor: alpha('#2e7d32', 0.1),
            borderRadius: 2,
            border: `3px solid ${alpha('#2e7d32', 0.3)}`,
            mb: 2
          }}>
            {currentRoll}
          </Box>
        )}
        
        <Button
          variant="contained"
          onClick={rollDice}
          startIcon={<CasinoIcon />}
          sx={{
            bgcolor: '#2e7d32',
            '&:hover': { bgcolor: '#1b5e20' }
          }}
          disabled={rolls.length >= 3}
        >
          Roll Dice ({3 - rolls.length} left)
        </Button>
      </Box>

      {message && (
        <Typography variant="body1" color={message.includes('🎯') ? 'success.main' : 'text.primary'}>
          {message}
        </Typography>
      )}

      {rolls.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Rolls: {rolls.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Mini-game: Word Scramble
const WordScrambleGame = ({ onComplete }: { onComplete: () => void }) => {
  const words = ['FOCUS', 'BREAK', 'TIMER', 'GAME', 'RELAX', 'ENERGY', 'MIND', 'PEACE'];
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setScrambled(newWord.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
    setMessage('');
  }, [score]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onComplete(), 1500);
    }
  }, [timeLeft, onComplete]);

  const handleSubmit = () => {
    if (input.toUpperCase() === currentWord) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => setMessage(''), 1000);
    } else {
      setMessage('❌ Try again!');
      setTimeout(() => setMessage(''), 1000);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Word Scramble
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Time: {timeLeft}s | Score: {score}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ 
          letterSpacing: 3, 
          mb: 2,
          fontFamily: 'monospace',
          color: 'primary.main'
        }}>
          {scrambled}
        </Typography>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Unscramble the word"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!input}
        >
          Submit
        </Button>
      </Box>

      {message && (
        <Typography variant="body1" color={message.includes('✅') ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Mini-game: Quick Math
const QuickMathGame = ({ onComplete }: { onComplete: () => void }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/'>('+');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState('');

  const generateQuestion = () => {
    const ops = ['+', '-', '*'] as const;
    const op = ops[Math.floor(Math.random() * ops.length)];
    const n1 = Math.floor(Math.random() * 20) + 1;
    const n2 = op === '*' ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 20) + 1;
    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setAnswer('');
    setMessage('');
  };

  useEffect(() => {
    generateQuestion();
  }, [score]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onComplete(), 1500);
    }
  }, [timeLeft, onComplete]);

  const calculateAnswer = () => {
    let correct: number;
    switch (operator) {
      case '+': correct = num1 + num2; break;
      case '-': correct = num1 - num2; break;
      case '*': correct = num1 * num2; break;
      default: correct = 0;
    }

    if (parseInt(answer) === correct) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        setMessage('');
        generateQuestion();
      }, 1000);
    } else {
      setMessage('❌ Try again!');
      setTimeout(() => setMessage(''), 1000);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Quick Math
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Time: {timeLeft}s | Score: {score}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 3, fontFamily: 'monospace' }}>
          {num1} {operator === '*' ? '×' : operator === '/' ? '÷' : operator} {num2} = ?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && calculateAnswer()}
          placeholder="Your answer"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={calculateAnswer}
          disabled={!answer}
        >
          Submit
        </Button>
      </Box>

      {message && (
        <Typography variant="body1" color={message.includes('✅') ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Mini-game: Reaction Time
const ReactionTimeGame = ({ onComplete }: { onComplete: () => void }) => {
  const [waiting, setWaiting] = useState(true);
  const [showClick, setShowClick] = useState(false);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (waiting && !showClick) {
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      const timer = setTimeout(() => {
        setShowClick(true);
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [waiting, showClick]);

  const handleClick = () => {
    if (!showClick) {
      setWaiting(false);
      setMessage('⏱️ Too early! Wait for green.');
      setTimeout(() => {
        setWaiting(true);
        setMessage('');
      }, 2000);
      return;
    }

    const time = Date.now() - startTime;
    setReactionTime(time);
    setTimes([...times, time]);
    const avg = [...times, time].reduce((a, b) => a + b, 0) / (times.length + 1);
    setAverageTime(avg);
    setRounds(rounds + 1);

    if (rounds >= 4) {
      setTimeout(() => onComplete(), 2000);
    } else {
      setTimeout(() => {
        setWaiting(true);
        setShowClick(false);
        setReactionTime(null);
      }, 2000);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Reaction Time Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Round {rounds + 1}/5 | Avg: {averageTime > 0 ? `${Math.round(averageTime)}ms` : '---'}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            fontSize: '1.5rem',
            bgcolor: showClick ? 'success.main' : waiting ? 'error.main' : 'grey.400',
            '&:hover': {
              bgcolor: showClick ? 'success.dark' : waiting ? 'error.dark' : 'grey.500',
            }
          }}
        >
          {showClick ? 'CLICK NOW!' : waiting ? 'Wait...' : 'Too Early!'}
        </Button>
      </Box>

      {reactionTime && (
        <Typography variant="h6" color="primary">
          {reactionTime}ms
        </Typography>
      )}

      {message && (
        <Typography variant="body1" color="warning.main" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Mini-game: Pattern Memory (Simon Says)
const PatternMemoryGame = ({ onComplete }: { onComplete: () => void }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState('Watch the pattern...');

  useEffect(() => {
    if (sequence.length === 0) {
      startNewLevel();
    }
  }, []);

  const startNewLevel = () => {
    const newSequence = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setIsShowing(true);
    setMessage('Watch the pattern...');
    
    let index = 0;
    const showInterval = setInterval(() => {
      if (index < newSequence.length) {
        setMessage(`Showing ${index + 1}/${newSequence.length}...`);
        index++;
      } else {
        clearInterval(showInterval);
        setIsShowing(false);
        setUserSequence([]);
        setMessage('Now repeat the pattern!');
      }
    }, 1000);
  };

  const handleColorClick = (colorIndex: number) => {
    if (isShowing) return;

    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setMessage('❌ Wrong! Game Over');
      setTimeout(() => onComplete(), 2000);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setLevel(level + 1);
      setMessage(`✅ Level ${level + 1}!`);
      setTimeout(() => {
        startNewLevel();
      }, 1500);
    }
  };

  const colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b'];

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Pattern Memory
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Level: {level}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, minHeight: 24 }}>
        {message}
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 2,
        maxWidth: 300,
        mx: 'auto'
      }}>
        {colors.map((color, index) => (
          <Button
            key={index}
            onClick={() => handleColorClick(index)}
            disabled={isShowing}
            sx={{
              aspectRatio: '1',
              bgcolor: color,
              opacity: isShowing && sequence.includes(index) ? 1 : 0.7,
              '&:hover': { bgcolor: color, opacity: 1 },
              '&:disabled': { opacity: 0.5 }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Mini-game: Number Sequence
const NumberSequenceGame = ({ onComplete }: { onComplete: () => void }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState('');

  const generateSequence = () => {
    const patterns = [
      { start: 2, step: 2, length: 4 }, // 2, 4, 6, 8, ?
      { start: 1, step: 3, length: 4 }, // 1, 4, 7, 10, ?
      { start: 5, step: 5, length: 4 }, // 5, 10, 15, 20, ?
      { start: 3, step: 4, length: 4 }, // 3, 7, 11, 15, ?
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const seq: number[] = [];
    for (let i = 0; i < pattern.length; i++) {
      seq.push(pattern.start + i * pattern.step);
    }
    setSequence(seq);
    setAnswer('');
    setMessage('');
  };

  useEffect(() => {
    generateSequence();
  }, [score]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onComplete(), 1500);
    }
  }, [timeLeft, onComplete]);

  const handleSubmit = () => {
    const correct = sequence[sequence.length - 1] + (sequence[1] - sequence[0]);
    if (parseInt(answer) === correct) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        setMessage('');
        generateSequence();
      }, 1000);
    } else {
      setMessage(`❌ Wrong! The answer is ${correct}`);
      setTimeout(() => {
        setMessage('');
        generateSequence();
      }, 2000);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Number Sequence
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Time: {timeLeft}s | Score: {score}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontFamily: 'monospace' }}>
          {sequence.join(', ')} , ?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Next number"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!answer}
        >
          Submit
        </Button>
      </Box>

      {message && (
        <Typography variant="body1" color={message.includes('✅') ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default function PomodoroPage() {
  const theme = useTheme();
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameScores, setGameScores] = useState<GameScore>({
    ticTacToe: 0,
    memory: 0,
    diceRoll: 0,
    wordScramble: 0,
    quickMath: 0,
    reactionTime: 0,
    patternMemory: 0,
    numberSequence: 0
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    work: Math.floor(TIMER_SETTINGS.work / 60),
    shortBreak: Math.floor(TIMER_SETTINGS.shortBreak / 60),
    longBreak: Math.floor(TIMER_SETTINGS.longBreak / 60),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setPomodorosCompleted((prev) => prev + 1);
      const nextMode = (pomodorosCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(TIMER_SETTINGS[nextMode]);
      
      // Suggest a game after work session
      if (nextMode === 'shortBreak' || nextMode === 'longBreak') {
        setTimeout(() => {
          setShowGameModal(true);
        }, 500);
      }
    } else {
      setMode('work');
      setTimeLeft(TIMER_SETTINGS.work);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode]);
  };

  const skipToNext = () => {
    setIsRunning(false);
    if (mode === 'work') {
      const nextMode = pomodorosCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(TIMER_SETTINGS[nextMode]);
    } else {
      setMode('work');
      setTimeLeft(TIMER_SETTINGS.work);
    }
  };

  const startGame = (gameType: GameType) => {
    setActiveGame(gameType);
    setShowGameModal(true);
  };

  const completeGame = () => {
    setShowGameModal(false);
    if (activeGame) {
      const gameKeyMap: Record<string, keyof GameScore> = {
        'tic-tac-toe': 'ticTacToe',
        'memory': 'memory',
        'dice-roll': 'diceRoll',
        'word-scramble': 'wordScramble',
        'quick-math': 'quickMath',
        'reaction-time': 'reactionTime',
        'pattern-memory': 'patternMemory',
        'number-sequence': 'numberSequence'
      };
      const scoreKey = gameKeyMap[activeGame];
      if (scoreKey) {
        setGameScores(prev => ({
          ...prev,
          [scoreKey]: prev[scoreKey] + 1
        }));
      }
    }
    setActiveGame(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100;

  const getModeColor = () => {
    switch (mode) {
      case 'work': return theme.palette.primary.main;
      case 'shortBreak': return theme.palette.secondary.main;
      case 'longBreak': return theme.palette.success.main;
    }
  };

  const handleSaveSettings = () => {
    const newSettings = {
      work: customSettings.work * 60,
      shortBreak: customSettings.shortBreak * 60,
      longBreak: customSettings.longBreak * 60,
    };
    
    // Update timer settings
    Object.assign(TIMER_SETTINGS, newSettings);
    
    // Reset current timer
    setTimeLeft(newSettings[mode]);
    setIsRunning(false);
    setShowSettingsModal(false);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ position: 'relative' }}>
            {/* Decorative Background */}
            <Box sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(getModeColor(), 0.1)} 0%, transparent 70%)`,
              zIndex: 0,
            }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  }}>
                    <TimerIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="h1" sx={{ 
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Focus Flow Timer
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                      Stay productive with timed sessions and fun break activities
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gap: 4, 
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                alignItems: 'start' 
              }}>
                {/* Left Column - Timer */}
                <Zoom in={true} timeout={1000}>
                  <Card sx={{ 
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`,
                    overflow: 'visible',
                    position: 'relative',
                  }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                      {/* Mode Selection */}
                      <Box sx={{ mb: 4 }}>
                        <Stack 
                          direction={{ xs: 'column', sm: 'row' }} 
                          spacing={1} 
                          justifyContent="center"
                          sx={{ mb: 3 }}
                        >
                          {([
                            { mode: 'work', label: 'Focus Time', icon: <PsychologyIcon />, color: theme.palette.primary.main },
                            { mode: 'shortBreak', label: 'Short Break', icon: <CoffeeIcon />, color: theme.palette.secondary.main },
                            { mode: 'longBreak', label: 'Long Break', icon: <SpaIcon />, color: theme.palette.success.main },
                          ] as const).map((item) => (
                            <Button
                              key={item.mode}
                              onClick={() => switchMode(item.mode)}
                              startIcon={item.icon}
                              sx={{
                                textTransform: 'none',
                                px: 3,
                                py: 1.5,
                                borderRadius: 3,
                                background: mode === item.mode 
                                  ? alpha(item.color, 0.1)
                                  : alpha(theme.palette.action.hover, 0.5),
                                color: mode === item.mode ? item.color : theme.palette.text.secondary,
                                border: `2px solid ${mode === item.mode ? item.color : 'transparent'}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: alpha(item.color, 0.15),
                                  transform: 'translateY(-2px)',
                                }
                              }}
                            >
                              <Typography variant="body1" fontWeight={600}>
                                {item.label}
                              </Typography>
                            </Button>
                          ))}
                        </Stack>
                      </Box>

                      {/* Timer Display */}
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{
                            fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            letterSpacing: '-0.02em',
                            color: getModeColor(),
                            textShadow: `0 4px 20px ${alpha(getModeColor(), 0.2)}`,
                          }}
                        >
                          {formatTime(timeLeft)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          {mode === 'work' ? 'Focus on your task' : 
                           mode === 'shortBreak' ? 'Time for a quick break' : 
                           'Enjoy a longer break'}
                        </Typography>
                      </Box>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mb: 4,
                          backgroundColor: alpha(theme.palette.divider, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${getModeColor()}, ${alpha(getModeColor(), 0.7)})`,
                          }
                        }}
                      />

                      {/* Control Buttons */}
                      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        <IconButton
                          onClick={toggleTimer}
                          sx={{
                            width: 72,
                            height: 72,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            color: 'white',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }
                          }}
                        >
                          {isRunning ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                        </IconButton>

                        <IconButton
                          onClick={resetTimer}
                          sx={{
                            width: 72,
                            height: 72,
                            background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                            color: 'white',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.error.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: `0 12px 32px ${alpha(theme.palette.error.main, 0.4)}`,
                            }
                          }}
                        >
                          <RestartAltIcon fontSize="large" />
                        </IconButton>

                        <IconButton
                          onClick={skipToNext}
                          sx={{
                            width: 72,
                            height: 72,
                            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                            color: 'white',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: `0 12px 32px ${alpha(theme.palette.info.main, 0.4)}`,
                            }
                          }}
                        >
                          <SkipNextIcon fontSize="large" />
                        </IconButton>

                        <IconButton
                          onClick={() => setShowSettingsModal(true)}
                          sx={{
                            width: 72,
                            height: 72,
                            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                            color: 'white',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: `0 12px 32px ${alpha(theme.palette.warning.main, 0.4)}`,
                            }
                          }}
                        >
                          <SettingsIcon fontSize="large" />
                        </IconButton>
                      </Stack>

                      {/* Stats */}
                      <Paper sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.8),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Pomodoros Completed
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color="primary">
                              {pomodorosCompleted}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              Current Streak
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color="secondary">
                              {Math.floor(pomodorosCompleted / 4)} days
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </CardContent>
                  </Card>
                </Zoom>

                {/* Right Column - Games & Info */}
                <Stack spacing={4}>
                  {/* Mini Games */}
                  <Grow in={true} timeout={1200}>
                    <Card sx={{ 
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      background: alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                          <SportsEsportsIcon sx={{ color: theme.palette.secondary.main, fontSize: 28 }} />
                          <Typography variant="h6" fontWeight={700}>
                            Break Games
                          </Typography>
                        </Stack>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Quick games to refresh your mind during breaks
                        </Typography>

                        <Stack spacing={2}>
                          {([
                            { 
                              type: 'tic-tac-toe' as GameType, 
                              label: 'Tic Tac Toe', 
                              icon: <Grid3x3Icon />,
                              score: gameScores.ticTacToe,
                              color: theme.palette.primary.main 
                            },
                            { 
                              type: 'memory' as GameType, 
                              label: 'Memory Game', 
                              icon: <MemoryIcon />,
                              score: gameScores.memory,
                              color: theme.palette.secondary.main 
                            },
                            { 
                              type: 'dice-roll' as GameType, 
                              label: 'Dice Roll', 
                              icon: <CasinoIcon />,
                              score: gameScores.diceRoll,
                              color: theme.palette.success.main 
                            },
                            { 
                              type: 'word-scramble' as GameType, 
                              label: 'Word Scramble', 
                              icon: <TextFieldsIcon />,
                              score: gameScores.wordScramble,
                              color: theme.palette.info.main 
                            },
                            { 
                              type: 'quick-math' as GameType, 
                              label: 'Quick Math', 
                              icon: <CalculateIcon />,
                              score: gameScores.quickMath,
                              color: theme.palette.warning.main 
                            },
                            { 
                              type: 'reaction-time' as GameType, 
                              label: 'Reaction Time', 
                              icon: <SpeedIcon />,
                              score: gameScores.reactionTime,
                              color: theme.palette.error.main 
                            },
                            { 
                              type: 'pattern-memory' as GameType, 
                              label: 'Pattern Memory', 
                              icon: <RepeatIcon />,
                              score: gameScores.patternMemory,
                              color: theme.palette.secondary.main 
                            },
                            { 
                              type: 'number-sequence' as GameType, 
                              label: 'Number Sequence', 
                              icon: <NumbersIcon />,
                              score: gameScores.numberSequence,
                              color: theme.palette.info.dark 
                            },
                          ]).map((game) => (
                            <Button
                              key={game.type}
                              onClick={() => startGame(game.type)}
                              startIcon={game.icon}
                              endIcon={<Chip label={game.score} size="small" />}
                              sx={{
                                textTransform: 'none',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 3,
                                background: alpha(game.color, 0.05),
                                border: `1px solid ${alpha(game.color, 0.1)}`,
                                color: theme.palette.text.primary,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: alpha(game.color, 0.1),
                                  transform: 'translateX(4px)',
                                }
                              }}
                            >
                              <Typography variant="body2" fontWeight={600}>
                                {game.label}
                              </Typography>
                            </Button>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grow>

                  {/* Tips & Instructions */}
                  <Grow in={true} timeout={1400}>
                    <Card sx={{ 
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      background: alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                          <LightbulbIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
                          <Typography variant="h6" fontWeight={700}>
                            Productivity Tips
                          </Typography>
                        </Stack>

                        <Stack spacing={2}>
                          <Paper sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            background: alpha(theme.palette.info.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                          }}>
                            <Typography variant="body2" fontWeight={600} color="info.main" gutterBottom>
                              🎯 Deep Focus
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Turn off notifications and focus on one task at a time
                            </Typography>
                          </Paper>

                          <Paper sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            background: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                          }}>
                            <Typography variant="body2" fontWeight={600} color="success.main" gutterBottom>
                              ☕ Active Breaks
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Stand up, stretch, or play a quick game during breaks
                            </Typography>
                          </Paper>

                          <Paper sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            background: alpha(theme.palette.warning.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                          }}>
                            <Typography variant="body2" fontWeight={600} color="warning.main" gutterBottom>
                              📊 Track Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Monitor your pomodoros to build consistent habits
                            </Typography>
                          </Paper>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grow>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Game Modal */}
      <Modal
        open={showGameModal}
        onClose={() => setShowGameModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showGameModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 24,
            p: 0,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <Box sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
              color: 'white',
              textAlign: 'center',
            }}>
              <CelebrationIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" fontWeight={700}>
                Break Time! 🎮
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Refresh your mind with a quick game
              </Typography>
            </Box>

            <Box sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
              {activeGame === 'tic-tac-toe' && <TicTacToeGame onComplete={completeGame} />}
              {activeGame === 'memory' && <MemoryGame onComplete={completeGame} />}
              {activeGame === 'dice-roll' && <DiceRollGame onComplete={completeGame} />}
              {activeGame === 'word-scramble' && <WordScrambleGame onComplete={completeGame} />}
              {activeGame === 'quick-math' && <QuickMathGame onComplete={completeGame} />}
              {activeGame === 'reaction-time' && <ReactionTimeGame onComplete={completeGame} />}
              {activeGame === 'pattern-memory' && <PatternMemoryGame onComplete={completeGame} />}
              {activeGame === 'number-sequence' && <NumberSequenceGame onComplete={completeGame} />}
              
              {!activeGame && (
                <Stack spacing={2}>
                  <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
                    Choose a game to play during your break
                  </Typography>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => startGame('tic-tac-toe')}
                    startIcon={<Grid3x3Icon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Tic Tac Toe
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="secondary"
                    onClick={() => startGame('memory')}
                    startIcon={<MemoryIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Memory Game
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="success"
                    onClick={() => startGame('dice-roll')}
                    startIcon={<CasinoIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Dice Roll Challenge
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="info"
                    onClick={() => startGame('word-scramble')}
                    startIcon={<TextFieldsIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Word Scramble
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="warning"
                    onClick={() => startGame('quick-math')}
                    startIcon={<CalculateIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Quick Math
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="error"
                    onClick={() => startGame('reaction-time')}
                    startIcon={<SpeedIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Reaction Time
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="secondary"
                    onClick={() => startGame('pattern-memory')}
                    startIcon={<RepeatIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Pattern Memory
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="info"
                    onClick={() => startGame('number-sequence')}
                    startIcon={<NumbersIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Number Sequence
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => setShowGameModal(false)}
                    sx={{ py: 1.5, borderRadius: 2, mt: 1 }}
                  >
                    Skip Games
                  </Button>
                </Stack>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Settings Dialog */}
      <Dialog 
        open={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <SettingsIcon sx={{ color: theme.palette.primary.main }} />
          Customize Timer Settings
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={4}>
            {/* Work Session */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Work Session: {customSettings.work} minutes
              </Typography>
              <Slider
                value={customSettings.work}
                onChange={(_, value) => setCustomSettings(prev => ({ ...prev, work: value as number }))}
                min={1}
                max={60}
                marks
                valueLabelDisplay="auto"
                sx={{
                  '& .MuiSlider-mark': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  }
                }}
              />
            </Box>

            {/* Short Break */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Short Break: {customSettings.shortBreak} minutes
              </Typography>
              <Slider
                value={customSettings.shortBreak}
                onChange={(_, value) => setCustomSettings(prev => ({ ...prev, shortBreak: value as number }))}
                min={1}
                max={15}
                marks
                valueLabelDisplay="auto"
                sx={{
                  '& .MuiSlider-mark': {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.3),
                  }
                }}
              />
            </Box>

            {/* Long Break */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Long Break: {customSettings.longBreak} minutes
              </Typography>
              <Slider
                value={customSettings.longBreak}
                onChange={(_, value) => setCustomSettings(prev => ({ ...prev, longBreak: value as number }))}
                min={1}
                max={30}
                marks
                valueLabelDisplay="auto"
                sx={{
                  '& .MuiSlider-mark': {
                    backgroundColor: alpha(theme.palette.success.main, 0.3),
                  }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setShowSettingsModal(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}