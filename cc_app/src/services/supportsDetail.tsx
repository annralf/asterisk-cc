'use client';

import { ISupportsDetail, ISupport, IResponse, IPagination, IServicesCategory } from 'src/types/app';
import { headers } from 'src/utils/services';

const API =  process.env.NEXT_PUBLIC_SERVICE_API_URL as string || '/api';
const url = `${API}/support/details/`;

export interface ISupportDetailUpdate {
  id?: number;
  support?: number;
  serviceCategory?: number;
  observation?: string;
  servicesCategory?: IServicesCategory;
  support1?: ISupport;
}