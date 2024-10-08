import {createSlice} from '@reduxjs/toolkit';

export interface Iprops {
  showGlobalModal?: boolean;
  modalData?: {text?: string; label?: string; cancel: boolean};
  showOnlineUser?: [];
  showOtpModal?: boolean;
  showLoader?: boolean;
  isNavigate?: string;
  isLoggedin: boolean;
  countrycitystate: {};
}
const initialState: Iprops = {
  showGlobalModal: false,
  modalData: {text: '', label: '', cancel: false},
  showOnlineUser: [],
  showOtpModal: false,
  showLoader: false,
  isNavigate: '',
  isLoggedin: false,
  countrycitystate: {},
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
      state.showOnlineUser = payload;
    },
    countrycitystate: (state, {payload}) => {
      state.countrycitystate = payload;
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
  countrycitystate,
} = authSice.actions;
export default authSice.reducer;
