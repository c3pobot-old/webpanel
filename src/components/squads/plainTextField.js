//react
import React, {useState} from 'react';
import { Button, Table, TableBody, TableCell, TextField, TableRow } from '@mui/material';

export default function PlainTextField (opts = {}){
  const { desc, onSubmit, server } = opts;
  const [ newValue, setValue ] = useState('')
  function onChange(nameKey){
    setValue(nameKey)
  }
  function handleClick (){
    if(newValue === '' || newValue === ""){
      onSubmit()
    }else{
      onSubmit(newValue)
    }
    setValue('')
  }
  return (
    <Table style={{padding: 0, margin: 0, border: 0}}>
      <TableBody>
      {server?.admin &&
        <TableRow>
          <TableCell><TextField onChange={(e)=>onChange(e.currentTarget.value)} value={newValue} label={desc} variant="outlined" /></TableCell>
          <TableCell><Button variant="contained" onClick={handleClick}>Add</Button></TableCell>
        </TableRow>
      }
      </TableBody>
    </Table>
  )
}
