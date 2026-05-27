export interface IAgent {
    id: string;
    user?: number;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
    users?: IUser;
    extensions_agent: IExtensionsAgent[];
  }
  
  export interface IClient {
    id: string;
    first_name?: string;
    last_name?: string;
    id_type?: string;
    id_number?: string;
    mail?: string;
    address?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    phone_number?: string;
    supports: ISupport[];
  }
  
  export interface IService {
    id: string;
    name?: string;
    status?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    retry?: number;
    wrapup_time?: number;
    services_agents: IServicesAgent[];
    services_categories: IServicesCategory[];
    supports: ISupport[];
  }
  
  export interface IServicesCategory {
    id: string;
    name?: string;
    service?: number;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    services?: IService;
    supports_details: ISupportDetail[];
  }
  
  export interface ISupport {
    id: string;
    agent?: number;
    client?: number;
    status?: string;
    start_at?: Date;
    end_at?: Date;
    observation?: string;
    service?: number;
    agents?: IExtensionsAgent;
    clients?: IClient;
    services?: IService;
    supports_details: ISupportDetail[];
    supports_records: ISupportRecord[];
  }
  
  export interface ISupportDetail {
    id: string;
    support?: number;
    service_category?: number;
    observation?: string;
    services_categories?: IServicesCategory;
    supports?: ISupport;
  }
  
  export interface ISupportRecord {
    id: string;
    url?: string;
    created_by?: Date;
    observation?: string;
    support?: number;
    supports?: ISupport;
  }
  
  export interface IUser {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    avatar?: string;
    created_at?: Date;
    updated_at?: Date;
    agents: IAgent[];
    users_auth: IUsersAuth[];
  }
  
  export interface IUsersAuth {
    id: string;
    username?: string;
    password?: string;
    is_active?: boolean;
    is_verified?: boolean;
    status?: string;
    user?: number;
    users?: IUser;
  }
  
  export interface IExtension {
    id: string;
    identity?: string;
    is_active?: boolean;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
    extensions_agent: IExtensionsAgent[];
  }
  
  export interface IExtensionsAgent {
    id: string;
    agent?: number;
    extension?: number;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    agents?: IAgent;
    extensions?: IExtension;
    services_agents: IServicesAgent[];
    supports: ISupport[];
  }
  
  export interface IServicesAgent {
    id: string;
    service?: number;
    extension?: number;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    extensions_agent?: IExtensionsAgent;
    services?: IService;
  }

  
  export interface ITab {
    title: string;
    total: number;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}