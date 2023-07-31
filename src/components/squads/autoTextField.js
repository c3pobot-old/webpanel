//react
import React, { useState } from 'react';
import { Autocomplete, Button, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';

export default function AutoTextField ({ array, desc, onSubmit, onSelect, buttonName }){
  const [ newValue, setValue ] = useState(null)
  function onChange(nameKey){
    setValue(nameKey)
  }
  function handleSelect(){
    if(onSelect && newValue) onSelect(newValue)
  }
  function handleClick (){
    onSubmit(newValue)
    setValue(null)
  }
  function handleEvent(k){
    if(k.key === 'Enter') handleClick();
  }
  return (
    <Table style={{padding: 0, margin: 0, border: 0}}>
      <TableBody>
        <TableRow>
          <TableCell><Autocomplete value={newValue} onKeyPress={(k)=>handleEvent(k)} options={array} renderInput={(params)=><TextField {...params} label={desc} variant="outlined"/>} onSelect={()=>handleSelect()} onChange={(_, data) => onChange(data)}/></TableCell>
          {onSubmit && <TableCell><Button variant="contained" onClick={handleClick}>{buttonName || 'Add'}</Button></TableCell>}
        </TableRow>
      </TableBody>
    </Table>
  )
}
