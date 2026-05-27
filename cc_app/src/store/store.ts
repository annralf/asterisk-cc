import { configureStore } from '@reduxjs/toolkit';
import supportReducer from 'src/store/slices/conversationSlice';
import sessionReducer from 'src/store/slices/sessionSlice';
import tabAgentePanel from 'src/store/slices/agentSlice';
import formReducer from 'src/store/slices/stepFormSlice';

export const store = configureStore({
  reducer: {
    support: supportReducer, 
    session: sessionReducer,
    tabPanel: tabAgentePanel,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;