export interface Agent {
  id: number;
  user?: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  permission?: number;
  agents_permissions?: AgentsPermission;
  users?: User;
  extensions_agent?: ExtensionsAgent[];
}

export interface AgentsPermission {
  id: number;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
  agents?: Agent[];
}

export interface Client {
  id: number;
  first_name?: string;
  last_name?: string;
  id_type?: string;
  id_number?: string;
  mail?: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
  phone_number?: string;
  supports?: Support[];
}

export interface ContextDef {
  id: number;
  name?: string;
  permission?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  monitors?: string;
  extensions?: Extension[];
}

export interface Extension {
  id: number;
  identity?: string;
  is_active?: boolean;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  password?: string;
  context?: number;
  access_type?: string;
  allocated?: boolean;
  context_def?: ContextDef;
  extensions_agent?: ExtensionsAgent[];
}

export interface ExtensionsAgent {
  id: number;
  agent?: number;
  extension?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  agents?: Agent;
  extensions?: Extension;
  services_agents?: ServicesAgent[];
  supports?: Support[];
}

export interface Service {
  id: number;
  name?: string;
  status?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  retry?: number;
  wrapuptime?: number;
  strategy?: string;
  timeout?: number;
  identity?: string;
  services_agents?: ServicesAgent[];
  services_categories?: ServicesCategory[];
  supports?: Support[];
}

export interface ServicesAgent {
  id: number;
  service?: number;
  extension?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  extensions_agent?: ExtensionsAgent;
  services?: Service;
}

export interface ServicesCategory {
  id: number;
  name?: string;
  service?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  services?: Service;
  supports_details?: SupportsDetail[];
}

export interface Support {
  id: number;
  agent?: number;
  client?: number;
  status?: string;
  start_at?: Date;
  end_at?: Date;
  observation?: string;
  service?: number;
  extensions_agent?: ExtensionsAgent;
  clients?: Client;
  services?: Service;
  supports_details?: SupportsDetail[];
  supports_records?: SupportsRecord[];
}

export interface SupportsDetail {
  id: number;
  support?: number;
  service_category?: number;
  observation?: string;
  services_categories?: ServicesCategory;
  supports?: Support;
}

export interface SupportsRecord {
  id: number;
  url?: string;
  created_at?: Date;
  observation?: string;
  support?: number;
  supports?: Support;
}

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  avatar?: string;
  created_at?: Date;
  updated_at?: Date;
  access_type?: string;
  agents?: Agent[];
  users_auth?: UserAuth[];
}

export interface UserAuth {
  id: number;
  username?: string;
  password?: string;
  is_active?: boolean;
  is_verified?: boolean;
  status?: string;
  user?: number;
  users?: User;
}

export interface CoreUpdatesLog {
  id: number;
  action?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  users?: string;
  identity?: number;
  reference?: string;
}