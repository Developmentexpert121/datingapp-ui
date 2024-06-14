import {createSlice} from '@reduxjs/toolkit';

export interface Iprops {
  showGlobalModal?: boolean;
  modalData?: {text?: string; label?: string; cancel: boolean};
  showOnlineUser?: [];
  showOtpModal?: boolean;
  showLoader?: boolean;
  isNavigate?: string;
  isLoggedin: boolean;
}
const initialState: Iprops = {
  showGlobalModal: false,
  modalData: {text: '', label: '', cancel: false},
  showOnlineUser: [],
  showOtpModal: false,
  showLoader: false,
  isNavigate: '',
  isLoggedin: false,
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
    setAuthentication: (state, {payload}) => {
      state.isLoggedin = payload;
    },
    onlineUser: (state, {payload}) => {
      console.log('lswfreiqhfitehifgtjruae', payload);
      state.showOnlineUser = payload;
    },
    // onlineUser: (state, action) => {
    //   state.showOnlineUser = action.payload.visible;
    // },

    resetSlice: state => {
      // state.userSignUpData = {
      //   loginType: 'EMAIL',
      //   role: 'U',
      //   email: '',
      //   password: '',
      //   confirmPassword: '',
      //   deviceToken: 'dhjjhhhjhkjhdskhhsdkhdsh',
      // };
      // state.userLoginData = {
      //   loginType: 'EMAIL',
      //   role: 'U',
      //   email: '',
      //   deviceToken: 'jkhreehhh',
      //   password: '',
      // };
      state.isLoggedin = false;
      // state.apiError = undefined;
      // removeLocalStorage('token');
      // removeLocalStorage('isProfileCompleted');
      // removeLocalStorage('userProfileData');
    },
  },
});

export const {
  toggleGlobalModal,
  otpModal,
  globaLoader,
  navigation,
  setAuthentication,
  onlineUser,
} = authSice.actions;
export default authSice.reducer;
