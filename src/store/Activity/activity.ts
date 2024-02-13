// activityLoaderSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const activityLoaderStarted = createAsyncThunk('activityLoader/activityLoaderStarted', async () => {
});

export const activityLoaderFinished = createAsyncThunk('activityLoader/activityLoaderFinished', async () => {
});

const ActivityLoader:any = createSlice({
  name: 'activityLoader',
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(activityLoaderStarted.pending, (state) => {
        state.loading = true;
      })
      .addCase(activityLoaderStarted.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activityLoaderStarted.rejected, (state) => {
        state.loading = false;
      })
      .addCase(activityLoaderFinished.pending, (state) => {
        state.loading = true;
      })
      .addCase(activityLoaderFinished.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activityLoaderFinished.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default ActivityLoader.reducer;
