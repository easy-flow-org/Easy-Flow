'use client'

import { 
  Button, 
  Typography, 
  Box, 
  alpha, 
  useTheme,
  Badge 
} from '@mui/material';
import Link from 'next/link';
import { SvgIconComponent } from '@mui/icons-material';

interface NavButtonProps {
  href: string;
  icon: SvgIconComponent;
  label?: string;
  badge?: number | null;
  compact?: boolean;
  mobile?: boolean;
  active?: boolean;
  hovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function NavButton({ 
  href, 
  icon: Icon, 
  label, 
  badge,
  compact = false,
  mobile = false,
  active = false,
  hovered = false,
  onMouseEnter,
  onMouseLeave
}: NavButtonProps) {
  const theme = useTheme();

  if (compact) {
    return (
      <Button
        component={Link}
        href={href}
        sx={{
          minWidth: 'auto',
          px: mobile ? 1.5 : 1,
          py: 0.5,
          borderRadius: 2,
          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: theme.palette.primary.main,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Badge 
          badgeContent={badge || 0} 
          color="error" 
          invisible={!badge}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: 10,
              height: 16,
              minWidth: 16,
            }
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Badge>
      </Button>
    );
  }

  return (
    <Button
      component={Link}
      href={href}
      fullWidth
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        justifyContent: 'flex-start',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: active 
          ? alpha(theme.palette.primary.main, 0.1)
          : hovered
          ? alpha(theme.palette.primary.main, 0.05)
          : 'transparent',
        color: active 
          ? theme.palette.primary.main 
          : theme.palette.text.primary,
        border: `1px solid ${
          active 
            ? alpha(theme.palette.primary.main, 0.3)
            : hovered
            ? alpha(theme.palette.primary.main, 0.1)
            : 'transparent'
        }`,
        '&:hover': {
          background: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.2),
          transform: 'translateX(4px)',
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: active ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        gap: 2,
      }}>
        <Badge 
          badgeContent={badge || 0} 
          color="error" 
          invisible={!badge}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: 10,
              height: 16,
              minWidth: 16,
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }
          }}
        >
          <Icon sx={{ 
            fontSize: 22,
            color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          }} />
        </Badge>
        
        <Typography variant="body2" fontWeight={600} sx={{ 
          flex: 1,
          textAlign: 'left',
          color: active ? theme.palette.primary.main : 'inherit',
        }}>
          {label}
        </Typography>

        {hovered && (
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.2)', opacity: 0.7 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            }
          }} />
        )}
      </Box>
    </Button>
  );
}