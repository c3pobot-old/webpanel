//react
import React, { Fragment, useState } from 'react';
import { Autocomplete, Button, TableCell, TextField, TableRow } from '@mui/material';
//modules

export default function SearchField ({ array, desc, onSubmit }){
  const [ newValue, setValue ] = useState(null)
  function onChange(nameKey){
    setValue(nameKey)
  }
  function handleClick (){
    onSubmit(newValue)
    setValue(null)
  }
  return (
      <Fragment>
      <TableRow>
        <TableCell>
        <Autocomplete
          value={newValue}
          options={array}
          renderInput={(params)=><TextField {...params} label={desc} variant="outlined"/>}
          onChange={(_, data) => onChange(data)}
        />
        </TableCell>
        <TableCell><Button variant="contained" onClick={handleClick}>Select</Button></TableCell>
      </TableRow>
      </Fragment>
  )
}
