'use client'

import { 
  Button, 
  Typography, 
  Box, 
  alpha, 
  useTheme,
  Badge,
  Tooltip,
  useMediaQuery,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import Link from 'next/link';
import { SvgIconComponent } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import {
  Dashboard as DashboardIcon,
  MenuBook as CoursesIcon,
  TaskAlt as TasksIcon,
  DateRange as CalendarIcon,
  Timeline as ActivitiesIcon,
  Timer as FocusModeIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft,
  Person,
  Notifications,
  Search,
  Logout,
  Lightbulb,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface NavButtonProps {
  href: string;
  icon: SvgIconComponent;
  label?: string;
  badge?: number | null;
  mobile?: boolean;
  active?: boolean;
  hovered?: boolean;
  collapsed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

function NavButton({ 
  href, 
  icon: Icon, 
  label, 
  badge,
  mobile = false,
  active = false,
  hovered = false,
  collapsed = false,
  onMouseEnter,
  onMouseLeave,
  onClick
}: NavButtonProps) {
  const theme = useTheme();

  const buttonContent = (
    <Button
      component={Link}
      href={href}
      fullWidth
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      sx={{
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 2 : 3,
        py: mobile ? 1.5 : 1.8,
        borderRadius: 2,
        textTransform: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: hovered ? alpha(theme.palette.action.hover, 0.3) : 'transparent',
        color: theme.palette.text.primary, // Always black/dark text
        minHeight: 48,
        fontWeight: active ? 600 : 400,
        '&:hover': {
          background: alpha(theme.palette.action.hover, 0.5),
          transform: collapsed ? 'scale(1.05)' : 'translateX(4px)',
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 4,
          height: '60%',
          backgroundColor: active ? theme.palette.primary.main : 'transparent',
          borderRadius: '0 2px 2px 0',
          transition: 'all 0.3s ease',
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
            fontSize: 20,
            color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          }} />
        </Badge>
        
        {!collapsed && (
          <Typography 
            variant="body2" 
            sx={{ 
              flex: 1,
              textAlign: 'left',
              color: theme.palette.text.primary,
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </Typography>
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

// Mobile Navigation Bar
function MobileNav({ onMenuClick }: { onMenuClick: () => void }) {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1,
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={onMenuClick}
            sx={{ 
              color: theme.palette.text.primary,
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}>
              <Lightbulb sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 700,
            }}>
              EasyFlow
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" sx={{ 
            color: theme.palette.text.primary,
          }}>
            <Search />
          </IconButton>
          <IconButton size="small" sx={{ 
            color: theme.palette.text.primary,
          }}>
            <Badge badgeContent={3} color="error" size="small">
              <Notifications />
            </Badge>
          </IconButton>
          <Avatar sx={{ 
            width: 32, 
            height: 32,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}>
            <Person sx={{ fontSize: 16 }} />
          </Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

// Main SideNav Component
export default function SideNav() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 1000px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: DashboardIcon, label: 'Dashboard', badge: null },
    { href: '/dashboard/courses', icon: CoursesIcon, label: 'Courses', badge: 3 },
    { href: '/dashboard/tasks', icon: TasksIcon, label: 'Tasks', badge: 12 },
    { href: '/dashboard/calendar', icon: CalendarIcon, label: 'Calendar', badge: 2 },
    { href: '/dashboard/activities', icon: ActivitiesIcon, label: 'Activities', badge: null },
    { href: '/dashboard/focus-mode', icon: FocusModeIcon, label: 'Focus Mode', badge: 5 },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileItemClick = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile drawer content
  const mobileDrawer = (
    <Box sx={{ 
      width: 280,
      height: '100%',
      background: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Mobile Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}>
              <Lightbulb sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                EasyFlow
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Student Platform
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </Stack>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Stack spacing={1}>
          {navItems.map((item) => (
            <NavButton
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              mobile
              active={pathname === item.href || pathname.startsWith(item.href + '/')}
              hovered={hoveredItem === item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={handleMobileItemClick}
            />
          ))}
        </Stack>
      </Box>

      {/* Mobile Footer */}
      <Box sx={{ 
        p: 3, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                Student Account
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Premium Member
              </Typography>
            </Box>
          </Stack>
          
          <Divider />
          
          <Button
            fullWidth
            startIcon={<SettingsIcon />}
            sx={{
              textTransform: 'none',
              color: theme.palette.text.primary,
              justifyContent: 'flex-start',
              py: 1.5,
            }}
          >
            Settings
          </Button>
          <Button
            fullWidth
            startIcon={<Logout />}
            sx={{
              textTransform: 'none',
              color: theme.palette.text.primary,
              justifyContent: 'flex-start',
              py: 1.5,
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <MobileNav onMenuClick={handleDrawerToggle} />
        <Toolbar /> {/* Spacer for fixed app bar */}
        
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              border: 'none',
            },
          }}
        >
          {mobileDrawer}
        </Drawer>
      </>
    );
  }

  // Desktop version
  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: desktopCollapsed ? 80 : 240,
          background: theme.palette.background.paper,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
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
            background: alpha(theme.palette.divider, 0.5),
            borderRadius: 3,
          },
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: desktopCollapsed ? 3 : 3, 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
        }}>
          <Stack 
            direction={desktopCollapsed ? 'column' : 'row'} 
            alignItems="center" 
            spacing={desktopCollapsed ? 2 : 2}
            justifyContent={desktopCollapsed ? 'center' : 'flex-start'}
          >
            <Box sx={{
              width: desktopCollapsed ? 40 : 48,
              height: desktopCollapsed ? 40 : 48,
              borderRadius: desktopCollapsed ? 2 : 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              flexShrink: 0,
            }}>
              <Lightbulb sx={{ 
                color: 'white', 
                fontSize: desktopCollapsed ? 20 : 24 
              }} />
            </Box>
            
            {!desktopCollapsed && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                }}>
                  EasyFlow
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block',
                }}>
                  Student Platform
                </Typography>
              </Box>
            )}
          </Stack>
          
          {/* Collapse Toggle */}
          <IconButton
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            sx={{
              position: 'absolute',
              top: 12,
              right: desktopCollapsed ? 16 : 12,
              width: 24,
              height: 24,
              background: alpha(theme.palette.action.hover, 0.5),
              color: theme.palette.text.secondary,
              '&:hover': {
                background: alpha(theme.palette.action.hover, 0.8),
                color: theme.palette.text.primary,
              }
            }}
          >
            {desktopCollapsed ? 
              <ChevronLeft sx={{ fontSize: 16, transform: 'rotate(180deg)' }} /> : 
              <ChevronLeft sx={{ fontSize: 16 }} />
            }
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ 
          flex: 1, 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
          {navItems.map((item) => (
            <NavButton
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={pathname === item.href || pathname.startsWith(item.href + '/')}
              hovered={hoveredItem === item.href}
              collapsed={desktopCollapsed}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            />
          ))}
        </Box>

        {/* Footer */}
        {!desktopCollapsed && (
          <Box sx={{ 
            p: 3, 
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ 
                  width: 40, 
                  height: 40,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    noWrap: true,
                  }}>
                    Student Account
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    display: 'block',
                    noWrap: true,
                  }}>
                    student@university.edu
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                startIcon={<SettingsIcon />}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  justifyContent: 'flex-start',
                  py: 1.2,
                  borderRadius: 2,
                  '&:hover': {
                    background: alpha(theme.palette.action.hover, 0.3),
                  }
                }}
              >
                Settings
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Main content spacer */}
      <Box sx={{ 
        marginLeft: desktopCollapsed ? '80px' : '240px',
        transition: 'margin-left 0.3s ease',
      }} />
    </>
  );
}