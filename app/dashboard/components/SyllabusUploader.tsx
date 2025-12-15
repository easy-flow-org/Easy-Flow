"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import { CloudUpload, CheckCircle, Description, School, Notes } from '@mui/icons-material';
import { Course, Task } from '@/types/types';

interface SyllabusUploaderProps {
  open: boolean;
  onClose: () => void;
  onDataParsed: (course: Partial<Course>, tasks: Partial<Task>[]) => void;
}

export default function SyllabusUploader({ open, onClose, onDataParsed }: SyllabusUploaderProps) {
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<{
    course: Partial<Course>;
    tasks: Partial<Task>[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
      setPreviewData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);

      const response = await fetch('/api/parse-syllabus', {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse syllabus');
      }

      const data = await response.json();
      setProgress(100);
      setSuccess(true);

      // Show preview
      setPreviewData({
        course: data.course || {},
        tasks: data.tasks || []
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse syllabus. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (previewData) {
      onDataParsed(previewData.course, previewData.tasks);
      
      // Reset and close
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        setProgress(0);
        setPreviewData(null);
        onClose();
      }, 500);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setPreviewData(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Description color="primary" />
          <Box>
            <Typography variant="h6">Upload Syllabus</Typography>
            <Typography variant="caption" color="text.secondary">
              AI will extract course details automatically
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {!previewData ? (
            <>
              <Alert severity="info">
                <strong>Supported format:</strong> TXT files only (for now)
                <br />
                <strong>Tip:</strong> Copy your syllabus text and save it as a .txt file for best results!
              </Alert>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: file ? theme.palette.success.main : 'divider',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: file ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                  '&:hover': { 
                    borderColor: 'primary.main', 
                    bgcolor: 'action.hover' 
                  }
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  {file ? `Selected: ${file.name}` : 'Click to select syllabus file'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Only TXT files are currently supported
                </Typography>
              </Box>

              {loading && (
                <Box>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {progress < 40 ? 'Uploading...' : progress < 80 ? 'Analyzing with AI...' : 'Almost done...'}
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error">{error}</Alert>
              )}
            </>
          ) : (
            // Preview Section
            <>
              <Alert severity="success" icon={<CheckCircle />}>
                Syllabus parsed successfully! Review the details below:
              </Alert>

              {/* Course Preview */}
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School color="primary" /> Course Details
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Title"
                      secondary={previewData.course.title || 'Not found'}
                      secondaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Schedule"
                      secondary={`${previewData.course.days || 'Not found'}`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Time"
                      secondary={`${previewData.course.startTime || '00:00'} - ${previewData.course.endTime || '00:00'}`}
                    />
                  </ListItem>
                  {previewData.course.description && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Description"
                        secondary={previewData.course.description}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>

              {/* Notes Preview */}
              {previewData.course.notes && (
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Notes color="info" /> Syllabus Details
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      maxHeight: 200,
                      overflow: 'auto',
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                    }}
                  >
                    {previewData.course.notes}
                  </Typography>
                </Paper>
              )}

              {/* Tasks Preview */}
              {previewData.tasks.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Found {previewData.tasks.length} Assignment(s)
                  </Typography>
                  <Stack spacing={1}>
                    {previewData.tasks.slice(0, 5).map((task, index) => (
                      <Chip
                        key={index}
                        label={task.title}
                        size="small"
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    ))}
                    {previewData.tasks.length > 5 && (
                      <Typography variant="caption" color="text.secondary">
                        +{previewData.tasks.length - 5} more...
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        {!previewData ? (
          <>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? 'Processing...' : 'Parse Syllabus'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleReset}>
              Try Another File
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirm}
              startIcon={<CheckCircle />}
            >
              Import Course
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}