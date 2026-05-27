'use client';

import { IResponse, IUser } from 'src/types/app';
import { IPagination } from './extension';
import { headers } from '../utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/users`;

export interface IUserUpdate {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  avatar?: string;
  access_type?: string;
}

interface INewUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  access_type: string;
  username: string;
  password: string;
  extension?: number | undefined;
  campaign?: number | undefined;
}

export interface IUserResponse {
  users: IUser[];
  pagination: IPagination;
}

export interface UAgent {
  created_at: string;
  id: number;
  permission: number | null;
  status: string;
  updated_at: string;
  user: number;
}

export interface UAuth {
  id: number;
  is_active: boolean;
  is_verified: boolean;
  status: string;
  username: string;
}

export interface UExtension {
  access_type: string;
  allocated: boolean | null;
  context: number;
  created_at: string;
  id: number;
  identity: string;
  is_active: boolean;
  password: string;
  service: number;
  status: string;
  updated_at: string;
}

export interface UExtensionStatus {
  agent: number;
  created_at: string;
  extension: number;
  id: number;
  is_active: boolean;
  updated_at: string;
}

export interface UService {
  id: number;
  is_active: boolean;
  name: string;
  status: string;
}

export interface UUser {
  access_type: string | null;
  avatar: string | null;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone_number: string;
  updated_at: string;
}

export interface UserResponseData {
  agent: UAgent;
  auth: UAuth;
  extension: UExtension;
  extension_status: UExtensionStatus;
  service: UService;
  user: UUser;
}

export interface IUserView {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email: string | null;
  avatar?: string;
  access_type: string | null;
  username: string;
  password?: string;
  campaign?: string;
  extension?: string;
}

export const createUser = async (data: INewUser): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to create user');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getSingleUser = async (userId: number): Promise<UserResponseData> => {
  try {
    const response = await fetch(`${url}/${userId}`);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to get User');
    }
    const result: UserResponseData = await response.json();
    return result;
  } catch (error: any) {
    console.log('Error fetching user:', error.message);
    throw error;
  }
};

export const getUsers = async (page: number = 1, limit: number = 10): Promise<IUserResponse> => {
  try {
    const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to fetch users');
    }

    const result: IUserResponse = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

export const updateUsers = async (
  userId: number | null,
  data: INewUser
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${url}/${userId}/`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!userId) {
      throw new Error('Failed to update user: empty ID');
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to update user');
    }

    const result: IResponse = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${url}/${userId}/`, {
      method: 'DELETE',
      headers: headers,
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to deleted user');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

export const uploadAvatar = async (
  file: File | null
): Promise<{ message: string; file_path: string }> => {
  try {
    const formData = new FormData();
    if (!file) {
      throw new Error('Upload Avatar is empty');
    }
    formData.append('file', file);

    const response = await fetch(`${url}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to upload Avatar');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error upload Avatar:', error.message);
    throw error;
  }
};