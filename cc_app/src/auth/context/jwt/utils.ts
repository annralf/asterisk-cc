import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { STORAGE_KEY, STORAGE_USER, STORAGE_AGENT } from './constant';
import { UserType } from '../../types';
import { IAgentSession, IClient, IUser } from '../../../types/app';

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[ 1 ];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(async () => {
    try {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.');      
      // Espera a que se limpien las variables antes de redirigir
      await clearLocalSession();

      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Error durante la expiración del token:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      localStorage.setItem(STORAGE_KEY, accessToken);
      //console.log('accessToken', accessToken);
      /* axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`; */

      const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server

      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp);
      } else {
        throw new Error('Invalid access token!');
      }
    } /* else {
      sessionStorage.removeItem(STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
    } */
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function setUserSession(user: UserType) {
  try {
    const codifyUser = JSON.stringify(user);
    localStorage.setItem(STORAGE_USER, codifyUser);
  } catch (error) {
    console.error('Error during set user session:', error);
    throw error;
  }
}

export async function setAgentSession(agent:IAgentSession){
  try{
    const agentStr = JSON.stringify(agent);
    localStorage.setItem(STORAGE_AGENT, agentStr);
  }catch(error){
    console.error('Error setting the agent session', error);
    throw error;
  }
};

export async function getAgentSession() {
  try{
    const agent = localStorage.getItem(STORAGE_AGENT);
    if(agent){
      return JSON.parse(agent);
    }
    return null;
  }catch(error){
    console.error('Error during get agent session data', error);
    throw error;
  }
}


export async function getSession() {
  try {
    const accessToken = sessionStorage.getItem(STORAGE_KEY);
    if (accessToken && isValidToken(accessToken)) {
      return accessToken;
    }

    return null;
  } catch (error) {
    console.error('Error during get session:', error);
    throw error;
  }
}

export function getUserSession(): IUser | null {
  try {
    let user = localStorage.getItem(STORAGE_USER);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error('Error during get user session:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------- 

export function clearLocalSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('authToken');
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_AGENT);

    window.location.href = paths.auth.jwt.signIn;
    //delete axios.defaults.headers.common.Authorization;
  } catch (error) {
    console.error('Error during clear session:', error);
    throw error;
  }
}