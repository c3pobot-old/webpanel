import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';

//import Commands from './commands'
import PrivacyPolicy from './privacyPolicy'
import Commands from './commands'
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
const enumPath = {'/commands': 0, '/privacyPolicy': 1}
export default function HelpHome (opts = {}) {

  let navPath = window.location.pathname
  if(navPath) navPath = navPath.replace('/help', '')
  const [value, setValue] = useState(enumPath[navPath] || 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Commands" {...a11yProps(0)} />
          <Tab label="Privacy Policy" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Commands {...opts} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PrivacyPolicy {...opts}/>
      </TabPanel>
    </Box>
  )
}
