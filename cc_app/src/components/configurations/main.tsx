import React from 'react'
import { Grid } from '@mui/material'
import MainExtension from '../extension/main'
import MainCampaign from '../campaign/main'
import MainUser from '../users/main'
import DynamicTabs from '../dynamic-tab/dynamic-tab'


const MainConfig = () => {
  return (
    <Grid>
      <DynamicTabs
        tabs={[
          { label: 'User Config', component: <MainUser/> },
          { label: 'Campaign Config', component: <MainCampaign /> },
          { label: 'Extension Config', component: <MainExtension /> },
        ]}
      />
    </Grid>

  )
}

export default MainConfig