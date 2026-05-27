"use client";


import { paths } from "@/src/routes/paths";
import { DashboardContent } from "@/src/layouts/dashboard";
import { CustomBreadcrumbs } from "../custom-breadcrumbs";

import NewUser from "./new";

export const UserView = () => {
    return(
        <DashboardContent>
            <CustomBreadcrumbs
             heading="Nuevo usuario"
             links={[
               { name: 'Configuración', href: paths.setup.main },
               { name: 'Usuarios', href: paths.user.main},
               { name: 'Nuevo usuario' },
             ]}
             sx={{ mb: { xs: 3, md: 5 } }}
            ></CustomBreadcrumbs>
            <NewUser user={null}/>
        </DashboardContent>
    );
}