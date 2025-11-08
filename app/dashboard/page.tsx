'use client'

import { Box, Container, Paper, Typography, useMediaQuery} from "@mui/material";
import DashboardRow from "./DashboardRow";
import CourseCard from "./CourseCard"


let user: string = 'user';

export default function Dashboard() {
  const isSmall = useMediaQuery('(max-width:1000px)');
  const drawerWidth: number = isSmall ? 0 : 285;


  return (
    <Box sx={{
        height: '100vh',
        flexGrow: 1,
        boxSizing: 'border-box',
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `calc(${drawerWidth}px + 0px)`,
        
      }}>
      <Box sx={{
        height: '10vh',
      }}>
        <Typography variant="h2">Welcome back, {user}</Typography>
      </Box>
      <DashboardRow drawerWidth={drawerWidth}>
        <Box sx={{  
                  alignSelf: 'stretch', 
                  flexGrow: 1, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  }}>
          <CourseCard/>
          <CourseCard/>
        </Box>
        <Box sx={{ alignSelf: 'stretch', flexGrow: 1 }}></Box>
      </DashboardRow>
      <DashboardRow drawerWidth={drawerWidth}>
        <Box sx={{ alignSelf: 'stretch', flexGrow: 1 }}></Box>
        <Box sx={{ alignSelf: 'stretch', flexGrow: 1 }}></Box>
      </DashboardRow>
    </Box>
  )
}

{/* get rid of the hover effects soon */}