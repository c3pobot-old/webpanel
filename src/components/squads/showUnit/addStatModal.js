//React
import React, { useState } from 'react';
import { Autocomplete, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from '@mui/material';

import { enumStats } from './enumStat'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AddStatModal ({open, setOpen, addStat, unit}){
  const [ newValue, setValue ] = useState({min: '', max: '', nameKey: null});

  function handleAddClick (){
    if(newValue.nameKey){
      const tempStat = enumStats.find(x=>x.nameKey === newValue.nameKey)
      if(tempStat) addStat({...newValue,...tempStat})
    }
    setOpen(false)
  }
  function onChange(data){
    setValue({...newValue, ...data})
  }
  function onNameChange(nameKey){
    setValue({...newValue, nameKey: nameKey})
  }
  return (
    <Modal open={open} onClose={()=>setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="2"><Typography>Add Stat for {unit?.nameKey}</Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan="2">
              <Autocomplete value={newValue.nameKey} options={enumStats.map(s=>s.nameKey)} renderInput={(params)=><TextField {...params} label="New Stat" variant="outlined"/>} onChange={(_, data) => onNameChange(data)}/>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TextField type="number" onChange={(e)=>onChange({min: e.currentTarget.value})} value={newValue.min} label="Min Value" variant="outlined" /></TableCell>
            <TableCell><TextField type="number" onChange={(e)=>onChange({max: e.currentTarget.value})} value={newValue.max} label="Max Value" variant="outlined" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell textalign="center" colSpan="2"><Button variant="contained" onClick={handleAddClick}>Add</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )
}
