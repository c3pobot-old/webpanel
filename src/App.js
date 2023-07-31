import './App.css';
import React, { useMemo, useState } from 'react';
import { CssBaseline, } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Views from './views'
import useWebProfile from 'components/useWebProfile';
import NavBar from 'components/navBar'
import ShowSpinner from 'components/spinner'
import ShowAlert from 'components/alert'
function App() {
  const [ webProfile, setWebProfile ] = useWebProfile('webProfile')
  const [ systemTheme, setSystemTheme ] = useState(webProfile?.theme || 'dark');
  const [ spinner, setSpinner ] = useState(false);
  const [ alert, setAlert ] = useState({})
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: systemTheme,
          rowMain: {
            ...(systemTheme === 'light' ? {bg: "#1976d2", text: '#fff' }:{bg: "#272727", text: '#fff'})
          }

        },
      }),
    [systemTheme],
  );

  const opts = {
    systemTheme: systemTheme,
    setSystemTheme: setSystemTheme,
    webProfile: webProfile,
    setWebProfile: setWebProfile,
    spinner: spinner,
    setSpinner: setSpinner,
    setAlert: setAlert
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ShowAlert alert={alert}/>
      <ShowSpinner spinner={spinner}/>
      <NavBar  {...opts}/>
      <Views {...opts}/>
    </ThemeProvider>
  );
}

export default App;
