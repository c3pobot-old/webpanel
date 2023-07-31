import React, { useEffect, useState } from "react";
import { Checkbox, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import UpdateUnitOrder from './updateUnitOrder'
import TurnOrderModal from './turnOrderModal'
export default function UnitRows({ opts = {}, squad = {}, selectUnit, col }){
  const { server } = opts
  const [ units, setUnits ] = useState(squad.units || []);
  const [ editTurnOrderOpen, setEditTurnOrderOpen ] = useState(false);
  const [ unitTurnOrderEdit, setUnitTurnOrderEdit ] = useState(null);
  useEffect(()=>{
    setUnits(squad.units || [])
  }, [squad.units])

  function handleLeader(unit){
    if(server.admin){
      let tempUnits = JSON.parse(JSON.stringify(units))
      tempUnits = tempUnits.map(s=>({...s, leader: false}))
      if(!unit.leader){
        unit.leader = true
        tempUnits = tempUnits.filter(x=>x.id !== unit.id)
        tempUnits.unshift(unit)
      }
      setUnits(tempUnits)
      UpdateUnitOrder(opts, tempUnits, JSON.parse(JSON.stringify(squad)))
    }
  }
  async function handleTurnOrder(tempUnit){
    await setUnitTurnOrderEdit(tempUnit)
    setEditTurnOrderOpen(true)
  }
  async function setTurnOrder(tempUnit, num){
    if(tempUnit){
      tempUnit.turn = +num
      let tempUnits = JSON.parse(JSON.stringify(units))
      let unitIndex = tempUnits.findIndex(x=>x.id === tempUnit.id)
      if(unitIndex >= 0) tempUnits[unitIndex] = tempUnit
      setUnitTurnOrderEdit(null)
      setUnits(tempUnits)
      UpdateUnitOrder(opts, tempUnits, JSON.parse(JSON.stringify(squad)))
      setEditTurnOrderOpen(false)
    }

  }
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      units,
      result.source.index,
      result.destination.index
    );
    setUnits(items)
    UpdateUnitOrder(opts, items, JSON.parse(JSON.stringify(squad)))
  }
  function Row ({unit, index}){
    return(
      <Draggable draggableId={index.toString()} index={index}>
        {(provided, snapshot) => (
            <TableRow  sx={snapshot.isDragging ? {bgcolor: "rowMain.bg"}:{}} ref={provided.innerRef} {...provided.draggableProps}>
              <TableCell {...provided.dragHandleProps} width='25'><ReorderIcon/></TableCell>
              <TableCell onClick={()=>selectUnit(unit, squad)}><Typography sx={snapshot.isDragging ? {color: "rowMain.text"}:{}}>{unit.nameKey}</Typography></TableCell>
              <TableCell align="center"><Checkbox checked={false} onClick={()=>handleLeader(unit)}/></TableCell>
              <TableCell onClick={()=>handleTurnOrder(unit)} align="center">{unit.turn ? unit.turn:''}</TableCell>
            </TableRow>
        )}
      </Draggable>
    )
  }
  if(units?.length === 0) return null
  if(!server.admin) return(
    <TableBody>
    <TableRow>
      <TableCell>&nbsp;</TableCell>
      <TableCell><Typography>Unit</Typography></TableCell>
      <TableCell><Typography>Leader</Typography></TableCell>
    </TableRow>
    {units?.length > 0 && units?.map((unit)=>(
      <TableRow key={unit.id}>
        <TableCell width='25'></TableCell>
        <TableCell onClick={()=>selectUnit(unit, squad)}><Typography>{unit.nameKey}</Typography></TableCell>
        <TableCell align="center"><Checkbox checked={unit.leader ? true:false} onClick={()=>handleLeader(unit)}/></TableCell>
        <TableCell align="center">{unit.turn ? unit.turn:''}</TableCell>
      </TableRow>
    ))}
    </TableBody>
  )
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot)=>(
          <TableBody {...provided.droppableProps} ref={provided.innerRef} >
            {editTurnOrderOpen && <TurnOrderModal open={editTurnOrderOpen} setOpen={setEditTurnOrderOpen} unit={unitTurnOrderEdit} setTurnOrder={setTurnOrder}/>}
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell><Typography>Unit</Typography></TableCell>
              <TableCell align="center"><Typography>Leader</Typography></TableCell>
              <TableCell align="center"><Typography>Turn Order</Typography></TableCell>
            </TableRow>
            {units?.length > 0 && units?.map((unit, index)=>{
              if(unit.leader){
                return (
                  <TableRow key={unit.id}>
                    <TableCell></TableCell>
                    <TableCell onClick={()=>selectUnit(unit, squad)}><Typography>{unit.nameKey}</Typography></TableCell>
                    <TableCell align="center"><Checkbox checked={true} onClick={()=>handleLeader(unit)}/></TableCell>
                    <TableCell onClick={()=>handleTurnOrder(unit)} align="center">{unit.turn ? unit.turn:''}</TableCell>
                  </TableRow>)
              }else{
                return <Row unit={unit} index={index} key={index} />
              }
            })}
            {units?.length > 0 && provided.placeholder}
          </TableBody>
        )}
      </Droppable>
    </DragDropContext>
  )
}
