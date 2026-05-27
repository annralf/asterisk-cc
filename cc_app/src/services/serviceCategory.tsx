"use client";

import { IServicesCategory, IService, IResponse, IPagination } from "src/types/app";
import { headers } from 'src/utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/services/categories`;

export interface IServiceCategoryUpdate {
    id?: number;
    name?: string;
    service?: number;
    isActive?: boolean;
    service1?: IService;
}

interface Service {
    name: string;
    status: string;
    is_active: boolean;
  }
  
export interface ICategory {
    id: number;
    name: string;
    service: Service;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  

export interface IServiceCategoryResponse {
    categories: ICategory[],
    pagination : IPagination
}

export const createServiceCategory = async(data:IServicesCategory):Promise<IResponse> => {
    try{
        const response = await fetch( url , {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create Service Category");
        }

        const result = await response.json();
        return result;
    }catch(error){
        console.error("Error creating Service Category", error);
        throw error;
    }
};

export const getSingleServiceCategory = async(serviceCategoryId:number):Promise<IServicesCategory> => {
    try{
        const response = await fetch(`${url}${serviceCategoryId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Service Category");
        }

        const result:IServicesCategory = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Service Category:", error.message);
        throw error;
    }
}

export const getServiceCategories =  async (
    page: number = 1,
    limit: number = 10
  ): Promise<IServiceCategoryResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to fetch Service Category");
        }
    
        const result: IServiceCategoryResponse = await response.json();
        return result;
      } catch (error: any) {
        console.error("Error fetching Service Category:", error.message);
        throw error;
      }
}

export const updateServiceCategory = async(
    serviceCategoryId:number | string,
    data: IServicesCategory
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${serviceCategoryId}/`,{
            method: "PUT",
            headers:headers,
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update Service Category");
        }

        const result:IResponse = await response.json();
        return result;
    }catch(error:any){
        console.error("Error updating Service Category:", error.message);
        throw error;
    }
}

export const deleteServiceCategory = async(
    serviceCategoryId:number
):Promise<{message:string}> => {
    try{
        const response = await fetch(`${url}${serviceCategoryId}/`,{
            method: "DELETE",
            headers:headers
        });

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete Service Category");
        }
        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error deleting Service Category:", error.message);
        throw error;
    }
}

export const getFilteredServiceCategories = async(page:number, limit:number, filters:Record<string, string | number | boolean>):Promise<IServiceCategoryResponse> => {
    try{
        const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        Object.entries(filters).forEach(([key, value]) => {
            queryParams.append(key, value.toString());
        });

        const response = await fetch(`${url}/filter?${queryParams.toString()}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch service categories");
        }
        const result = await response.json();
        return result
    }catch(error){
        console.error("Error fetching service categories", error);
        throw error;
    }
}

export const getServiceCategoryList = async(serviceCategoryId:number):Promise<any> => {
    try{
        const response = await fetch(`${url}/list/${serviceCategoryId}`);

        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Service Category");
        }

        const result = await response.json();
        return result;
    }catch(error:any){
        console.error("Error fetching Service Category:", error.message);
        throw error;
    }
}