"use client";

import { IAgentsPermission, IResponse, IPagination } from "src/types/app";
import { headers } from "src/utils/services";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/agents/permissions/`;

export interface IAgentPermissionsUpdate {
    id?: number;
    name?: string;
    isActive?: boolean;
}

interface IPermissions {
    id?: number;
    name?: string;
    isActive?: boolean;
}

export interface IAgentsPermissionResponse {
    permissions: IPermissions[],
    pagination: IPagination
}

export const createAgentsPermission = async(data:IAgentsPermission):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Permission Agent");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Permission Agent", error);
        throw error;
    }
};

export const getSingleAgentPermission = async(agentPermissionId:number):Promise<IAgentsPermission> => {
    try{
        const response = await fetch(`${url}${agentPermissionId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Permission Agent");
        }

        const result:IAgentsPermission = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Permission Agent:", error.message);
        throw error;
    }
}

export const getAgentPermissions =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<IAgentsPermissionResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Permission Agents");
        }
    
        const result: IAgentsPermissionResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Permission Agents:", error.message);
        throw error;
      }
}

export const updateAgentPermission = async(
    agentPermissionId:number,
    data: IAgentsPermission
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${agentPermissionId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Permission Agent");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Permission Agent:", error.message);
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
            throw new Error(errorResponse.error || "Failed to delete Permission Agent");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Permission Agent:", error.message);
        throw error;
    }
}