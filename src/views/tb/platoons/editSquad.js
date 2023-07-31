import React from 'react'
import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';

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


export default function EditSquad({ open, setOpen, data = {}, pDef = [], changeSquad}){


  return (
    <Modal open={open} onClose={()=>setOpen(false)}>
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="2"><Typography>Include or Exclude {data.squad?.nameKey} Squad {data.squad?.num}</Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell><Button variant="contained" onClick={()=>changeSquad(null, data.platoonId, data.squad?.num)}>Include</Button></TableCell></TableRow>
          <TableRow><TableCell><Button variant="contained" onClick={()=>changeSquad('exclude', data.platoonId, data.squad?.num)}>Exclude</Button></TableCell></TableRow>
          <TableRow><TableCell><Button variant="contained" onClick={()=>changeSquad('prefilled', data.platoonId, data.squad?.num)}>Prefilled</Button></TableCell></TableRow>
          <TableRow><TableCell><Button variant="contained" onClick={()=>setOpen(false)}>Cancel</Button></TableCell></TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )
}
