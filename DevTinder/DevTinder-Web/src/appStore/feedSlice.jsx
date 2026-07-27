import { createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
    name: 'feed',
    initialState: [],
    reducers: {
        setFeed: (state, action) => {
            return action.payload;
        },
        removeSpecificFeed: (state,action) => {
            return state.filter((r)=> r._id !== action.payload)
        }
    },
});

export const { setFeed, removeSpecificFeed } = feedSlice.actions;

export default feedSlice.reducer;