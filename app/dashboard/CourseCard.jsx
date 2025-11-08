import { Paper, Typography } from "@mui/material"

export default function CourseCard() {
    return <Paper elevation={3} 
                    sx={{
                        width: '20rem', 
                        height: '6rem', 
                        backgroundColor: '#f7f7f7ff', 
                        borderRadius: 6
                    }}>
                <Typography></Typography>
            </Paper>    
}