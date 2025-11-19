'use client'

import { Box, Container, Paper, Typography, useMediaQuery} from "@mui/material";
import { BarChart } from "@mui/x-charts"
import DashboardRow from "./DashboardRow";
import CourseCard from "./CourseCard"
import BaseCard from "./BaseCard";
import FocusChart from "./FocusChart";


let user: string = 'user';

interface Course {
  title: string;
  id: string;
  startTime: number;
  weekdays: string[];
}

const Course1: Course = {
  title: "Web Design",
  id: "Cisc 3150",
  startTime: 11 * 60, // 11 AM
  weekdays: ['Tu', "Th"],
}

export default function Dashboard() {
  const isSmall = useMediaQuery('(max-width:1000px)');
  const drawerWidth: number = isSmall ? 0 : 228;


  return (
    <Box sx={{
        height: '100vh',
        flexGrow: 1,
        boxSizing: 'border-box',
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `calc(${drawerWidth}px + 0px)`,
        backgroundColor: true ? '#e2e2e2ff': '#ddddddff',
        paddingBottom: '2rem',
        paddingTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
      <Box sx={{
        height: 'auto',
        paddingLeft: '35px',
      }}>
        <Typography variant="h3" sx={{fontWeight: 700}}>Welcome back, {user}</Typography>
      </Box>
      <DashboardRow drawerWidth={drawerWidth}>
        <Box sx={{  
                  alignSelf: 'stretch', 
                  flexGrow: 0, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  gap: 2,
                  }}>
          <CourseCard/>
          <CourseCard/>
          <CourseCard/>
        </Box>
        <Box sx={{ alignSelf: 'stretch', flexGrow: 1 }}>
          <BaseCard>
            <FocusChart/>
          </BaseCard>
        </Box>
      </DashboardRow>
      <DashboardRow drawerWidth={drawerWidth}>
        <Box sx={{ alignSelf: 'stretch', flexGrow: 1 }}>
          <BaseCard><></></BaseCard>
        </Box>
        <Box sx={{ alignSelf: 'stretch', flexGrow: 1 }}>
          <BaseCard><></></BaseCard>
        </Box>
      </DashboardRow>
    </Box>
  )
}

{/* get rid of the hover effects soon */}