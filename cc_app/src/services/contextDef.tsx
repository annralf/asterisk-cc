"use client";

import { IContextDef } from "src/types/app";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/context/`;

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

export const createContext = async(data: Omit<IContextDef, 'id'>):Promise<IResponse> => {
    try{
        const response = await fetch(url, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create context");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error creating context", error);
        throw error;
    }
};

export const getSingleContext = async(contextId:number):Promise<IContextDef> => {
    try{
        const response = await fetch(`${url}/${contextId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch context");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error fetching context", error);
        throw error;
    }
};

export const getAllContexts = async():Promise<{context_defs:IContextDef[], pagination:IPagination}> => {
    try{
        const response = await fetch(url);
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch contexts");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error fetching contexts", error);
        throw error;
    }
};

export const getContexts = async(page:number, limit:number):Promise<{context_defs:IContextDef[], pagination:IPagination}> => {
    try{
        const response = await fetch(`${url}?page=${page}&limit=${limit}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch contexts");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error fetching contexts", error);
        throw error;
    }
};

export const getFilteredContexts = async(page:number, limit:number, filters:Record<string, string | number | boolean>):Promise<{context_defs:IContextDef[], pagination:IPagination}> => {
    try{
        const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        Object.entries(filters).forEach(([key, value]) => {
            queryParams.append(key, value.toString());
        });

        const response = await fetch(`${url}/filter?${queryParams.toString()}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch contexts");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error fetching contexts", error);
        throw error;
    }
};

export const updateContext = async(data:IContextDef):Promise<IResponse> => {
    try{
        const response = await fetch(`${url}${data.id}`, {
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update context");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error updating context", error);
        throw error;
    }
};