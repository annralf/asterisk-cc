'use client';

import { IContextDef } from 'src/types/app';
import { paths } from '@/src/routes/paths';
import { DashboardContent } from '@/src/layouts/dashboard';
import { CustomBreadcrumbs } from '@/src/components/custom-breadcrumbs';

import CampaignDetail from './detail';

import { getSingleContext } from '@/src/services/contextDef';
import { useEffect, useState } from 'react';

type Props = {
  context?: IContextDef;
};

const CampaignDetailView = (id: any) => {
  const [context, setContext] = useState<IContextDef | undefined>(undefined);

  const fetchContext = async () => {
    try {
      const context = await getSingleContext(id.id);
      setContext(context);
    } catch (error) {
      console.error('Error fetching context', error);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={context?.name}
        links={[
          { name: 'Configuración', href: paths.setup.main },
          { name: 'Campaña', href: paths.campaign.main },
          { name: context?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CampaignDetail service={context} />
    </DashboardContent>
  );
};

export default CampaignDetailView;