import {createSlice} from '@reduxjs/toolkit';

export interface Iprops {
  showGlobalModal?: boolean;
  modalData?: {text?: string; label?: string; cancel: boolean};
  showOtpModal?: boolean;
}
const initialState: Iprops = {
  showGlobalModal: false,
  modalData: {text: '', label: '', cancel: false},
  showOtpModal: false,
};
export const authSice = createSlice({
  name: 'authSice',
  initialState,
  reducers: {
    toggleGlobalModal: (state, action) => {
      state.showGlobalModal = action.payload.visible;
      state.modalData = action?.payload?.data || {text: '', label: ''};
    },
    otpModal: (state, action) => {
      state.showOtpModal = action.payload;
    },
  },
});

export const {toggleGlobalModal, otpModal} = authSice.actions;
export default authSice.reducer;
