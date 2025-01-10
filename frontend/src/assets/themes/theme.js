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
    pitch: {
      dropZone: {
        position: 'absolute',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        border: '1px dashed #000',
        textAlign: 'center',
        lineHeight: '100px',
        color: '#333',
        fontWeight: 'bold',
      },
    },
  },
});

export default theme;
