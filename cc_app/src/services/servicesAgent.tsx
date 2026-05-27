'use client';

import { IServicesAgent, IResponse, IPagination, IService, IExtensionsAgent } from 'src/types/app';
import { headers } from 'src/utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/agents/services/`;

export interface IServiceAgentUpdate {
  id?: number;
  service?: number;
  extension?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  extensionsAgent?: IExtensionsAgent;
  service1?: IService;
}

interface IAgents {
    id: number;
    service: {
      id: number;
      name: string;
    };
    extension: {
      id: number;
      identity: string;
    };
    isActive: boolean;
}

export interface IServiceAgentsResponse {
    agents: IAgents[],
    pagination: IPagination
}

export const createServiceAgent = async(data:IServicesAgent):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Service Agent");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Service Agent", error);
        throw error;
    }
};

export const getSingleServiceAgent = async(serviceAgentId:number):Promise<IAgents> => {
    try{
        const response = await fetch(`${url}${serviceAgentId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Service Agent");
        }

        const result:IAgents = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Service Agent:", error.message);
        throw error;
    }
}

export const getServiceAgents =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<IServiceAgentsResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Service Agents");
        }
    
        const result: IServiceAgentsResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Service Agents:", error.message);
        throw error;
      }
}

export const updateServiceAgent = async(
    serviceAgentId:number,
    data: IServicesAgent
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${serviceAgentId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Service Agent");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Service Agent:", error.message);
        throw error;
    }
}

export const deleteServiceAgent = async(
    serviceAgentId:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${serviceAgentId}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Service Agent");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Service Agent:", error.message);
        throw error;
    }
}