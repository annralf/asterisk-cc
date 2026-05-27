"use client";

import { IService, IResponse, IPagination } from "src/types/app";
import { headers } from "src/utils/services";

import { AnyObject } from "src/types/app";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/services/`;

export interface IServiceUpdate {
    id?: number;
    name?: string;
    status?: string;
    isActive?: boolean;
    retry?: number;
    wrapuptime?: number;
    strategy?: string;
    timeout?: number;
}

export interface IServicesResponse {
    services: IService[],
    pagination: IPagination
}

export const createService = async (data: IService): Promise<IResponse> => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to create service");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating service", error);
        throw error;
    }
};

export const getSingleService = async (serviceId: number): Promise<IService> => {
    try {
        const response = await fetch(`${url}${serviceId}`);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to get Service");
        }

        const result: IService = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error fetching service:", error.message);
        throw error;
    }
}

export const getServices = async (
    page: number = 1,
    limit: number = 10
): Promise<IServicesResponse> => {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch services");
        }

        const result: IServicesResponse = await response.json();
        return result;


    } catch (error: any) {
        console.error("Error fetching services:", error.message);
        throw error;
    }
}

export const updateServices = async (
    id: string | number,
    data: IService
): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${url}${id}/`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to update service");
        }

        const result: IResponse = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error updating service:", error.message);
        throw error;
    }
}

export const deleteService = async (
    serviceID: number
): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${url}${serviceID}/`, {
            method: "DELETE",
            headers: headers
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to delete service");
        }
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error deleting service:", error.message);
        throw error;
    }
}

export const getFilteredService = async (filters: AnyObject): Promise<IServicesResponse> => {
    try {
        const { page, limit, ...restFilters } = filters;
        let queryParams = new URLSearchParams();

        if (page !== undefined && limit !== undefined) {
            queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        }

        Object.entries(restFilters).forEach(([ key, value ]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });

        const response = await fetch(`${url}filter?${queryParams.toString()}`, {
            method: "GET",
            headers: headers, // Asegurar que headers esté definido
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Failed to fetch services");
        }

        const result: IServicesResponse = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching campaigns", error);
        throw error;
    }
};