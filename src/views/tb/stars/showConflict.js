import React, { Fragment, useEffect, useState } from 'react'
import { Button, Slider, TableRow, TableCell, TextField, Typography } from '@mui/material'
import { NumericFormat } from "react-number-format";

import ChangeConflict from './changeConflict'
const conflictSx = {
  bgcolor: 'white',
  color: 'black'
}
const marks = [
  {
    value: 0,
    label: '0*'
  },
  {
    value: 1,
    label: '1*'
  },
  {
    value: 2,
    label: '2*'
  },
  {
    value: 3,
    label: '3*'
  }
]
function pointsToNextStar(rewards = [], currentStar, points){
  let neededPoints = 0
  if(currentStar < 3) neededPoints = rewards.find(x=>x.star === currentStar + 1)?.points || 0
  if(neededPoints) neededPoints -= points
  return neededPoints
}
export default function ShowConflict({round = {}, zoneMap = [], setShowSave, updateZoneConfig}){
  /*
  const marks = round?.victoryPointRewards.map(x=>{
    return Object.assign({}, {
      value: +x.star,
      label: x.points?.toLocaleString()+' ('+x.star+'*)'
    })
  })
  marks.unshift({value: 0, label: '0 (0*)'})
  */
  const [ totalPoints, setTotalPoints ] = useState(round.totalPoints)
  const [ preload, setPreload ] = useState(round.preload)
  const [ deployment, setDeployment ] = useState(round.deployment || 0)
  const [ platoons, setPlatoons ] = useState(round.platoons || 0)
  const [ cms, setCM ] = useState(round.cms || 0)
  const [ star, setStar ] = useState(round.star || 0)
  const [ showUpdate, setShowUpdate ] = useState(false)
  const [ pointsToStar, setPointsToStar ] = useState(0)
  const [ open, setOpen ] = useState(false)
  useEffect(()=>{
    setShowUpdate(false)
    setShowSave(true)
    setTotalPoints(round.totalPoints)
    setPreload(round.preload)
    setStar(round.star || 0)
    setCM(round.cms || 0)
    setPlatoons(round.platoons || 0)
    setDeployment(round.deployment || 0)
    setPointsToStar(pointsToNextStar(round.victoryPointRewards, round.star, round.totalPoints))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])
  useEffect(()=>{
    if(+platoons !== +round.platoons || +cms !== +round.cms || +star !== +round.star){
      setShowUpdate(true)
      setShowSave(false)
    }else{
      setShowUpdate(false)
      setShowSave(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ platoons, cms, star ])

  function handleSlider( event, newValue){
    setStar(newValue)
    if(newValue === 0){
      setPreload(true)
    }else{
      setPreload(false)
    }
  }
  function updateCalc(){
    updateZoneConfig({
      id: round.id,
      roundNum: round.round,
      platoons: +platoons,
      cms: +cms,
      preload: preload,
      prefered: +star
    })
  }

  return (
    <Fragment>
      {round?.round > 0 && open && <ChangeConflict open={open} setOpen={setOpen} conflicts={zoneMap} conflict={round} updateZoneConfig={updateZoneConfig}/>}
      <TableRow >
        <TableCell sx={conflictSx} colSpan={2}>
          <Typography onClick={()=>setOpen(true)}>{round.id+' '+round.type+' '+round.nameKey+' '+totalPoints+' '+star+'*'}</Typography>
          {pointsToStar > 0 && <Typography>{pointsToStar?.toLocaleString()+' to '+(round.star + 1)+'*'}</Typography>}
        </TableCell>
        <TableCell sx={conflictSx}>
          {showUpdate && <Button variant="contained" onClick={updateCalc} sx={{textAlign: 'center'}}>Recalculate</Button>}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>
          <NumericFormat customInput={TextField} thousandSeparator value={deployment} label='Deployment' variant='outlined'/>
          <NumericFormat customInput={TextField} thousandSeparator onValueChange={(ev)=>setPlatoons(ev.floatValue)} value={platoons} label={'Platoon'} variant="outlined"/>
          <NumericFormat customInput={TextField} thousandSeparator onValueChange={(ev)=>setCM(ev.floatValue)} value={cms} label={'CM'} variant="outlined"/>
        </TableCell>
      </TableRow>
      <TableRow>
        {round.victoryPointRewards?.map((item, index)=>(
          <TableCell key={index}><Typography>{item?.star+'* - '+item?.points?.toLocaleString()}</Typography></TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} sx={{paddingLeft: '50px', paddingRight: '75px'}} >
          <Slider aria-label="Stars" marks={marks} onChange={handleSlider} value={star} step={1} min={0} max={3}/>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
