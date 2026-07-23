import { createSlice } from '@reduxjs/toolkit'

const connectionStore = createSlice({
    name: 'connections',
    initialState: [],
    reducers: {
        setConnections: (state, action) => {
            return action.payload;
        },
        removeConnections: (state) => {
            return [];
        }
    },
});

export const { setConnections, removeConnections } = connectionStore.actions;

export default connectionStore.reducer;