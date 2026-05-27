import { ITab } from "@/src/utils/interfaces";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../store";

interface TabAgentPanel {
    tabs: ITab[];
}

const initialState: TabAgentPanel = {
    tabs: [],
};

const tabAgentePanel = createSlice({
    name: 'tab-agent-panel',
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<ITab>) => {
            state.tabs.push(action.payload);
        },
        removeTab: (state, action: PayloadAction<number>) => {
            state.tabs.splice(action.payload, 1);
        },
        updateTab: (state, action: PayloadAction<{ index: number; tab: ITab }>) => {
            const { index, tab } = action.payload;
            state.tabs[index] = tab;
        },
    },
});

export const { addTab, removeTab, updateTab } = tabAgentePanel.actions;
export default tabAgentePanel.reducer;

export const selectTabsState = (state: RootState) => state.tabPanel.tabs;
