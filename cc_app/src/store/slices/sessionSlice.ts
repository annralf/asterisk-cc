import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';


interface ISession {
    userType: string
}

interface ISessionState {
    session: ISession | null
}

const initialState: ISessionState = {
    session : null
}

const sessionSlice = createSlice({
    name:'session',
    initialState,
    reducers:{
        setSession: (state, action: PayloadAction<ISession>) => {
            state.session = action.payload;
        },
        clearSession: (state) => {
            state.session = null
        }
    }
});

export const { setSession, clearSession} = sessionSlice.actions;

export default sessionSlice.reducer;

export const getSession = (state: RootState): ISession | null => state.session.session;