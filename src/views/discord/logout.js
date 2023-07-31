//react
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';

import ButtonNav from 'components/buttonNav'
import { DeleteCookie } from 'components/cookies'
import DB from 'components/db'

export default function Logout (opts = {}) {
  //hooks
  const { setSpinner, setWebProfile } = opts;
  const [ status, setStatus ] = useState(false);
  //effects
  async function clearAuth (){
    setSpinner(true)
    await DeleteCookie('discordId', {path: '/'})
    await localStorage.clear()
    await sessionStorage.clear()
    await DB.clear()
    await setWebProfile(null)
    setSpinner(false)
    setStatus(true)
  }
  useEffect(()=>{
    clearAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if(status) return (
    ButtonNav('/discord/logoutSuccess')
  )
  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>Logging you out please wait...</Typography>
      </Box>
    </Container>
  )
}
