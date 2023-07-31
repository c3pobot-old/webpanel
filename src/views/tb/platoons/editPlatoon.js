import React from 'react'


import { Button, FormControl, MenuItem, Modal, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';

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
export default function UpdatePlatoon({ open, setOpen, pDef = [], platoon = {}, changePlatoon}){
  const handleChange = (event: SelectChangeEvent)=>{
    changePlatoon(false, platoon.id, event.target.value)
  }
  return (
    <Modal open={open} onClose={()=>setOpen(false)}>
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="2"><Typography>Include/Exclude of change Platoon {platoon.id+' '+platoon.nameKey} </Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell><Button variant="contained" onClick={()=>changePlatoon(null, platoon.id)}>Include</Button></TableCell></TableRow>
          <TableRow><TableCell><Button variant="contained" onClick={()=>changePlatoon('exclude', platoon.id)}>Exclude</Button></TableCell></TableRow>
          <TableRow><TableCell><Button variant="contained" onClick={()=>changePlatoon('prefilled', platoon.id)}>Prefilled</Button></TableCell></TableRow>
          <TableRow><TableCell>
          <FormControl>
          <Select value={platoon.id} onChange={handleChange}>
            {pDef?.filter(x=>x?.conflict === platoon.conflict)?.map((item, index)=>(
              <MenuItem value={item.id} key={index}>{item.id+' '+item.nameKey}</MenuItem>
            ))}
          </Select>
          </FormControl>
          </TableCell></TableRow>
          <TableRow><TableCell><Button variant="contained" onClick={()=>setOpen(false)}>Cancel</Button></TableCell></TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )
}
