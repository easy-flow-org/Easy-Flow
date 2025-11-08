import { Typography, Box } from "@mui/material"

export default function CourseCard() {
    return <Box sx={{
                boxShadow: '0px 5px 7px 1px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                borderRadius: '1.475rem',
                //borderStyle: 'solid',
                borderColor: '#b9b9b9ff',
                borderWidth: '1px',
                //borderLeft: '4px solid #3987e0ff',
                
                width: '100%',
                height: '7.5rem',
                minWidth: '30.875rem', 
                
                padding: '0rem 1.875rem 0rem 1rem',
                color: 'black',
                backgroundColor: '#F5F5F5',

                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '5rem',
                    height: '5rem',
                    backgroundColor: '#368df11a',
                    borderRadius: '1.25rem',
                    borderColor: '#F5F5F5',
                    borderStyle: 'solid',
                    borderWidth: '4px',
                    boxShadow: '-1px 2px 21px -3px rgba(0, 0, 0, 0.2)',
                }}>
                    <Typography sx={{fontWeight: 700, color: '#0066daff'}}>11</Typography>
                    <Typography sx={{fontWeight: 700, color: '#005ecaff'}}>AM</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.1rem',
                    boxSizing: 'border-box',
                    borderStyle: 'none',
                    borderRadius: '1.25rem',
                    borderColor: '#b9b9b9ff',
                    borderWidth: '1px',
                    width: '100%',
                    padding: '0rem',
                

                }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 20, color: true ? 'black' : '#3987e0ff'}}>Web Design</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#535353ff'}}>Cisc 3150</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#888888ff'}}>Tue, Thu: 1h 15m</Typography>
                </Box>
            </Box>    
}