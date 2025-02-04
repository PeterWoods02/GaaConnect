import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import { getManagers } from '../../api/managersApi'; 

const ManagerSelect = ({ value, onChange }) => {
  const [managers, setManagers] = useState([]);

  // fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const managerList = await getManagers();  
        setManagers(managerList);  
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    fetchManagers();
  }, []);  

  return (
    <FormControl fullWidth>
      <InputLabel>Management Team</InputLabel>
      <Select
        label="Management Team"
        name="managementTeam"
        value={value}
        onChange={onChange}
        multiple
        renderValue={(selected) => selected.join(', ')}
      >
        {managers.map((manager) => (
          <MenuItem key={manager._id} value={manager._id}>
            <Checkbox checked={value.indexOf(manager._id) > -1} />
            <ListItemText primary={manager.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ManagerSelect;
