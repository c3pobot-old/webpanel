import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import ShowCmd from './showCmd'

export default function ShowCmds ({botCmds, open, setOpen}){

  const [ data, setData ] = useState(false);

  function handleClick(obj = {}){
    setData(obj)
    setOpen(true)
  }

  if(botCmds){
    if(open && data) return (
      <ShowCmd botCmd={data} />
    )
    return (
      <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography>Command</Typography></TableCell>
            <TableCell><Typography>Description</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {botCmds.map(({name, description, options})=>(
            <TableRow key={name}>
              <TableCell onClick={()=>handleClick({name: name, desc: description, opts: options})}><Typography>/{name}</Typography></TableCell>
              <TableCell><Typography>{description}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    )
  }
  return (
    <Box textAlign="center" pt={5}>Fetching Commands ...</Box>
  )
}
