//React
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from '@mui/material';
import UpdateSquads from './updateSquads'

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

export default function NoteModal ({ opts = {}, open, setOpen, squad }){
  const { server } = opts;
  const [ link, setLink ] = useState('')
  const [ links, setLinks ] = useState(squad.links || [])
  const [ newNote, setNote ] = useState(squad.note || '');

  useEffect(()=>{
    setLinks(squad.links || [])
    setNote(squad.note || '')
    setLink('')
  }, [squad])

  function addLink (){
    if(link !== '' || link !== ""){
      links.push(link.trim())
      setLinks(links)
      setLink('')
    }
  }
  function handleClose(){
    setOpen(false)
  }
  function handleCancelClick (){
    setOpen(false)
    setNote(squad.note || '')
    setLink('')
    setLinks(squad.links || [])
  }
  function removeLink (link){
    setLinks(links.filter(x=>x !== link))
  }
  function handleSaveClick (){
    squad.note = newNote
    if(squad.note === '' || squad.note === "") squad.note = null
    squad.links = links
    squad.change = {type: 'note'}
    UpdateSquads(opts, squad)
    setOpen(false)
  }
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="2"><Typography>Add note and links for squad {squad?.nameKey}</Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          {server.admin ? <TableRow><TableCell colSpan="2"><TextField multiline={true} rows={4} onChange={(e)=>setNote(e.currentTarget.value)} value={newNote} label="New note" variant="outlined"/></TableCell></TableRow>
            :<TableRow><TableCell colSpan="2"><Typography>{newNote}</Typography></TableCell></TableRow>
          }

          {links.length > 0 && links.map((link, linkIndex)=>(
            <TableRow key={linkIndex}>
              <TableCell><a href={link} target="_blank" rel="noreferrer">{link}</a></TableCell>
              <TableCell>{server?.admin ? <Button onClick={()=>removeLink(link)} variant="contained">Remove</Button>:''}</TableCell>
            </TableRow>
          ))}
          {server?.admin ?
            <Fragment>
            <TableRow>
              <TableCell><TextField onChange={(e)=>setLink(e.currentTarget.value)} value={link} label="New Link" variant="outlined" /></TableCell>
              <TableCell><Button onClick={addLink} variant="contained">Add</Button></TableCell>
            </TableRow>
            <TableRow textalign="center">
              <TableCell>{<Button variant="contained" onClick={handleSaveClick}>Update</Button>}</TableCell>
              <TableCell>{<Button variant="contained" onClick={handleCancelClick}>Cancel</Button>}</TableCell>
            </TableRow>
            </Fragment>
          :
          <Fragment>
            <TableRow><TableCell><Button variant="contained" onClick={handleClose}>Close</Button></TableCell></TableRow>
          </Fragment>
        }
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )
}
