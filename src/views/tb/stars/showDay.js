import React, { Fragment, useEffect, useState } from 'react'
import { Table, TableBody, TableRow, TableCell } from '@mui/material';

import ShowConflict from './showConflict'

export default function TbDay({ opts = {}, zoneMap, tbDay, guild = {}, roundMap = [], totalStars, setShowSave, updateZoneConfig }){

  const [ gp, setGp ] = useState({0: 0, 1: 0, 2: 0})
  useEffect(()=>{
    if(roundMap?.length > 0) updateGp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundMap])
  function updateGp(){
    let tempGp = {0: 0, 1: 0, 2: 0}
    for(let i in roundMap){
      if(tempGp[roundMap[i].combatType] >= 0) tempGp[roundMap[i].combatType] += roundMap[i].deployment
    }
    setGp(tempGp)
  }
  if(!roundMap || roundMap?.length === 0) return null
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Undeployed</TableCell>
        </TableRow>
        {gp && gp[0] > 0 &&
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{guild.gp?.toLocaleString()}</TableCell>
            <TableCell>{(guild.gp - gp[0])?.toLocaleString()}</TableCell>
          </TableRow>
        }
        {gp && gp[1] > 0 &&
          <TableRow>
            <TableCell>Char</TableCell>
            <TableCell>{guild.gpChar?.toLocaleString()}</TableCell>
            <TableCell>{(guild.gpChar - gp[1])?.toLocaleString()}</TableCell>
          </TableRow>
        }
        {gp && gp[2] > 0 &&
          <TableRow>
            <TableCell>Ship</TableCell>
            <TableCell>{guild.gpShip?.toLocaleString()}</TableCell>
            <TableCell>{(guild.gpShip - gp[2])?.toLocaleString()}</TableCell>
          </TableRow>
        }
        {roundMap.map((round, index )=>(
          <Fragment key={index}>
            <ShowConflict round={round} zoneMap={zoneMap} setShowSave={setShowSave} updateZoneConfig={updateZoneConfig}/>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
