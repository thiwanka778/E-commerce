import React from 'react'
import "../styles.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddTypes from "./AddTypes";
import AddItem from "./AddItem";
import UpdateItem from "./UpdateItem";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const NewItem = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event:any, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
    <main className='newitem'>
    <Box sx={{ width: '100%' }}>
      <Box >
        <Tabs centered value={value} onChange={handleChange} >
          <Tab label="ADD TYPES" {...a11yProps(0)} />
          <Tab label="ADD ITEMS" {...a11yProps(1)} />
          <Tab label="UPDATE ITEMS" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AddTypes/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddItem/>
      </TabPanel>
      <TabPanel value={value} index={2}>
    <UpdateItem/>
      </TabPanel>
    </Box>
    </main>
   
    </>
  )
}

export default NewItem