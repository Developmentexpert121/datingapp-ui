import {createSlice} from '@reduxjs/toolkit';
import {getProfile, profileUpdate} from './myProfileAction';
import {RootState} from '../../store';
import {setLocalStorage} from '../../../api/storage';

interface MyProfilePayload {
  profilePic: any;
  name: string;
  email: string;
  gender: string;
  profileCompleted: boolean;
  dob: string;
}

// Define a type for the slice state
interface MyProfilSlice {
  [x: string]: any;
  userProfileData: MyProfilePayload;
  userData: object;
  userProfile: object;
  error: object;
  loading: boolean;
}

// Define the initial state using that type
const initialState: MyProfilSlice = {
  userProfileData: {
    profilePic: '',
    name: '',
    email: '',
    gender: 'MALE',
    dob: '',
    profileCompleted: true,
  },
  loading: false,
  userData: {},
  userProfile: {},
  error: {},
};

export const MyProfilSlice = createSlice({
  name: 'MyProfilSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    userProfileDataResetSlice: state => {
      state.userProfileData = {
        profilePic: '',
        name: '',
        email: '',
        gender: 'MALE',
        dob: '',
        profileCompleted: true,
      };
    },
    userProfileResetSlice: state => {
      state.userProfile = {};
    },

    userProfileDataChange: (state, {payload}) => {
      return {
        ...state,
        userProfileData: {
          ...state.userProfileData,
          [payload?.key]: payload?.value,
        },
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(profileUpdate.pending, state => {
      state.loading = true;
    });
    builder.addCase(profileUpdate.fulfilled, (state, {payload}) => {
      setLocalStorage('isProfileCompleted', true);
      state.userData = payload.data;
      state.loading = false;
    });
    builder.addCase(profileUpdate.rejected, (state, {payload}) => {
      state.loading = false;
    });
    builder.addCase(getProfile.pending, state => {
      state.loading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, {payload}) => {
      setLocalStorage('userProfileData', payload.data);
      state.userProfile = payload.data;
      state.loading = false;
    });
    builder.addCase(getProfile.rejected, state => {
      state.loading = false;
    });
  },
});

export const {
  userProfileDataChange,
  userProfileResetSlice,
  userProfileDataResetSlice,
} = MyProfilSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.MyProfilSlice;

export default MyProfilSlice.reducer;
