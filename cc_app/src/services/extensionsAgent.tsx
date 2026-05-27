'use client';

import { IExtensionsAgent, IResponse, IPagination, IAgent, IExtensions } from 'src/types/app';
import { headers } from 'src/utils/services';

const API = process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';;
const url = `${API}/agents/extensions/`;

export interface IExtensionAgentUpdate {
  id?: number;
  agent?: number;
  extension?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  agent1?: IAgent;
  extension1?: IExtensions;
}

interface IAgents {
    id: number;
    agent: {
      id: number;
      firstName: string;
      lastName: string;
      status: string;
    };
    extension: {
      id: number;
      identity: string;
      isActive: boolean;
      status: string;
    };
    isActive: boolean;    
}

export interface IExtensionAgentResponse {
    agents: IAgents[],
    pagination: IPagination
}

export const createExtensionAgent = async(data:IExtensionsAgent):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Extension Agent");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Extension Agent", error);
        throw error;
    }
};

export const getSingleExtensionAgent = async(serviceId:number):Promise<IExtensionsAgent> => {
    try{
        const response = await fetch(`${url}${serviceId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Extension Agent");
        }

        const result:IExtensionsAgent = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Extension Agent:", error.message);
        throw error;
    }
}

export const getExtensionAgents =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<IExtensionAgentResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Extension Agents");
        }
    
        const result: IExtensionAgentResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Extension Agents:", error.message);
        throw error;
      }
}

export const updateExtensionAgent = async(
    extensionAgentId:number,
    data: IExtensionsAgent
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${extensionAgentId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Extension Agent");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Extension Agent:", error.message);
        throw error;
    }
}

export const deleteExtensionAgent = async(
    extensionAgent:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${extensionAgent}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Extension Agent");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Extension Agent:", error.message);
        throw error;
    }
}