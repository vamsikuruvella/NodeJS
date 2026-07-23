import { createSlice } from '@reduxjs/toolkit'

const connectionSlice = createSlice({
    name: 'connections',
    initialState: [],
    reducers: {
        setConnections: (state, action) => {
            return action.payload;
        },
        removeConnections: (state) => {
            return null;
        }
    },
});

export const { setConnections, removeConnections } = connectionSlice.actions;

export default connectionSlice.reducer;