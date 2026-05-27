import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Extension {
    identity: string;
    status: string;
}

interface User {
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    phone: string;
    email: string;
    username: string;
    extention: string;
}

interface Service {
    name: string;
    status: string;
    isActive: boolean;
    retry: number;
    wrapuptime: number;
    strategy: string;
    timeout: number;
}
interface FormState {
    extension: Extension;
    service: Service;
    user: User;
}

const initialState: FormState = {
    extension: { identity: '', status: '' },
    service: {
        name: '',
        status: '',
        isActive: false,
        retry: 0,
        wrapuptime: 0,
        strategy: '',
        timeout: 0,
    },
    user: {
        firstName: '',
        lastName: '',
        documentType: '',
        documentNumber: '',
        phone: '',
        email: '',
        username: '',
        extention: '',
    },
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateExtension(state, action: PayloadAction<FormState[ 'extension' ]>) {
            state.extension = action.payload;
        },
        updateService(state, action: PayloadAction<FormState[ 'service' ]>) {
            state.service = action.payload;
        },
        updateUser(state, action: PayloadAction<FormState[ 'user' ]>) {
            state.user = action.payload;
        },
    },
});

export const { updateExtension, updateService, updateUser } = formSlice.actions;
export default formSlice.reducer;
