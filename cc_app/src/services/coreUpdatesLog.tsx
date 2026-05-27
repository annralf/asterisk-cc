import { ICoreUpdatesLog } from "../types/app";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/core-updates-log/`;

interface IUser {
    first_name: string;
    id: number;
    last_name: string;
  }
  
  interface ICoreUpdateLog {
    action: string;
    reference: string;
    created_at: string | null;
    id: number;
    status: string;
    updated_at: string | null;
    users: IUser[];
  }
  
  interface IPagination {
    [key: string]: any;
  }
  
  interface IResponse {
    core_updates_log: ICoreUpdateLog[];
    pagination: IPagination;
    total: number;
  }

  export const getCoreUpdatesLog = async (): Promise<IResponse> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to fetch core updates log");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching core updates log", error);
      throw error;
    }
  };

  export const updateCoreUpdateLog = async (id:number, data:any): Promise<IResponse> => {
    try{
      const response = await fetch(`${url}${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update core update log");
      }
      const result = await response.json();
      return result;
    }catch(error){
      console.error("Error updating core update log", error);
      throw error;
    }
  };