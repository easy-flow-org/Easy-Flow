import { Typography, Box } from "@mui/material"

export default function BaseCard({children} : {children: React.ReactElement}) {
    return <Box sx={{
                boxShadow: '0px 5px 7px 1px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                borderRadius: '1.475rem',
                //borderStyle: 'solid',
                borderColor: '#b9b9b9ff',
                borderWidth: '1px',
                //borderLeft: '4px solid #3987e0ff',
                
                width: '100%',
                height: '100%', 
                
                padding: '0rem 1.875rem 0rem 1rem',
                color: 'black',
                backgroundColor: '#F5F5F5',

                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '1rem'
            }}>
                {children}
            </Box>    
}