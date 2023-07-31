import React from 'react'
import { Button, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';

const enumError = {
  'error': 'Error occcured. Please click below to try again',
  'nodiscordlink': 'The provided allyCode is not linked to your discordId',
  'allyCodeNoMatch': 'The allyCode from the game did not match the allyCode you provided',
  'success': 'Game account has been successfully linked'
}
export default function ShowError({ opts = {}, code, setEmail, setCode }){
  function handleClick(){
    setEmail(false)
    setCode(null)
  }
  if(!code || !enumError[code]) return null
  return (
    <Table>
      <TableBody>
        <TableRow><TableCell><Typography>{enumError[code]}</Typography></TableCell></TableRow>
        {code !== 'success' && <TableRow><TableCell><Button variant="contained" onClick={handleClick}>Retry</Button></TableCell></TableRow>}
      </TableBody>
    </Table>
  )
}
