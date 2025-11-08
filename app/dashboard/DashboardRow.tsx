import { Box } from "@mui/material";

export default function DashboardRow({ children, drawerWidth }: {children: React.ReactNode, drawerWidth: number}) {
  return (
    <Box
      sx={{
        height: '45vh',
        borderStyle: 'dashed',
        borderColor: 'red',
        borderLeftStyle: 'dashed',
        flexGrow: 1,
        boxSizing: 'border-box',
        // width: `calc(100% - ${drawerWidth}px)`,
        // ml: `calc(${drawerWidth}px + 0px)`,

        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: '2rem',
        gap: '2rem'
      }}>
      {children}
    </Box>
  )
}