"use client"
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function CourseDaySelector() {
  const [totalDays, setTotalDays] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof totalDays>) => {
    // Deconstructing
    const { target: { value } } = event;
    setTotalDays(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl color="secondary" sx={{ width: "100%", maxWidth: "320px" }}>
      {/* Hidden input so FormData will include the selected days */}
      <input type="hidden" name="courseDays" value={totalDays.join(',')} />
      <InputLabel id="course-days-input">Course Days</InputLabel>
      <Select
        labelId="course-days-input"
        id="select-weekdays"
        multiple
        value={totalDays}
        onChange={handleChange}
        input={<OutlinedInput label="Course Days" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {weekDays.map((day) => (
          <MenuItem key={day} value={day}>
            <Checkbox checked={totalDays.includes(day)} color='secondary' />
            <ListItemText primary={day} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
