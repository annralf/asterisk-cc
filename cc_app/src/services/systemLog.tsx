const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/system/log`;

//----------------------------Start Call Center system Logs ----------------------------------------------------------------
export type ResponseGetSystemLogs ={
  service_status: string;
  setup: "true" | "false";
}
export const getSystemLogs = async (): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch system logs");
    }
    const result = await response.json();

    return result 

    } catch (error) {
      console.error("Error fetching system logs", error);
      throw error;
    }
  }

export const createSystemLog = async (data: any): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to create system log");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating system log", error);
      throw error;
    }
  }

  export const updateSystemLog = async (data: any, id: number): Promise<any> => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update system log");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating system log", error);
      throw error;
    }
  }