import React, { Fragment } from 'react';
import { Typography } from '@mui/material';
import { TableCell, TableRow } from '@mui/material';

export default function ShowOpt ({name, description, type}) {
  return (
    <Fragment key={name}>
      <TableRow><TableCell colSpan="2"><Typography>Options:</Typography></TableCell></TableRow>
      <TableRow>
        <TableCell><Typography>{name}</Typography></TableCell>
        <TableCell><Typography>{description}</Typography></TableCell>
      </TableRow>
    </Fragment>
  )
}
