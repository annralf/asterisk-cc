"use client";

import { IExtensions } from "src/types/app";
import { headers } from "src/utils/services";

import { AnyObject } from "src/types/app";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/extensions/`;

interface IResponse  {
    message:string,
    id?: number
}

export interface IPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
  }
  
export interface IExtensionUpdate {
    identity? : string,
    is_active? : string,
    status? : string,
}

export interface IExtensionsResponse {
    extensions: ExtensionItem[];
    pagination: IPagination;
  }
  
  export interface ExtensionItem {
    id?: number;
    identity?: string;
    is_active?: boolean;
    status?: string;
    context?: string | null | number;
    access_type?: string;
    allocated?: boolean;
    created_at?: string; 
    updated_at?: string; 
    agent?: AgentInfo | null;
    service?: ServiceInfo | null | number;
  }
  
  export interface AgentInfo {
    id?: number | null;
    names?: string | null;
    email?: string | null;
  }
  
  export interface ServiceInfo {
    id?: number | null;
    service?: string | null;
  }
  
export const createExtension = async(data:IExtensions):Promise<IResponse> => {
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create extension");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error creating extension", error);
        throw error;
    }
};

export const getSingleExtension = async(extensionId:number):Promise<IExtensions> => {
    try{
        const response = await fetch(`${url}?extension_id=${extensionId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch extension");
        }
        const result:IExtensions = await response.json();
        return result;
    }catch (error: any) {
        console.error("Error fetching extension:", error.message);
        throw error;
  }
}

export const getExtensions = async(page: number = 1, limit: number = 10):Promise<IExtensionsResponse> => {
    try{
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: headers,
          });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get extensions");
        }
        const result: IExtensionsResponse = await response.json();
        return result;

   } catch (error: any) {
        console.error("Error fetching extensions:", error.message);
        throw error;
  }
}

export const updateExtensions = async (extensionId:any, data: ExtensionItem | IExtensions):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${extensionId}/`,{
            method: "PUT",
            headers: headers,
            body:JSON.stringify(data)}
        );

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update extension");
        }

        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating extension:", error.message);
        throw error;
    }
};

export const deleteExtension = async(extensionId:number):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${extensionId}/`,{
            method: "DELETE",
            headers: headers,
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete extension");
        }

        const result = await response.json();
        return result;

    }catch(error:any){
        console.error("Error deleting extension:", error.message);
        throw error;
    }
};

export const getFilteredExtensions =  async(filters: AnyObject):Promise<IExtensionsResponse>  => {
 try{
        const {page, limit, ...restFilters} = filters;
        let queryParams = new URLSearchParams();

        if (page !== undefined && limit !== undefined) {
            queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        }
        
        Object.entries(restFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });

        const response = await fetch(`${url}filter?${queryParams.toString()}`, {
            method: "GET",
            headers: headers,
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch services");
        }
        const result:IExtensionsResponse = await response.json();
        return result
    }catch(error){
        console.error("Error fetching extensions", error);
        throw error;
    }
};