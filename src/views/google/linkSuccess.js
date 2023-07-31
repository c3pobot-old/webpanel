import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function LinkSuccess () {
  const [ allyCode ] = useState(localStorage.getItem('allyCode'))
  const [ playerName ] = useState(localStorage.getItem('playerName'))
  
  localStorage.removeItem('allyCode')
  localStorage.removeItem('playerName')
  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>Your Discord Id was successfully linked to your google play account for Star Wars Galaxy of Heroes for</Typography>
        <Typography>{playerName ? playerName+' with ':''}allyCode {allyCode}.</Typography>
        <Typography>Note: Antytime you run a bot command requiring this login it will temporarly disconnect your device from the game</Typography>
        <Typography>You can revoke this permission anytime from Google account settings</Typography>
      </Box>
    </Container>
  )
}
