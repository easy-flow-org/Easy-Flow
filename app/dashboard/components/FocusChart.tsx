'use client' // component uses client-only state and random demo data

import { useMemo, useState } from 'react';
import { Box, Select, Typography, MenuItem } from "@mui/material";
import { BarChart } from "@mui/x-charts";

type RangeOption = 'daily' | 'weekly' | 'monthly';

function generateRandomHours(count: number, min = 0.5, max = 8) {
  return Array.from({ length: count }, () => Number((min + Math.random() * (max - min)).toFixed(1)));
}

function getLabelsForRange(range: RangeOption) {
  if (range === 'daily') return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  if (range === 'weekly') return Array.from({ length: 6 }, (_, i) => `Wk ${i + 1}`);
  // monthly: last 6 months short names ending with current month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[d.getMonth()]);
  }
  return labels;
}

export default function FocusChart() {
  const [range, setRange] = useState<RangeOption>('daily');

  const labels = useMemo(() => getLabelsForRange(range), [range]);

  // keep demo data but generate programmatically instead of repeating expressions
  const seriesData = useMemo(() => {
    // choose different typical ranges depending on selection
    if (range === 'daily') return generateRandomHours(labels.length, 0, 8);
    if (range === 'weekly') return generateRandomHours(labels.length, 2, 30); // hours per week
    return generateRandomHours(labels.length, 10, 120); // hours per month
  }, [range, labels.length]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: '.8rem',
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
          <Typography sx={{ fontSize: 14 }}>Focus Mode Progress</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{range === 'daily' ? 'Hours logged per day' : range === 'weekly' ? 'Hours logged per week' : 'Hours logged per month'}</Typography>
        </Box>
        <Select
          id="Range"
          value={range}
          onChange={(e) => setRange(e.target.value as RangeOption)}
          size="small"
          sx={{
            fontSize: 14,
            position: 'relative',
            marginLeft: 'auto',
            minWidth: 110,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000', },
            '&.MuiOutlinedInput-notchedOutline': { borderColor: '#000000', },
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
          id: 'labels',
          data: labels,
          categoryGapRatio: .5,
        }]}
        series={[{
          data: seriesData,
          color: 'url(#gradient)',
        }]}
        height={260}
        borderRadius={8}
        sx={{ width: "100%" }}
      >
        <Gradient />
      </BarChart>
    </Box>
  );
}

function Gradient() {
  return (
    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#96BCFF" />
      <stop offset="100%" stopColor="#5E84FF" />
    </linearGradient>
  );
}