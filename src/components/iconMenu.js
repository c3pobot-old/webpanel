import React, { Fragment } from 'react'
import { Menu, MenuItem, Typography} from '@mui/material';

export default function IconMenu({ anchorElNav, setAnchorElNav, menuItems = [], handleSubmit }){
  function handleClick (newValue){
    handleSubmit(newValue)
    setAnchorElNav(null)
  }
  return(
    <Fragment>
    {Boolean(anchorElNav) &&
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={()=>setAnchorElNav(null)}
        sx={{ mt: '45px' }}
      >
      {Boolean(anchorElNav) && menuItems.map((item, menuIndex)=>(
        <MenuItem key={menuIndex} onClick={()=>handleClick(item.newValue)}>
          <Typography textAlign="center">{item.nameKey}</Typography>
        </MenuItem>
      ))}

      </Menu>
    }
    </Fragment>
  )
}
