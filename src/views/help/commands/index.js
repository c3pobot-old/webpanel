import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import ShowCmds from './showCmds'

import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import ApiRequest from 'components/apiRequest'
import GetPath from 'components/getPath'
import DB from 'components/db'

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const enumPath = {'shard': 1, 'basic': 2, 'bo': 3}
export default function Commands (opts = {}) {
  const { setSpinner, spinner, setAlert } = opts;
  const cmdPath = GetPath(enumPath, 3)

  const [ botCmds, setBotCmds ] = useState([]);
  const [ value, setValue ] = useState(cmdPath || 0);
  const [ open, setOpen ] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  async function fetchBotCmds (force = false){
    setSpinner(true)
    let obj
    if(!force) obj = await DB.get('botCmds')
    if(!obj){
      obj = await ApiRequest({method: 'fetchBotCmds', dId:'not needed', data: {}})
      if(obj?.length > 0){
        await DB.set('botCmds', obj)
        setAlert({ type: 'success', msg: 'Bot Commands pulled Successfully'})
      }else{
        setAlert({ type: 'error', msg: 'Error Pulling Bot Commands'})
      }

    }
    if(obj?.length > 0) setBotCmds(obj);
    setSpinner(false)
  }
  useEffect(()=>{

    if(botCmds?.length === 0) fetchBotCmds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botCmds])
  if(!botCmds || botCmds?.length === 0) return null
  return (
    <Box sx={{ width: '100%' }}>
      <Box><LoadingButton loading={spinner} variant="contained" onClick={()=>fetchBotCmds(true)}>Refresh Commands</LoadingButton></Box>
      <Box>Note: Shard commands are a patreon feature and Basic commands are not public</Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        {botCmds?.length > 0 && botCmds.map((item, i) => (
          <Tab key={+i} label={item._id?.toUpperCase()} {...a11yProps(+i)} onClick={()=>setOpen(false)}/>
        ))}
        </Tabs>
      </Box>
      {botCmds?.length > 0 && botCmds.map((item, i) => (
        <TabPanel value={value} index={+i} key={+i}>
          <ShowCmds botCmds={item.cmds} open={open} setOpen={setOpen} />
        </TabPanel>
      ))}
    </Box>
  )
}
