import React, { useEffect, useState } from 'react'
import { Button, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';

import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

export default function TBSelector({ opts = {}, setTB }){
  const { discordId, setAlert, setSpinner } = opts;
  const [ tbs, setTbs ] = useState()
  useEffect(()=>{
    if(!tbs) getTBs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tbs])
  async function getTBs(){
    setSpinner(true)
    let tempObj = await DB.get('tb-nameKeys')
    if(!tempObj){
      const apiData = await ApiRequest({ method: 'mongo', dId: discordId, data: {method: 'get', collection: 'autoComplete', query: {_id: 'tb-name'}}})
      if(apiData[0]?.data?.length > 0){
        await DB.set('tb-nameKeys', apiData[0].data)
        tempObj = apiData[0].data
      }
    }
    setSpinner(false)
    if(tempObj?.length > 0){
      setTbs(tempObj)
    }else{
      setAlert({type: 'error', msg: 'Error getting TB info from server'})
    }
  }
  if(!tbs || 1 > tbs?.length) return (
    <Typography>{'Getting Data from server...'}</Typography>
  )
  return(
    <Table>
    <TableBody>
    <TableRow><TableCell sx={{textAlign: 'center'}}><Typography>{"Select TB below"}</Typography></TableCell></TableRow>
    {tbs.map((tb, index)=>(
      <TableRow key={index}><TableCell sx={{textAlign: 'center'}}><Button variant="contained" onClick={()=>setTB(tb)}>{tb.name}</Button></TableCell></TableRow>
    ))}
    </TableBody>
    </Table>
  )
}
