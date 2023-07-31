//react
import React from 'react';
import { Container, Box, Typography } from '@mui/material';

export default function LogoutSuccess (){
  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>You have been successfully logged out</Typography>
      </Box>
    </Container>
  )
}
