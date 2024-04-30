import {createSlice} from '@reduxjs/toolkit';

export interface Iprops {
  showGlobalModal?: boolean;
  modalData?: {text?: string; label?: string; cancel: boolean};
  showOtpModal?: boolean;
  showLoader?: boolean;
  isNavigate?: string;
}
const initialState: Iprops = {
  showGlobalModal: false,
  modalData: {text: '', label: '', cancel: false},
  showOtpModal: false,
  showLoader: false,
  isNavigate: '',
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
      state.showOtpModal = action.payload.visible;
    },
    globaLoader: (state, action) => {
      state.showLoader = action.payload;
    },
    navigation: (state, action) => {
      state.isNavigate = action.payload;
    },
  },
});

export const {toggleGlobalModal, otpModal, globaLoader, navigation} =
  authSice.actions;
export default authSice.reducer;
