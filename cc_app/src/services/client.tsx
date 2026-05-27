"use client";

import { IClient, IResponse, IPagination } from "src/types/app";
import { headers } from "src/utils/services";
import { ClientFormInputs } from "../components/client/new";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/clients/`;


export interface IClientUpdate {
    id?: number;
    firstName?: string;
    lastName?: string;
    idType?: string;
    idNumber?: string;
    mail?: string;
    address?: string;
    phoneNumber?: string;
}

export interface IClientResponse {
    clients : IClient[],
    pagination : IPagination
}

export const createClient = async(data:ClientFormInputs):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Client");
        }
        const result = await response.json();
        console.log(result)
        return result;
    }catch(error){
        console.error("Error creating Client", error);
        throw error;
    }
};

export const getSingleClient = async(clientId:number):Promise<IClient> => {
    try{
        const response = await fetch(`${url}${clientId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Client");
        }

        const result:IClient = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Client:", error.message);
        throw error;
    }
}

export const getClients =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<IClientResponse> => {
    try {
        console.log("Fetching Clients");
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Clients");
        }
    
        const result: IClientResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Clients:", error.message);
        throw error;
      }
}

export const updateClients = async(
    clientId:number,
    data: IClient
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${clientId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Client");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Client:", error.message);
        throw error;
    }
}

export const deleteClient = async(
    clientId:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${clientId}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Client");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Client:", error.message);
        throw error;
    }
}