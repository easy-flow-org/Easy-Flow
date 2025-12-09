'use client'

import Drawer from '@mui/material/Drawer';
import { 
  AppBar, Toolbar, Box, useMediaQuery, Typography, 
  alpha, useTheme, IconButton, Avatar, AvatarGroup,
  Fade, Zoom, Stack, Badge
} from '@mui/material';
import LogoDevRoundedIcon from '@mui/icons-material/LogoDevRounded';
import NavButton from './NavButton';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  SpaceDashboard, 
  AutoStories, 
  FolderSpecial, 
  CalendarMonth, 
  OfflineBolt,
  Menu as MenuIcon,
  ChevronLeft,
  Lightbulb,
  Notifications,
  Settings,
  Logout,
  Person
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const navItems = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: SpaceDashboard,
    badge: null
  },
  { 
    label: 'Courses', 
    href: '/dashboard/courses', 
    icon: AutoStories,
    badge: 3 // Example badge count
  },
  { 
    label: 'Tasks', 
    href: '/dashboard/tasks', 
    icon: FolderSpecial,
    badge: 12
  },
  { 
    label: 'Calendar', 
    href: '/dashboard/calendar', 
    icon: CalendarMonth,
    badge: 2
  },
  { 
    label: 'Focus Mode', 
    href: '/dashboard/focus-mode', 
    icon: OfflineBolt,
    badge: null
  },
];

export default function SideNav() {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width:1000px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mobileDrawer = (
    <Box sx={{ 
      width: 280,
      height: '100%',
      background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Mobile Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
          }}>
            <Lightbulb sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              EasyFlow
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Student Platform
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Stack spacing={0.5}>
          {navItems.map((item, index) => (
            <Fade in={true} timeout={300 + index * 100} key={item.href}>
              <Box>
                <NavButton 
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  mobile
                  active={pathname === item.href}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  hovered={hoveredItem === item.href}
                />
              </Box>
            </Fade>
          ))}
        </Stack>
      </Box>

      {/* Mobile Footer */}
      <Box sx={{ 
        p: 3, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: alpha(theme.palette.background.paper, 0.8),
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
              <Typography variant="body2" fontWeight={600}>
                Student Account
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Premium Member
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ 
              flex: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              borderRadius: 2,
            }}>
              <Settings fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ 
              flex: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              borderRadius: 2,
            }}>
              <Logout fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: scrolled ? `0 4px 30px ${alpha(theme.palette.common.black, 0.1)}` : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 1,
                  color: theme.palette.text.primary,
                }}
              >
                <MenuIcon />
              </IconButton>
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                }}>
                  <Lightbulb sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  EasyFlow
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderRadius: 2,
              }}>
                <Badge badgeContent={3} color="error">
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>
              <Avatar sx={{ 
                width: 36, 
                height: 36,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}>
                <Person sx={{ fontSize: 20 }} />
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>
        
        <Toolbar /> {/* Spacer */}
        
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          overflow: 'visible',
        },
      }}
    >
      <Box sx={{ 
        width: DRAWER_WIDTH,
        height: '100vh',
        background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Logo & Header */}
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            p: 4, 
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}` },
                  '50%': { boxShadow: `0 4px 30px ${alpha(theme.palette.secondary.main, 0.5)}` },
                  '100%': { boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}` },
                }
              }}>
                <Lightbulb sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px',
                }}>
                  EasyFlow
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Student Productivity Suite
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Fade>

        {/* Navigation Items */}
        <Box sx={{ 
          flex: 1, 
          p: 2,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.divider, 0.1),
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 2,
          },
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ 
            px: 2, 
            py: 1, 
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'block',
          }}>
            Navigation
          </Typography>
          
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            {navItems.map((item, index) => (
              <Zoom in={true} timeout={500 + index * 100} key={item.href}>
                <Box>
                  <NavButton 
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={pathname === item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    hovered={hoveredItem === item.href}
                  />
                </Box>
              </Zoom>
            ))}
          </Stack>

          {/* Additional Sections */}
          <Typography variant="caption" color="text.secondary" sx={{ 
            px: 2, 
            py: 2, 
            mt: 4,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'block',
          }}>
            Tools
          </Typography>
          
          <Stack spacing={0.5}>
            <NavButton 
              href="/dashboard/analytics"
              icon={SpaceDashboard}
              label="Analytics"
              badge={null}
              active={pathname === '/dashboard/analytics'}
            />
            <NavButton 
              href="/dashboard/settings"
              icon={Settings}
              label="Settings"
              badge={null}
              active={pathname === '/dashboard/settings'}
            />
          </Stack>
        </Box>

        {/* User Profile & Footer */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ 
            p: 3, 
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
          }}>
            <Stack spacing={2}>
              {/* User Profile */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ 
                  width: 44, 
                  height: 44,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                }}>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    Student Account
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    student@university.edu
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ 
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                }}>
                  <Logout fontSize="small" />
                </IconButton>
              </Stack>

              {/* Active Users */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Active Study Groups
                </Typography>
                <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: 14,
                    background: alpha(theme.palette.primary.main, 0.8),
                  }}>
                    AJ
                  </Avatar>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: 14,
                    background: alpha(theme.palette.secondary.main, 0.8),
                  }}>
                    MK
                  </Avatar>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: 14,
                    background: alpha(theme.palette.success.main, 0.8),
                  }}>
                    SP
                  </Avatar>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: 14,
                    background: alpha(theme.palette.warning.main, 0.8),
                  }}>
                    +2
                  </Avatar>
                </AvatarGroup>
              </Box>

              {/* Quick Stats */}
              <Stack direction="row" spacing={2} sx={{ 
                background: alpha(theme.palette.primary.main, 0.05),
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    4h
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Today
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h6" fontWeight={700} color="secondary">
                    12
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tasks
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Fade>

        {/* Decorative Corner */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 8,
          height: '100%',
          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          opacity: 0.1,
        }} />
      </Box>
    </Drawer>
  );
}