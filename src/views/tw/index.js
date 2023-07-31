import React, { Fragment, useEffect } from 'react'
import { Box, Tab, Tabs } from '@mui/material';
import queryString from 'query-string';

import useLocalStorage from 'components/useLocalStorage'
import ButtonNav from 'components/buttonNav'
import TWStats from './performance'
import TWDefense from './defense'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && (<Box sx={{ p: 0 }}>{children}</Box>)}
      </div>
    );
  }
  
  function tabProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

export default function TW(opts={}){
    let urlParms = queryString.parse(window.location.search)
    useEffect(()=>{
      handleNav(urlParms)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlParms])
    const { discordId } = opts;
    const [ value, setValue ] = useLocalStorage('tw-home', 0);

    if(!discordId){
        localStorage.setItem('startUrl', window.location.href)
        ButtonNav('/discord/login')
    }
    function handleNav(params){
      if(params?.date){
        setValue(1)
      }else{
        if(params?.page){
          setValue(+params?.page)
          ButtonNav('/tw')
        }
      }
    }
    function handleChange (event, newValue){
        if(urlParms?.date || urlParms?.page){
          ButtonNav('/tw?page='+newValue)
        }else{
          setValue(+newValue)
        }                
      };
      return (
        <Fragment>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Defense Map" {...tabProps(0)} />
              <Tab label="Performance" {...tabProps(1)} />
    
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <TWDefense opts={opts} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TWStats opts={opts}/>
          </TabPanel>
        </Box>
        </Fragment>
      )  
    

}