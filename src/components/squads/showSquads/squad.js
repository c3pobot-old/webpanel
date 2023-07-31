import React, { Fragment } from 'react'
import { Button, TableBody, TableCell, TableRow, Typography} from '@mui/material';

import UnitRows from 'components/squads/unitRows'

export default function Squad({ opts = {}, squad = {}, getSquadName, openNoteModal }){
  const { setSquad, setUnit, webProfile } = opts
  function selectUnit(unit){
    if(unit?.id){
      setUnit(unit)
      setSquad(squad)
    }
  }
  return(
    <Fragment>
    <TableBody>
      <TableRow sx={{bgcolor: "rowMain.bg"}}>
        <TableCell width='56'>&nbsp;</TableCell>
        <TableCell onClick={()=>setSquad(squad)}><Typography sx={{color: "rowMain.text"}}>{getSquadName(squad)}</Typography></TableCell>
        <TableCell align="center"><Typography sx={{color: "rowMain.text"}}>{(squad.numUnits || squad.units?.length) || 0}</Typography></TableCell>
        <TableCell width="78"><Button variant="contained" onClick={()=>openNoteModal(squad)}>Notes</Button></TableCell>
      </TableRow>
    </TableBody>
    {webProfile?.showSquadUnits && <UnitRows opts={opts} squad={squad} selectUnit={selectUnit} col={2} />}
    </Fragment>
  )
}
