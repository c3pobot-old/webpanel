import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ArrayToText ({message}) {
  if(Array.isArray(message)) return (
    <Box textAlign="center">{message.map(({msg, id})=>(
      <Typography key={id}>{ msg }</Typography>
    ))}</Box>
  )
  return (
    <Typography>{ message }</Typography>
  )
}
