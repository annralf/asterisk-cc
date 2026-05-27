'use client'
import type { FC } from 'react';
import React, { useState } from 'react';
import { Tabs, Tab, Box, Grid } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

interface DynamicTabsProps {
  tabs: { label: string; component: React.ReactNode }[];
}

const DynamicTabs: FC<DynamicTabsProps> = ({ tabs }) => {
  const [ value, setValue ] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider',  marginLeft: '10px' }} >
      <Tabs value={value} onChange={handleChange} aria-label="dynamic tabs" >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} id={`tab-${index}`} />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {/* Main Section */}
          {tab.component}
          {/* <ClientStatus /> */}
        </TabPanel>
      ))}
    </Box>
  );
};

export default DynamicTabs;