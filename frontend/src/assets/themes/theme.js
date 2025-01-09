import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  // Custom styling for ListPlayersForTeam
  customStyles: {
    listPlayersForTeam: {
      playerList: {
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        width: '250px',
      },
      playerItem: {
        padding: '8px',
        margin: '5px 0',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
      },
    },
  },
});

export default theme;
