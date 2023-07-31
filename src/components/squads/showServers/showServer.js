import React from 'react';
import { Checkbox, TableCell, TableRow, Typography} from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export default function ShowServer({ opts = {}, data = {}, type}){
  const { server, setServer } = opts;
  return(
    <TableRow>
      <TableCell><Typography><Checkbox checked={data.id === server?.id} onClick={()=>setServer(data)}/></Typography></TableCell>
      <TableCell onClick={()=>setServer(data)}><Typography>{data.name}</Typography></TableCell>
      <TableCell><Typography>{type}</Typography></TableCell>
      <TableCell><Typography>{data.admin ? <CheckBoxIcon />:<DisabledByDefaultIcon />}</Typography></TableCell>
    </TableRow>
  )
}
