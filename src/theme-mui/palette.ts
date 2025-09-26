// theme/palette.ts

const lightPalette = {
    mode: 'light' as const,
    primary: {
      main: '#0A68DB',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#ffffff',
      secondary: '#F6F6F6'
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
  };
  
  const darkPalette = {
    mode: 'dark' as const,
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      secondary: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  };
  
  export { lightPalette, darkPalette };
  