'use client'

import CourseCard from "../CourseCard"
import { Course } from "../../../types/types"
import { Box, Container, Paper, Typography, useMediaQuery, TextField, Button, ButtonGroup} from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from "react";



const courseExample: Course = {
  title: "Web Design",
  id: "Cisc 3150",
  startTime: "11:00 AM",
  endTime: "12:15 PM",
  weekdays: [false, false, true, false, true, false, false],
}

export default function coursePage() {
    const isSmall = useMediaQuery('(max-width:900px)');
    const drawerWidth: number = isSmall ? 0 : 228;
    const [form, setForm] = useState<Course>({ title: "", id: "", startTime: "12:00 AM", endTime: "12:00 AM", weekdays: []});
    const [courses, setCourses] = useState<Course[]>([courseExample]);

    const handleChange = (field: keyof Course) => 
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ 
                ...form,       
                [field]: event.target.value
            });
        };

    const handleAddCourse = () => {
        setCourses( prev => [...prev, {...form}]);
    };
    
    return (
        <Box sx={{
            height: '100vh',
            maxWidth: '100%',
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `calc(${drawerWidth}px + 0px)`,
            backgroundColor: true ? '#e2e2e2ff' : '#ddddddff',
            display: 'flex',
            flexDirection: 'row',
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', width: '500px', gap: '15px', padding: '15px'}}>
                <TextField id="courseTitle" label="Title" variant="outlined" onChange={handleChange("title")}/>
                <TextField id="courseID" label="Course ID" variant="outlined" onChange={handleChange("id")}/>
                <TimePicker name="startTime" label="Start Time" />
                <TimePicker name="endTime" label="End Time" />
                <ButtonGroup variant="outlined" aria-label="Days">
                    <Button>Sun</Button>
                    <Button>Mon</Button>
                    <Button variant="contained">Tue</Button>
                    <Button>Wed</Button>
                    <Button variant="contained">Thu</Button>
                    <Button>Fri</Button>
                    <Button>Sat</Button>
                </ButtonGroup>
                <Button variant="contained" onClick={handleAddCourse}>Add</Button>

            </Box>




            <Box sx={{display: 'flex', flexDirection: 'column', width: '350px', gap: '15px', padding: '15px'}}>
                <CourseCard></CourseCard>
                {courses.map((course) => { return <CourseCard course={course}></CourseCard>})}
            </Box>
        </Box>
    )
}