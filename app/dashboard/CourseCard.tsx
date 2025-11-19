import { Typography, Box } from "@mui/material"

export default function CourseCard() {
    return <Box sx={{
                boxShadow: '0px 5px 7px 1px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                borderRadius: '1.475rem',
                borderStyle: 'solid',
                borderColor: '#c5c5c5b4',
                borderWidth: '1px',
                //borderLeft: '4px solid #3987e0ff',
                
                width: '100%',
                height: '6rem',
                minWidth: '24.7rem', 
                
                padding: '0rem 1.5rem 0rem .8rem',
                color: 'black',
                backgroundColor: '#F5F5F5',

                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '.8rem'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: '#368df11a',
                    borderRadius: '1rem',
                    borderColor: '#F5F5F5',
                    borderStyle: 'solid',
                    borderWidth: '4px', // untouched
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
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: true ? 'black' : '#3987e0ff'}}>Web Design</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#535353ff'}}>Cisc 3150</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#888888ff'}}>Tue, Thu: 1h 15m</Typography>
                </Box>
            </Box>    
}