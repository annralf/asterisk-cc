"use client";

import { ISupportsRecord, ISupport, IPagination, IResponse } from "src/types/app";
import { headers } from 'src/utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/support/record/`;

export interface ISupportRecordUpdate {
    id?: number;
    url?: string;
    createdAt?: Date;
    observation?: string;
    support?: number;
    support1?: ISupport;
}

interface ISupportRecord {
    id?: number;
    url?: string;
    createdAt?: Date;
    observation?: string;
    support1?: ISupport;
}

export interface ISupportRecordResponse {
    support : ISupportRecord[],
    pagination : IPagination
}

export const createSupportRecord = async(data:ISupportsRecord):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Support Record");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Support Record", error);
        throw error;
    }
};

export const getSingleSupportRecord = async(supportRecordId:number):Promise<ISupportRecord> => {
    try{
        const response = await fetch(`${url}${supportRecordId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Support Record");
        }

        const result:ISupportRecord = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Support Record:", error.message);
        throw error;
    }
}

export const getSupportRecords =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<ISupportRecordResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Support Record");
        }
    
        const result: ISupportRecordResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Support Record:", error.message);
        throw error;
      }
}

export const updateSupportRecord = async(
    supportRecord:number,
    data: ISupportsRecord
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${supportRecord}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Support Record");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Support Record:", error.message);
        throw error;
    }
}

export const deleteSupportRecord = async(
    supportRecordId:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${supportRecordId}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Support Record");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Support Record:", error.message);
        throw error;
    }
}