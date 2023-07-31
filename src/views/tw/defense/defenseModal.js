//React
import React, { useEffect, useState } from 'react';
import { Checkbox, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from '@mui/material';
import AutoTextField from 'components/squads/autoTextField'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DefenseModal ({open, setOpen, opts={}, unitList = [], zoneDetails = {}, updateZone, clearZone }){
  const { setAlert } = opts;
  const [ unitNameKeys, setUnitNameKeys ] = useState(null)
  const [ zone, setZone ] = useState(zoneDetails)
  useEffect(()=>{
    updateUnitsNameKeys()
  }, [])
  useEffect(()=>{
    updateUnitsNameKeys()
  }, [unitList])
  function handleClearClick (){
    setOpen(false)
    clearZone(zoneDetails.id)
  }
  function handleEditClick(){
    setOpen(false)
    updateZone(zone)
  }
  function updateUnitsNameKeys(){
    if(unitList?.length > 0) setUnitNameKeys(unitList.map(x=>x.nameKey))
  }
  function addSquad(nameKey){
    if(!nameKey) return
    let unit = unitList.find(x=>x.nameKey === nameKey.toString().trim())
    if(!unit) return
    if(zone?.squads.find(x=>x.baseId === unit.baseId)){
      setAlert({type: 'error', msg: unit.nameKey+' is already added'})
      return
    }
    let tempZone = JSON.parse(JSON.stringify(zone))
    tempZone.squads.push({baseId: unit.baseId, thumbnailName: unit.thumbnailName, omi: false, nameKey: unit.nameKey, note: null})
    setZone(tempZone)
  }
  if(!zone) return null
  if(!unitNameKeys || unitNameKeys?.length === 0) return null
  return (
    <Modal open={open} onClose={()=>setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="3"><Typography>{'Zone '+zone.id}</Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{padding: 0, margin: 0, border: 0}} colSpan="3"><AutoTextField array={unitNameKeys} desc='New Squad' onSubmit={addSquad}/></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Leader</TableCell>
            <TableCell>{zone?.combatType === 1 && <Typography>Squad Omi(s)</Typography>}</TableCell>
            <TableCell>s</TableCell>
          </TableRow>
          {zone?.squads?.length > 0 && zone.squads.map((squad, index)=>(
            <TableRow key={index}>
              <TableCell>{squad.nameKey}</TableCell>
              <TableCell>{zone?.combatType === 1 && <Checkbox checked={squad.omi}/>}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align="center"><Button variant="contained" onClick={handleEditClick}>Update</Button></TableCell>
            <TableCell align="center"><Button variant="contained" onClick={()=>setOpen(false)}>Cancel</Button></TableCell>
            <TableCell align="center"><Button variant="contained" onClick={handleClearClick}>Clear</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )

}
