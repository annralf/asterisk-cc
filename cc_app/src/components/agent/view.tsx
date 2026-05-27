"use client";

import { paths } from "@/src/routes/paths";
import { CustomBreadcrumbs } from "../custom-breadcrumbs";
import { DashboardContent } from "@/src/layouts/dashboard";

import NewUser from "../users/new";

import { FC } from 'react';

export const AgentView: FC = () => {
    return(
        <DashboardContent>
            <CustomBreadcrumbs
             heading="Agentes | Operadores"
             links={[
               { name: 'Inicio', href: paths.agent.main },
               { name: 'Crear Agente', href: paths.agent.new }
             ]}
             sx={{ mb: { xs: 3, md: 5 } }}
            >
            </CustomBreadcrumbs>
            <NewUser user={null}/>
        </DashboardContent>
    )
}