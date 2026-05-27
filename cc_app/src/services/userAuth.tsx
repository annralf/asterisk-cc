'use client';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { IResponse, IUsersAuth, IPagination, IUser, IAgentSession } from '@/src/types/app';
import { headers } from 'src/utils/services';
import { toast } from 'src/components/snackbar';
import { setAgentSession, setSession, setUserSession } from "../auth/context/jwt";
import { setCookie } from 'nookies';
import { PermissionDeniedView } from 'src/sections/permission/view';
import { getSystemLogs } from "./systemLog";

import { userAccessType } from "../utils/user";

const API =   process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/users/auth`;

export interface IUserAuthUpdate {
    id?: number;
    username?: string;
    password?: string;
    isActive?: boolean;
    isVerified?: boolean;
    status?: string;
    user?: number;
    user1?: IUser;
}

interface DecodedToken extends JwtPayload {
    id: string;
    username: string;
    is_active: boolean;
    is_verified: boolean;
    exp: number;
    iat: number;
}

export interface IUserAuth {
    username: string,
    password: string
}

interface IUserResponse {
        access_type: string,
        avatar: null | string,
        created_at: string | null,
        email: string,
        first_name: string,
        last_name: string,
        phone_number?: null | string,
        updated_at: string,
        id: number
}

export const createAuth = async (data: IUsersAuth): Promise<any> => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Auth");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating Auth:", error);
        throw error;
    }
}

/* export const getAuth = async (data: IUserAuth): Promise<{ decodedToken: DecodedToken; token: string }> => {
    try{
        console.log(url);	
        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), 
        });

        if (!response.ok) {
            const errorResponse = await response.json();

            toast.error(errorResponse.error || "Failed to Login");
            
            throw new Error(errorResponse.error || "Failed to Login");
        }

        // Procesa la respuesta
        const result = await response.json();
        const { token,user } = result;

        // Decodifica el token JWT
        const decodedToken: DecodedToken = jwtDecode(token);

        setSession(token);
        const userWithRoll = { ...user, access_type: user?.access_type ?? "agent" };

        setUserSession({ ...userWithRoll, id: decodedToken.id });

        // Almacena el token en localStorage o sessionStorage si es necesario
        localStorage.setItem("authToken", token);

        // Retorna el token y los datos decodificados
        return { decodedToken, token };
    }catch(error:any){
        console.log("Error fetching login", error.message);
        throw error;
    }
} */

const responseServiceArray = [
    'initializing',
    'Not Configured',
    'Configured',
    'Server Error',
    'Operational'
]

const getSystemStatus = async () => {
   /*  const response = await fetch('https://api.github.com');
    const data = await response.json(); */
   
    return responseServiceArray[ 0 ];
    // return data;
}




export const getAuth = async (data: IUserAuth): Promise<{ decodedToken: DecodedToken; token: string, user: IUserResponse }> => {
    try {

        const responseService = await getSystemLogs();
        const status = responseService.system_log[0] ? responseService.system_log[0].setup : false;
        if (!status) {
            setCookie(null, 'firstConfig', status, {
                maxAge: 3600, // 1 hora
                path: '/', // Disponible en todas las rutas
                secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
                httpOnly: false, // ⚠️ No es HTTPOnly porque lo estás seteando desde el frontend (para backend, usa HTTPOnly)
                sameSite: 'Strict',
            });

        }


        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            toast.error(errorResponse.error || "Failed to Login");
            throw new Error(errorResponse.error || "Failed to Login");
        }

        // Procesa la respuesta
        const result = await response.json();
        const { token, user } = result;

        // Decodifica el token JWT
        const decodedToken: DecodedToken = jwtDecode(token);

        const permissionSession = user.access_type ? user.access_type : "firstConfig";
        // Almacena el token en una cookie HTTPOnly y segura
        setCookie(null, 'permissionSession', permissionSession, {
            maxAge: 3600, // 1 hora
            path: '/', // Disponible en todas las rutas
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            httpOnly: false, // ⚠️ No es HTTPOnly porque lo estás seteando desde el frontend (para backend, usa HTTPOnly)
            sameSite: 'Strict',
        });
        if(userAccessType.find(e => e.value === user.access_type) && result.extension){
            const agent:IAgentSession = {
                status: result.agent.status ? result.agent.status : null,
                extension : result.extension.extension ? result.extension.extension : null,
                extension_status : result.extension.is_active ?  result.extension.is_active : null,
                pw: result.extension.password ? result.extension.password : null
            };
            setAgentSession(agent);
        }       

        // Opcional: guardar el token en el estado de la sesión si es necesario
        setSession(token);
        const userWithRole = { ...user, access_type: user?.access_type ?? "firstConfig" }; // <-- Cambiar el valor por defecto si es necesario con firstconfig
        setUserSession({ ...userWithRole, id_auth: decodedToken.id });

        // Opcional: Almacenar el token en localStorage (aunque no es tan seguro)
        //localStorage.setItem("authToken", token);

        return { decodedToken, token, user };
    } catch (error: any) {
        console.log("Error fetching login", error.message);
        throw error;
    }
};
export const isTokenExpired = (decodedToken: DecodedToken): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

// Ejemplo de uso:
/* const { decodedToken } = await getAuth({ username: "user", password: "pass" });
if (isTokenExpired(decodedToken)) {
    console.log("El token ha expirado");
} else {
    console.log("Token válido");
} */

export const updateAuth = async (
    userId: number,
    data: IUserAuth
): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${url}${userId}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update auth");
        }

        const result: IResponse = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error updating auth:", error.message);
        throw error;
    }
}

export const deleteAuth = async (userId: number): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${url}${userId}/`, {
            method: "DELETE",
            headers: headers
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to deleted auth");
        }
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error deleting auth:", error.message);
        throw error;
    }
}