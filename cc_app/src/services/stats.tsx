"use client";

import { headers } from "../utils/services";

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/stats`;

//Agent activities stats

export const getTodaysAgentActivities = async(agent:number):Promise<any> => {
    try{
        const response = await fetch(`${url}/agent/activity?agent=${agent}`);
    if(!response.ok){
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Failed to get Stats");
            }
    
            const result:any = await response.json();
            return result;
        }catch(error:any){
            console.error("Error fetching Stats:", error.message);
            throw error;
        }
}
export const getAgentActivitiesByRange = async(agent:number, start_at:string, end_at:string):Promise<any> => {
    try{
        const response = await fetch(`${url}/agent/activity?agent=${agent}&start_date=${start_at}&end_date=${end_at}`);
    if(!response.ok){
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Failed to get Stats");
            }
    
            const result:any = await response.json();
            return result;
        }catch(error:any){
            console.error("Error fetching Stats:", error.message);
            throw error;
        }
}