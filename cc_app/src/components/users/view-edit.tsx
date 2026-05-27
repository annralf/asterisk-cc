'use client';
import { useState, useCallback, useEffect } from "react";
import { paths } from "@/src/routes/paths";
import { DashboardContent } from "@/src/layouts/dashboard";

import { CustomBreadcrumbs } from "../custom-breadcrumbs";
import { IUser } from "@/src/types/app";
import NewUser from "./new";

import { IUserView } from "@/src/services/user";
import { getSingleUser } from "@/src/services/user";

export const UserEditView = (id:any) => {
    console.log("---Edit user---");
    const [user, setUser] = useState<IUserView | null>(null);

    const getUser = useCallback(async() => {
        try{
            const toUser = parseInt(id.id);
            console.log(toUser);
            const data = await getSingleUser(toUser);
            const response = {
                id: data.user.id,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                phone_number: data.user.phone_number,
                email: data.user.email,
                access_type: data.user.access_type,
                username: data.auth.username,
                campaign: String(data.service.id),
                extension: String(data.extension.id)
            }
            console.log(`---response : ${response}---`);
            setUser(response);
        }catch(error){
            console.error("Error getting user:", error);
        }
     }, []);
    
    useEffect(() => {
        getUser()
    }, [getUser]);
        
    return(
        <DashboardContent>
            <CustomBreadcrumbs
             heading="Editar usuario"
             links={[
               { name: 'Configuración', href: paths.setup.main },
               { name: 'Usuarios', href: paths.user.main},
               { name: 'Editar usuario' },
             ]}
             sx={{ mb: { xs: 3, md: 5 } }}
            ></CustomBreadcrumbs>
            <NewUser user={user}/>
        </DashboardContent>
    );
}