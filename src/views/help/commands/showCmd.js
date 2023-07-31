import React from 'react';
import { Box, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import ShowOpts from './showOpts'

export default function ShowCmd ({botCmd}){
  const {name, desc, opts} = botCmd


  if(name){
    return (
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow sx={{bgcolor: "rowMain.bg"}}>
              <TableCell colSpan="2" ><Typography sx={{color: "rowMain.text"}}>/{name}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan="2"><Typography>{desc}</Typography></TableCell>
            </TableRow>
            <ShowOpts main={name} opts={opts} />

          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  return (
    <Box textAlign="center" pt={5}>Fetching Commands ...</Box>
  )
}
/*
<ShowSubCmds main={name} subCmds={opts.filter(x=>x.type === 1)}/>
<ShowSubGroups main={name} subCmds={opts.filter(x=>x.type === 2)}/>
*/
