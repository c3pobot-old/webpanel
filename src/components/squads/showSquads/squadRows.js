import React, { useEffect, useState } from "react";
import { Button, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function UnitRows({ opts = {}, squadList = [], getSquadName, selectSquad, updateSquadOrder, openNoteModal }){
  const [ squads, setSquads ] = useState(squadList || []);
  useEffect(()=>{
    setSquads(squadList || [])
  }, [squadList])

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
      squads,
      result.source.index,
      result.destination.index
    );
    setSquads(items)
    updateSquadOrder(items)
  }
  function Row ({squad, index}){
    return(
      <Draggable draggableId={index.toString()} index={index}>
        {(provided, snapshot) => (
            <TableRow  sx={snapshot.isDragging ? {bgcolor: "rowMain.bg"}:{}} ref={provided.innerRef} {...provided.draggableProps}>
              <TableCell {...provided.dragHandleProps} width='56'><ReorderIcon/></TableCell>
              <TableCell onClick={()=>selectSquad(squad)}><Typography sx={snapshot.isDragging ? {color: "rowMain.text"}:{}}>{getSquadName(squad)}</Typography></TableCell>
              <TableCell align="center"><Typography sx={{color: "rowMain.text"}}>{(squad?.numUnits || squad?.units?.length) || 0}</Typography></TableCell>
              <TableCell width="78"><Button variant="contained" onClick={()=>openNoteModal(squad)}>Notes</Button></TableCell>
            </TableRow>
        )}
      </Draggable>
    )
  }
  if(squads?.length === 0) return null

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot)=>(
          <TableBody {...provided.droppableProps} ref={provided.innerRef} >
            {squads?.length > 0 && squads?.map((squad, index)=>{
              return <Row squad={squad} index={index} key={index} />
            })}
            {squads?.length > 0 && provided.placeholder}
          </TableBody>
        )}
      </Droppable>
    </DragDropContext>
  )
}
