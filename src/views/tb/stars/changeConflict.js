import React from 'react'
import { FormControl, MenuItem, Modal, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

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

export default function ChangeConflict({open, setOpen, conflict = {}, conflicts = [], updateZoneConfig }){
  const handleChange = (event: SelectChangeEvent)=>{
    if(event.target.value) updateZoneConfig({
      oldId: conflict.id,
      roundNum: conflict.round,
      id: event.target.value,
      cms: 0,
      platoons: 0
    }, 'edit')
    setOpen(false)
  }
  return (
    <Modal open={open} onClose={()=>setOpen(false)}>
      <TableContainer sx={style}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <FormControl>
                <Select value={conflict.id} onChange={handleChange}>
                  {conflicts?.filter(x=>x.conflictNum === conflict.conflictNum).map((item, index)=>(
                    <MenuItem key={index} value={item.id}>{item.id+' '+item.nameKey}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )
}
