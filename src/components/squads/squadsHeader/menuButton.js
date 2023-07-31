import React, { Fragment, useState } from 'react';
import { TableCell } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import IconMenu from 'components/iconMenu'

export default function MenuButton({ menuItems = [], onSubmit}){

  const [ anchorElNav, setAnchorElNav ] = useState();
  function handleSubmit (obj) {
    setAnchorElNav(null)
    if(obj && onSubmit) onSubmit(obj)
  }
  return (
    <Fragment>
      {menuItems?.length > 0 && <IconMenu anchorElNav={anchorElNav} setAnchorElNav={setAnchorElNav} menuItems={menuItems} handleSubmit={handleSubmit}/>}
      <TableCell width="25"><MenuIcon onClick={(event)=>setAnchorElNav(event.currentTarget)}/></TableCell>
    </Fragment>

  )
}
