import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

import ButtonNav from 'components/buttonNav'

export default function Code3Error () {

  localStorage.removeItem('allyCode')
  localStorage.removeItem('playerName')

  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
      <Typography>Oh dear! Unforunatly you recieved the dreaded Code 3 400 Bad Request Error.</Typography>
      <Typography>This means you will not be able to link you google account to the bot. It is an issue caused by EA/CG</Typography>
      <Typography>I was able to authenticate to google however CG rejected the way the bot uses your google credentials to authenticate to the game.</Typography>
      <Typography>Your only option at this point is to try the "Guest Auth" Linking</Typography>
    </Box>
    <Box textAlign="center"><Button variant="contained" onClick={()=>ButtonNav('/guestAuth')}>Link Guest Auth</Button></Box>
    </Container>
  )
}
