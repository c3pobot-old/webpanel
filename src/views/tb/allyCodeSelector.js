import React, { useEffect, useState } from 'react'

import { Button, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';

import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

export default function AllyCodeSelector({opts = {}, allyCode, setAllyCode}){
  const { discordId, setSpinner, setAlert } = opts
  const [ allyCodes, setAllyCodes] = useState()

  useEffect(()=>{
    if(!allyCodes || allyCodes?.length === 0) getAllCodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allyCodes])

  async function getAllCodes(){
    setSpinner(true)
    let tempObj = await DB.get('allyCodes')
    if(!tempObj){
      const apiData = await ApiRequest({method: 'getAllyCodes', dId: discordId, data: {}})
      if(apiData?.length > 0){
        tempObj = apiData
        await DB.set('allyCodes', apiData)
      }
    }
    setSpinner(false)
    if(tempObj){
      if(tempObj.length === 1) setAllyCode(tempObj[0].allyCode)
      setAllyCodes(tempObj)
    }else{
      setAlert({type: 'error', msg: 'Error getting allyCodes from the server'})
    }
  }
  if(!allyCodes || allyCodes.length === 0) return(
    <Typography>{'Getting Allycodes from server...'}</Typography>
  )
  if(allyCode) return null
  return (
    <Table>
    <TableBody>
    <TableRow><TableCell sx={{textAlign: 'center'}}><Typography>{"Select Player AllyCode below to work with"}</Typography></TableCell></TableRow>
    {allyCodes.map((item, index)=>(
      <TableRow key={index}><TableCell sx={{textAlign: 'center'}}><Button variant="contained" onClick={()=>setAllyCode(item.allyCode)}>{item.name+' - '+item.allyCode}</Button></TableCell></TableRow>
    ))}
    </TableBody>
    </Table>
  )
}
