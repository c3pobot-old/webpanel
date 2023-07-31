//React
import React, { useState } from 'react';
import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from '@mui/material';

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

export default function EditModal ({open, setOpen, editStat, deleteStat, unit, unitStat}){
  const { stat, statIndex } = unitStat;
  if(stat.max !== 0 && !stat.max) stat.max = ''
  const [ newValue, setValue ] = useState(stat);

  function handleDeleteClick (obj){
    setOpen(false)
    deleteStat(stat, statIndex)
  }
  function handleEditClick(){
    setOpen(false)
    editStat(newValue, statIndex)
  }
  function onChange(data){
    setValue({...newValue, ...data})
  }
  return (
    <Modal open={open} onClose={()=>setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="2"><Typography>{unit?.nameKey} {stat?.nameKey}</Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell><TextField type="number" onChange={(e)=>onChange({min: e.currentTarget.value})} value={newValue.min} label="Min Value" variant="outlined" /></TableCell>
            <TableCell><TextField type="number" onChange={(e)=>onChange({max: e.currentTarget.value})} value={newValue.max} label="Max Value" variant="outlined" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell textalign="center"><Button variant="contained" onClick={handleEditClick}>Update</Button></TableCell>
            <TableCell textalign="center"><Button variant="contained" onClick={handleDeleteClick}>Delete</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )

}
