import React, { useEffect, useState } from 'react'
import { Box, Button, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import DB from 'components/db'

export default function SelectAllyCode({opts = {}, setAllyCode}){
  const { discordId } = opts;
  const [ allyCodes, setAllyCodes ] = useState()
  useEffect(()=>{
    if(!allyCodes) getAllyCodes()
  }, [allyCodes])
  async function getAllyCodes(){
    let tempObj = await DB.get('allyCodes')
    if(!tempObj) tempObj = []
    setAllyCodes(tempObj)
  }
  if(!allyCodes) return (<Typography>Getting allyCodes</Typography>)
  if(allyCodes?.length === 0) return (<Typography>You do not have any allyCodes linked to your discordId</Typography>)
  return(
    <Table>
      <TableBody>
        <TableRow><TableCell sx={{textAlign: 'center'}}><Typography>Please select the allyCode to link</Typography></TableCell></TableRow>
        {allyCodes?.map((item, index)=>(
          <TableRow key={index}><TableCell sx={{textAlign: 'center'}}><Button variant='contained' onClick={()=>setAllyCode(+item.allyCode)}>{item.name+'-'+item.allyCode}</Button></TableCell></TableRow>
        ))}
      </TableBody>
    </Table>

  )
}
