'use client';

import { IAgent, IResponse, IPagination, IAgentsPermission, IUser } from 'src/types/app';
import { headers } from 'src/utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/agents/`;

export interface IAgentUpdate {
  id?: number;
  user?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  permission?: number;
  agentsPermission?: IAgentsPermission;
  user1?: IUser;
}

interface IAgentPermissions {
    id: number,
    name:string,
    is_active: boolean
}

export interface IAgentPermissionResponse {
    permissions: IAgentPermissions[],
    pagination: IPagination
}

export const createAgentPermission = async(data:IAgent):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Agent Permissions");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Agent Permissions", error);
        throw error;
    }
};

export const getSingleAgent = async(agentID:number):Promise<IAgent> => {
    try{
        const response = await fetch(`${url}${agentID}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Agent Permission");
        }

        const result:IAgent = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Agent Permission:", error.message);
        throw error;
    }
}

export const getAgentPermissions =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<IAgentPermissionResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Agent Permission");
        }
    
        const result: IAgentPermissionResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Agent Permission:", error.message);
        throw error;
      }
}

export const updateAgent = async(
    extensionAgentId:number,
    data: any
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${extensionAgentId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Agent Permission");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Extension Agent:", error.message);
        throw error;
    }
}

export const deleteAgentPermission = async(
    agentPermissionId:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${agentPermissionId}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Agent Permission");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Agent Permission:", error.message);
        throw error;
    }
}


export const updateActivity = async(data:{user:string| number, status: string}
):Promise<IResponse> => {
    try{
        const response = await fetch( `${url}activities` , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update agent activity");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error update agent activity", error);
        throw error;
    }
};