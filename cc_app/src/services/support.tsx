'use client';

import { ISupport, IResponse, IPagination, IExtensionsAgent, IClient, IService } from 'src/types/app';
import { headers } from 'src/utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/support`;

export interface ISupportResponse {
  id?: number;
  agent?: number;
  client?: number;
  status?: string;
  startAt?: Date;
  endAt?: Date;
  observation?: string;
  service?: number;
  extensionsAgent?: IExtensionsAgent;
  client1?: IClient;
  service1?: IService;
}

export interface ISupports {
    id: number;
    agent: {
      id: number;
      firstName: string;
      lastName: string;
      status: string;
      extension: string;
    };
    client: {
      id: number;
      firstName: string;
      lastName: string;
      idType: string;
      idNumber: string;
      mail: string;
      address: string;
      phoneNumber: string;
    };
    status: string;
    startAt: string; 
    endAt: string; 
    observation: string;
    service: {
      id: number;
      name: string;
      status: string;
      isActive: boolean;
    };
}

export interface INewSupport {
    address: string;
    category_service: number;
    end_at: Date;
    first_name: string | null;
    id_number: string;
    id_type: string;
    is_monitored: boolean;
    last_name: string;
    mail: string | null;
    observation: string;
    phone_number: string;
    service: number;
    start_at: Date;
    status: string;
}

export interface ISupportResponse {
    supports: ISupports[];
    pagination: IPagination;
}

export const createSupport = async(data:INewSupport):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Support");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Support", error);
        throw error;
    }
};

export const getSingleExtensionAgenSupport = async(serviceId:number):Promise<ISupports> => {
    try{
        const response = await fetch(`${url}${serviceId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Support");
        }

        const result:ISupports = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Support:", error.message);
        throw error;
    }
}

export const getSupports =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<ISupportResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Supports");
        }
    
        const result: ISupportResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Supports:", error.message);
        throw error;
      }
}

export const updateSupport = async(
    supportId:number,
    data: ISupport
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${supportId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Support");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Support:", error.message);
        throw error;
    }
}

export const deleteSupport = async(
    supportId:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${supportId}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Support");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Support:", error.message);
        throw error;
    }
}

export const getSupportClient = async(data:any):Promise<any> => {
    try{
        const response = await fetch( `${url}/client` , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch Support data");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error to fetch Support data", error);
        throw error;
    }
};