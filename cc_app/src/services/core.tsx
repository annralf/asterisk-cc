const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/asterisk/core/dialplan`;

//----------------------------Start Asterisk Core Services ----------------------------------------------------------------
export const getDialPlan = async (): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch dial plan");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching dial plan", error);
    throw error;
  }
};

export const getServerStatus = async (): Promise<any> => {
  try {
    const response = await fetch(`${API}/asterisk/core/status`);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch server status");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching server status", error);
    throw error;
  }
}

export const getServerConnection = async (): Promise<any> => {
  try {
    const response = await fetch(`${API}/asterisk/core/ping`);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch server ping");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching server ping", error);
    throw error;
  }
} 

export const restartServerConnection = async (): Promise<any> => {
  try {
    const response = await fetch(`${API}/asterisk/core/restart`);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch server reload");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching server reload", error);
    throw error;
  }
} 
//----------------------------End Asterisk Core Services ----------------------------------------------------------------


//----------------------------Start Setup Files ----------------------------------------------------------------

//Service API To create the extension.conf FILE
export const setupExtensions = async (): Promise<any> => {
  try{
    const response = await fetch(`${API}/extensions/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to setup extensions");
    }
    const result = await response.json();
    return result;
  }catch(error){
    console.error("Error setting up extensions", error);
    throw error;
  }
};

//Service API To create the pjsip.conf FILE
export const setupPjsip = async (): Promise<any> => {
  try{
    const response = await fetch(`${API}/extensions/setup/pjsip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to setup pjsip");
    }
    const result = await response.json();
    return result;
  }catch(error){
    console.error("Error setting up pjsip", error);
    throw error;
  }
};

//Service API To create the queues.conf FILE
export const setupQueue = async (): Promise<any> => {
  try{
    const response = await fetch(`${API}/services/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to setup queue");
    }
    const result = await response.json();
    return result;
  }catch(error){
    console.error("Error setting up queue", error);
    throw error;
  }
};
//----------------------------End Setup Files ----------------------------------------------------------------
