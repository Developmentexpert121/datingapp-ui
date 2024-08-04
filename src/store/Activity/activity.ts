// activityLoaderSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export interface Iprops {
  showGlobalModal?: boolean;
  modalData?: {text?: string; label?: string; cancel: boolean};
}
const initialState: Iprops = {
  showGlobalModal: false,
  modalData: {text: '', label: '', cancel: false},
};

export const activityLoaderStarted: any = createAsyncThunk(
  'activityLoader/activityLoaderStarted',
  async () => {},
);

export const activityLoaderFinished: any = createAsyncThunk(
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
    // console.log('8972348762374576');
    return data;
  },
);
export const authSice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleGlobalModal: (state, action) => {
      state.showGlobalModal = action.payload.visible;
      state.modalData = action?.payload?.data || {text: '', label: ''};
    },
  },
});

export const clientData = createAsyncThunk(
  'activityLoader/clientData',
  async (data: any) => {
    // console.log('8972348762374576');
    return data;
  },
);

const ActivityLoader: any = createSlice({
  name: 'activityLoader',
  initialState: {
    loading: false,
    footerStatus: 'HOME',
    user: null,
    clientData: null,
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
      .addCase(videoCallUser?.fulfilled, (state: any, action: any) => {
        state.user = action.payload.user;
      })
      .addCase(clientData.pending, state => {})
      .addCase(clientData.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.clientData = action.payload;
      })
      .addCase(clientData.rejected, state => {});
  },
});

export default ActivityLoader.reducer;
export const {toggleGlobalModal} = authSice.actions;
// export default authSice.reducer;
