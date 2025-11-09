'use client' // because using random() demo data for now, there would be a nextJS error, mismatch between server and client content

import { Box, Select, Typography, MenuItem } from "@mui/material";
import { BarChart } from "@mui/x-charts";

export default function FocusChart() {
    return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '1rem',
    }}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        }}> 
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: 'auto',
            }}>
                <Typography>Daily Focus Mode Progress</Typography>
                <Typography>Pomodoros logged per day</Typography>
            </Box>
            <Select 
                id="Range"
                value={"daily"}
                sx={{
                    position: 'relative',
                    marginLeft: 'auto',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000',},
                    '&.MuiOutlinedInput-notchedOutline': { borderColor: '#000000',},
                    '&:focus': {
                        borderRadius: 4,
                        borderColor: '#80bdff',
                        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
                    },
                }}
            >
                <MenuItem value={'daily'}>Daily</MenuItem>
                <MenuItem value={'weekly'}>Weekly</MenuItem>
                <MenuItem value={'monthly'}>Monthly</MenuItem>
            </Select>
        </Box>
        <BarChart 
            xAxis={[{
                id: 'days',
                data: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                categoryGapRatio: .5,
            }]}
            series={[{
                data: [8 + Math.random()*15, 8 + Math.random()*15, 8 + Math.random()*15, 8 + Math.random()*15, 8 + Math.random()*15, 8 + Math.random()*15, 8 + Math.random()*15],
                color: 'url(#gradient)',
            }]}
            height={300}
            borderRadius={10}
            sx={{ width: "100%"}}
        >
            <Gradient/>
        </BarChart>
    </Box>
    );
}

function Gradient() {
    return (
    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#96BCFF"/>
        <stop offset="100%" stopColor="#5E84FF"/>
    </linearGradient>
    );
}