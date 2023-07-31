import React, { Fragment } from 'react';
import { Typography } from '@mui/material';
import { TableCell, TableRow } from '@mui/material';

import ShowOpts from './showOpts'

export default function ShowSubGroups ({main, name, description, options}) {
  return (
    <Fragment key={name}>
      <TableRow sx={{bgcolor: "rowMain.bg"}}>
        <TableCell colSpan="2"><Typography sx={{color: "rowMain.text"}}>/{main+' '+name}</Typography></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan="2"><Typography>{description}</Typography></TableCell>
      </TableRow>
      <ShowOpts main={main+' '+name} opts={options}/>
    </Fragment>
  )
}
