'use client'

import { 
  Button, 
  Typography, 
  Box, 
  alpha, 
  useTheme,
  Badge,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import Link from 'next/link';
import { SvgIconComponent } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import {
  Dashboard as DashboardIcon,
  MenuBook as CoursesIcon,
  TaskAlt as TasksIcon,
  DateRange as CalendarIcon,
  Visibility as ActivitiesIcon,
  LocalFireDepartment as FocusModeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface NavButtonProps {
  href: string;
  icon: SvgIconComponent;
  label?: string;
  badge?: number | null;
  compact?: boolean;
  mobile?: boolean;
  active?: boolean;
  hovered?: boolean;
  collapsed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function NavButton({ 
  href, 
  icon: Icon, 
  label, 
  badge,
  compact = false,
  mobile = false,
  active = false,
  hovered = false,
  collapsed = false,
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

  const buttonContent = (
    <Button
      component={Link}
      href={href}
      fullWidth
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 1.5 : 3,
        py: collapsed ? 1.5 : 1.5,
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
        minHeight: 48,
        '&:hover': {
          background: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.2),
          transform: collapsed ? 'scale(1.05)' : 'translateX(4px)',
        },
        '&:before': collapsed ? undefined : {
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
        gap: collapsed ? 0 : 2,
        justifyContent: collapsed ? 'center' : 'flex-start',
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
            fontSize: collapsed ? 22 : 22,
            color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          }} />
        </Badge>
        
        {!collapsed && (
          <>
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
          </>
        )}
      </Box>
    </Button>
  );

  // When collapsed, wrap in tooltip to show label on hover
  if (collapsed) {
    return (
      <Tooltip title={label} placement="right" arrow>
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
}

// Main SideNav Component
export default function SideNav() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 1000px)');
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { href: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { href: '/dashboard/courses', icon: CoursesIcon, label: 'Courses' },
    { href: '/dashboard/tasks', icon: TasksIcon, label: 'Tasks' },
    { href: '/dashboard/calendar', icon: CalendarIcon, label: 'Calendar' },
    { href: '/dashboard/activities', icon: ActivitiesIcon, label: 'Activities' },
    { href: '/dashboard/focus-mode', icon: FocusModeIcon, label: 'Focus Mode' },
  ];

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? 80 : 230,
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(8px)',
        display: isMobile ? 'none' : 'flex',
        flexDirection: 'column',
        padding: 2,
        gap: 1,
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 3,
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: collapsed ? 0.5 : 2,
      }}>
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            EasyFlow
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item) => (
          <NavButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
            hovered={hoveredItem === item.href}
            collapsed={collapsed}
            compact={isMobile}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          />
        ))}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        pt: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}>
        <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="right">
          <Button
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              minWidth: 'auto',
              p: 1,
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <SettingsIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}