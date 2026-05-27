'use client';

import { IContextDef } from "src/types/app";
import { paths } from "@/src/routes/paths";
import { DashboardContent } from "@/src/layouts/dashboard";
import { CustomBreadcrumbs } from "@/src/components/custom-breadcrumbs";
import ContextDetail from "./detail";

import { getSingleContext } from "@/src/services/contextDef";
import { useEffect, useState } from "react";

type Props = {
  context?: IContextDef;
};

const ContextDetailView = (id: any) => {
const [context, setContext] = useState<IContextDef | undefined>(undefined);

const fetchContext = async () => {
    try {
      const context = await getSingleContext( id.id);
      setContext(context);
    } catch (error) {    
      console.error("Error fetching context", error);
    };
};

useEffect(() => {
    fetchContext();
},[]); 
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={context?.name}
        links={[
          { name: "Configuración", href: paths.setup.main },
          { name: "Context", href: paths.context_setup.main },
          { name: context?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ContextDetail context={context} />
    </DashboardContent>
  );
}

export default ContextDetailView;