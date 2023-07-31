import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

export default function Code3Error () {
  const [ allyCode ] = useState(localStorage.getItem('allyCode'))
  const [ playerName ] = useState(localStorage.getItem('playerName'))

  localStorage.removeItem('allyCode')
  localStorage.removeItem('playerName')

  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>An error occured while trying to link your Discord Id to your game account</Typography>
        <Typography>{playerName ? playerName+' with ':''}allyCode {allyCode}.</Typography>
        <Typography>Please let the bot owner know</Typography>
      </Box>
    </Container>
  )
}
