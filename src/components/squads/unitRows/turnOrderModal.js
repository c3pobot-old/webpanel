import React, { useState } from 'react'
import { Modal, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
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
const turnOrderOpts = ['1','2','3','4','5','6','7','8','9','10','delete']
export default function TurnOrderModal ({open, setOpen, unit, setTurnOrder}) {
  const [value, setValue] = useState(unit?.turn?.toString() || '')
  async function handleChange (event){
    if(event.target.value > 0){
      await setValue(event.target.value)
      setTurnOrder(unit, event.target.value)
    }else{
      if(event.target.value === 'delete'){
        await setValue('')
        setTurnOrder(unit, null)
      }
    }
  }
  return(
    <Modal open={open} onClose={()=>setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <TableContainer sx={style}>
    <Table>
    <TableBody>
      <TableRow><TableCell>{unit?.nameKey}</TableCell></TableRow>
      <TableRow>
        <TableCell>
          <Select labelId="turn-order-select-label" id="turn-order" value={value} label='Turn Order' onChange={handleChange}>
          {turnOrderOpts?.map((turnOrder, index)=>(
            <MenuItem value={turnOrder} key={index}>{turnOrder}</MenuItem>
          ))}
          </Select>
        </TableCell>
      </TableRow>
    </TableBody>
    </Table>
    </TableContainer>
    </Modal>
  )
}
