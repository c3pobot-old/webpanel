//react
import React, { useState } from 'react';
import { Typography} from '@mui/material';
import { TableBody, TableCell, TableRow} from '@mui/material';
//modules
//local
import ConfirmAction from 'components/confirmAction'
import ShowMenu from 'components/showMenu'

export default function GetAllyRow ({ name, allyCode, type, handleEdit, pri, alt, buttonNav}){
  const [ userACStatus, setACMenuStatus ] = useState(false);
  const [ dialogMsg, setDialogMsg ] = useState({open:false});
  const [ editAllyCode, setEditAllyCode ] = useState(false);

  function handleMenuClose (obj) {
    setACMenuStatus(false)
    if(obj){
      if(obj.path){
        if(obj.allyCode) localStorage.setItem('allyCode', obj.allyCode)
        if(obj.playerName) localStorage.setItem('playerName', obj.playerName)
        buttonNav(obj.path)
      }else{
        setEditAllyCode(obj)
        setDialogMsg({open: true, msg: obj?.dialogMsg || 'Are you sure you want to do this?'})
      }
    }
  }
  function handleDialogClose (value) {
    const opts = editAllyCode
    setDialogMsg({open:false})
    if(value && opts?.method) handleEdit(opts)
    setEditAllyCode(false)
  };
  function GetAllyMenu ({allyCode, name, type}){
    const opt = {
      array: [{name: 'Remove AllyCode', value: {method: 'editAllyCode', data: {method:'remove', allyCode: allyCode}, dialogMsg: 'Are you sure you want to unlink allyCode '+allyCode+' ?'}, id:allyCode+'-remove'}],
      open: userACStatus,
      title: 'allyCode '+allyCode+' Options',
      onClose: handleMenuClose
    }
    if(type) opt.array.push({
      name: 'Unlink '+(type === 'google' ? 'Google':'Code'),
      value: {method: 'editAllyCode', data: {method: 'removeAuth', allyCode: allyCode}, dialogMsg: 'Are you sure you want to remove '+(type === 'google'? 'Google':'Code')+' Auth for allyCode '+allyCode+ '?'}
    })
    opt.array.push({
      name: 'Link Google Auth',
      value: {path: '/google', allyCode: allyCode, playerName: name}

    })
    opt.array.push({
      name: 'Link Code Auth',
      value: {path: '/codeAuth', allyCode: allyCode, playerName: name}
    })
    return (
      <ShowMenu opt={opt}/>
    )
  }
  return (
    <TableBody>
      <GetAllyMenu allyCode={allyCode} name={name} type={type} />
      <ConfirmAction open={dialogMsg.open} onClose={handleDialogClose} msg={dialogMsg.msg}/>
      <TableRow onClick={()=>setACMenuStatus(true)}>
        <TableCell ><Typography>{name}</Typography></TableCell>
        <TableCell><Typography>{allyCode}</Typography></TableCell>
        <TableCell><Typography>{type ? (type === 'google' ? 'Google':(type === 'codeAuth' ? 'Code':'Guest')):'None'}</Typography></TableCell>
        <TableCell><Typography>{pri === allyCode ? 'Primary':alt === allyCode ? 'Alt':''}</Typography></TableCell>
      </TableRow>
    </TableBody>
  )
}
