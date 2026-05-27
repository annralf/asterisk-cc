"use client";

import { paths } from "@/src/routes/paths";
import { CustomBreadcrumbs } from "../custom-breadcrumbs";
import { DashboardContent } from "@/src/layouts/dashboard";
import NewService from "./new";

import { FC } from 'react';
import NewClient from "./new";

export const ClientView: FC = () => {
    return(
        <DashboardContent>
            <CustomBreadcrumbs
             heading="Llamada entrante"
             links={[
               { name: 'Home', href: paths.service.main },
               { name: 'Llamada entrante', href: paths.service.new },
             ]}
             sx={{ mb: { xs: 3, md: 5 } }}
            >
            </CustomBreadcrumbs>
            <NewClient/>
        </DashboardContent>
    )
}