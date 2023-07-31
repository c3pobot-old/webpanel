//react
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { SquadsHeader } from 'components/squads'
import RefreshServers from './refreshServers'
import ShowServer from './showServer'

export default function ShowServers (opts = {}) {
  const { spinner, unitList } = opts;
  const [ servers, setServers] = useState(null)

  useEffect(()=>{
    if(!servers && unitList?.length > 0) RefreshServers({...opts,setServers:setServers}, true, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers])

  if(!servers) return(
    <Typography>Getting discord server data from the bot....</Typography>
  )
  return(
    <TableContainer style={{overflowX: 'initial'}} sx={{pb: 7}}>
      <SquadsHeader opts={opts} />
      <Table>
      <TableHead>
        <TableRow>
          <TableCell><Typography>Selected</Typography></TableCell>
          <TableCell><Typography>Name</Typography></TableCell>
          <TableCell><Typography>Type</Typography></TableCell>
          <TableCell><Typography>Admin</Typography></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {servers?.guilds?.map((data, index)=>(<ShowServer opts={opts} data={{id: data.id, name: data.name, type: 'guild', admin: data.admin}} type='Guild' key={data.id}/>))}
        {servers?.servers?.map((data, index)=>(<ShowServer opts={opts} data={{id: data.id, name: data.name, type: 'server', admin: data.admin}} type='Server' key={data.id}/>))}
        {<ShowServer opts={opts} data={{id: 'player', name: 'Player', type: 'player', admin: true}} type='Player'/>}
        {<ShowServer opts={opts} data={{id: 'global', name: 'Global', type: 'global', admin: servers?.botOwner ? true:false}} type='Global'/>}
      </TableBody>
      </Table>
      <Box textAlign="center" pt={2} pb={2}><LoadingButton loading={spinner} variant="contained" onClick={()=>RefreshServers({...opts,setServers:setServers}, false, true)}>Refresh Data</LoadingButton></Box>
    </TableContainer>
  )
}
/*

*/
