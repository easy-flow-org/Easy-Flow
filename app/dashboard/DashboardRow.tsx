import { Box, useMediaQuery } from "@mui/material";

export default function DashboardRow({ children, drawerWidth }: {children: React.ReactNode, drawerWidth: number}) {
  const isMobile = useMediaQuery('(max-width:1000px)');

  return (
    <Box
      sx={{
        height: isMobile ? '90vh' : '45vh',
        flexGrow: 1,
        boxSizing: 'border-box',
        // width: `calc(100% - ${drawerWidth}px)`,
        // ml: `calc(${drawerWidth}px + 0px)`,

        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',

        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0rem 2rem',
        gap: '2rem'
      }}>
      {children}
    </Box>
  )
}