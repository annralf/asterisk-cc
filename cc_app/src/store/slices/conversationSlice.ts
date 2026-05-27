import type { PayloadAction } from '@reduxjs/toolkit';
//import type { IClient, ISupport} from 'src/utils/interfaces';

import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';


interface IClient {
    id: string;
    name: string;
  }
  
  interface ISupport {
    id: string;
    message: string;
    timestamp: string;
  }

interface ISupportState {
  support: ISupport[]; // Lista de conversaciones (llamadas)
  client: IClient | null; // Información del cliente seleccionado
}

const initialState: ISupportState = {
  support: [], // Inicialmente vacío
  client: null,
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setSupport: (state, action: PayloadAction<ISupport[]>) => {
      state.support = action.payload;
    },
    setClient: (state, action: PayloadAction<IClient>) => {
      state.client = action.payload;
    },
    clearSelectedClient: (state) => {
      state.client = null;
    },

  },
});

export const {
  setSupport,
  setClient,
  clearSelectedClient,
} = supportSlice.actions;

export default supportSlice.reducer;

export const selectSupportState = (state: RootState) => state.support.support;

export const selectClientState = (state: RootState) => state.support.client;