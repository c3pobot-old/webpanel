import React, { useState } from 'react';
import { Autocomplete, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';

export default function AutoTextField({array = [], onSelect, desc}){
  const [ newValue, setValue ] = useState(null)
  function onChange(nameKey){
    setValue(nameKey)
  }
  function handleSelect(){
    if(onSelect && newValue){
      onSelect(newValue)
      setValue(null)
    }
  }
  return (
    <Table style={{padding: 0, margin: 0, border: 0}}>
      <TableBody>
        <TableRow>
          <TableCell><Autocomplete value={newValue} options={array} renderInput={(params)=><TextField {...params} label={desc} variant="outlined"/>} onSelect={()=>handleSelect()} onChange={(_, data) => onChange(data)}/></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
