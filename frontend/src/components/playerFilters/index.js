import React from 'react';
import {FormControl,InputLabel,MenuItem,Select,Slider,Typography,Box,} from '@mui/material';

const PlayerFilters = ({
  position, setPosition, sortBy,setSortBy,ageRange,setAgeRange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Row with Sort By + Position */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="position">Position</MenuItem>
            <MenuItem value="dob">Date of Birth</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Position</InputLabel>
          <Select
            value={position}
            label="Position"
            onChange={(e) => setPosition(e.target.value)}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Forward">Forward</MenuItem>
            <MenuItem value="Midfield">Midfield</MenuItem>
            <MenuItem value="Defender">Defender</MenuItem>
            <MenuItem value="Goalkeeper">Goalkeeper</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Age Range */}
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
          Age Range
        </Typography>
        <Slider
          value={ageRange}
          onChange={(_, val) => setAgeRange(val)}
          valueLabelDisplay="auto"
          min={10}
          max={50}
        />
      </Box>
    </Box>
  );
};

export default PlayerFilters;
