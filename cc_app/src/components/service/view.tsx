"use client";

import { paths } from "@/src/routes/paths";
import { CustomBreadcrumbs } from "../custom-breadcrumbs";
import { DashboardContent } from "@/src/layouts/dashboard";
import NewService from "./new";

import { FC } from 'react';

export const ServiceView: FC = () => {
    return(
        <DashboardContent>
            <CustomBreadcrumbs
             heading="Llamada entrante"
             links={[
               { name: 'Inicio', href: paths.service.main },
               { name: 'Llamada entrante', href: paths.service.new },
             ]}
             sx={{ mb: { xs: 3, md: 5 } }}
            >
            </CustomBreadcrumbs>
            <NewService/>
        </DashboardContent>
    )
}