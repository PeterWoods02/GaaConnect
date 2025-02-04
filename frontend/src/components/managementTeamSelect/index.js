import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ManagementTeamSelect = ({ managementTeam, handleManagementChange, managers }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Management Team</InputLabel>
      <Select
        value={managementTeam}
        onChange={handleManagementChange}
        required
      >
        {managers.map(manager => (
          <MenuItem key={manager.id} value={manager.id}>
            {manager.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ManagementTeamSelect;
