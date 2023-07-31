import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

import ButtonNav from 'components/buttonNav'

export default function AllyCodeNoMatch () {

  const [ allyCode ] = useState(localStorage.getItem('allyCode'))
  const [ playerName ] = useState(localStorage.getItem('playerName'))

  localStorage.removeItem('allyCode')
  localStorage.removeItem('playerName')

  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
      <Typography>Your AllyCode {allyCode}{playerName ? ' for player '+playerName:''} did not match the allyCode pulled from the game</Typography>
      <Typography>Click button below to try again</Typography>
    </Box>
    <Box textAlign="center"><Button variant="contained" onClick={()=>ButtonNav('/google')}>Link Google</Button></Box>
    </Container>
  )
}
