export interface IAgentsPermission {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface IClient {
  address: string;
  first_name: string;
  id?: number;
  id_number: string;
  id_type: string;
  last_name: string;
  mail: string;
  phone_number: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface IExtensions {
  id?: number;
  identity?: string;
  is_active?: boolean;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  password?: string;
  context?: number;
  access_type?: string;
  allocated?: boolean;
  context_def?: IContextDef;
  extensions_agent?: IExtensionsAgent | null;
  service?: IService | number | null;
}

export interface IService {
  id?: number;
  name?: string;
  status?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  retry?: string;
  wrapuptime?: string;
  strategy?: string;
  timeout?: string;
  services_agents?: IServicesAgent[];
  services_categories?: IServicesCategory[];
  supports?: ISupport[];
}

export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  created_at?: Date;
  updated_at?: Date;
  access_type?: string;
}

export interface IAgent {
  id?: number;
  user: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  permission: number;
  agentsPermission?: IAgentsPermission;
  user1?: IUser;
}

export interface IAgentSession{
    status: string | null;
    extension :string | null
    extension_status : string | null;
    pw:  string | null;
}

export interface IServicesCategory {
  id?: number;
  name?: string;
  service?: number | null;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  services?: IService;
  supports_details?: ISupportsDetail[];
}

export interface IUsersAuth {
  id: number;
  username: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  status: string;
  user: number;
  user1?: IUser;
}

export interface IExtensionsAgent {
  id: number;
  agent: number;
  extension: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  agent1?: IAgent;
  extension1?: IExtensions;
}

export interface IServicesAgent {
  id: number;
  service: number;
  extension: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  extensionsAgent?: IExtensionsAgent;
  service1?: IService;
}

export interface ISupport {
  id: number;
  agent?: number;
  client?: number;
  status?: string;
  start_at?: Date;
  end_at?: Date;
  observation?: string;
  service?: number;
  extensions_agent?: IExtensionsAgent;
  clients?: IClient;
  services?: IService;
  supports_details: ISupportsDetail[];
  supports_records: ISupportsRecord[];
}

export interface ISupportsDetail {
  id: number;
  support: number;
  serviceCategory: number;
  observation?: string;
  servicesCategory?: IServicesCategory;
  support1?: ISupport;
}

export interface ISupportsRecord {
  id: number;
  url: string;
  createdAt: Date;
  observation: string;
  support: number;
  support1?: ISupport;
}

export interface IContextDef {
  id: number;
  name?: string;
  permission?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  monitors?: string;
  extensions?: IExtensions[];
}


export interface ICoreUpdatesLog {
  id: number;
  action?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  users?: string;
  identity?: number;
  reference?: string;
}
/**
 * Apps logics types
 */

export interface IResponse {
  message: string;
  id?: number;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type AnyObject = Record<string, any>;