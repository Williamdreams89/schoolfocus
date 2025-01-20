import React from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Card } from '@mui/material';
import SubjectTemplates from './SubjectTemplate';


const Subjects = () => {
    const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Card sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Class Subjects" value="1" />
            <Tab label="Subject Teachers" value="2" />
            <Tab label="Subject Templates" value="3" />
            <Tab label="Subject Types" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">
            <SubjectTemplates />
        </TabPanel>
        <TabPanel value="4">Item Three</TabPanel>
      </TabContext>
    </Card>
  )
}

export default Subjects