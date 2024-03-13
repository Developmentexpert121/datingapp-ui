// activityLoaderSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const activityLoaderStarted = createAsyncThunk(
  'activityLoader/activityLoaderStarted',
  async () => {},
);

export const activityLoaderFinished = createAsyncThunk(
  'activityLoader/activityLoaderFinished',
  async () => {},
);

export const footerStatus = createAsyncThunk(
  'activityLoader/footerStatus',
  async (data: any) => {
    return data;
  },
);

export const videoCallUser = createAsyncThunk(
  'activityLoader/videoCallUser',
  async (data: any) => {
    return data;
  },
);

const ActivityLoader: any = createSlice({
  name: 'activityLoader',
  initialState: {
    loading: false,
    footerStatus: 'HOME',
    user: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(activityLoaderStarted.pending, state => {
        state.loading = true;
      })
      .addCase(activityLoaderStarted.fulfilled, state => {
        state.loading = true;
      })
      .addCase(activityLoaderStarted.rejected, state => {
        state.loading = false;
      })
      .addCase(activityLoaderFinished.pending, state => {
        state.loading = true;
      })
      .addCase(activityLoaderFinished.fulfilled, state => {
        state.loading = false;
      })
      .addCase(activityLoaderFinished.rejected, state => {
        state.loading = false;
      })

      .addCase(footerStatus.fulfilled, (state: any, action: any) => {
        state.footerStatus = action.payload.footerStatus;
      })
      .addCase(videoCallUser.fulfilled, (state: any, action: any) => {
        state.user = action.payload.user;
      });
  },
});

export default ActivityLoader.reducer;
