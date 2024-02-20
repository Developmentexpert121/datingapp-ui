import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../services/http/http-common';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from '../Activity/activity';
interface authData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const ProfileData = createAsyncThunk(
  'auth/ProfileData',
  async (id: any, {dispatch}: any) => {
    try {
      const response: any = await http.get(`/user/profile?id=${id}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      }
    }
  },
);

export const LoginSignIn = createAsyncThunk(
  'auth/LoginSignIn',
  async (data: any, {dispatch}: any) => {
    try {
      dispatch(activityLoaderStarted());
      const response: any = await http.post('/user/signin', data);

      if (response.status === 200) {
        await AsyncStorage.setItem(
          'authToken',
          JSON.stringify(response?.data?.token),
        );
        await AsyncStorage.setItem(
          'userId',
          JSON.stringify(response?.data?._id),
        );
        await dispatch(ProfileData(response?.data?._id));
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      dispatch(activityLoaderFinished());
    }
  },
);

export const RegisterSignUp = createAsyncThunk(
  'auth/RegisterSignUp',
  async (data: any, {dispatch}: any) => {
    try {
      // dispatch(activityLoaderStarted());
      const response = await http.post('/user/signup', data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      // dispatch(activityLoaderFinished());
    }
  },
);

export const UploadImage = createAsyncThunk(
  'auth/UploadImage',
  async (formData: any, {dispatch}: any) => {
    try {
      //  dispatch(activityLoaderStarted());
      const response = await http.post('/user/upload-pic', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      //  dispatch(activityLoaderFinished());
    }
  },
);

export const updateProfileData = createAsyncThunk(
  'auth/updateProfileData',
  async (data: any, {dispatch}: any) => {
    try {
      //  dispatch(activityLoaderStarted());

      const response = await http.patch('/user/update-profile', data);
      if (response.status === 200) {
        dispatch(ProfileData(data.id._j));
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      //  dispatch(activityLoaderFinished());
    }
  },
);

export const updateAuthentication = createAsyncThunk(
  'auth/updateAuthentication',
  async () => {},
);

const Auth: any = createSlice({
  name: 'auth',
  initialState: {
    data: {
      status: false,
      signin: {},
      signup: {},
      data: {},
      profileData: {},
    },
    isAuthenticated: false,
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(LoginSignIn.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(LoginSignIn.fulfilled, (state, action) => {
        state.data.signin = action.payload.data;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(LoginSignIn.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(RegisterSignUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(RegisterSignUp.fulfilled, (state, action) => {
        state.data.signup = action.payload.data;
        state.loading = false;
      })
      .addCase(RegisterSignUp.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(ProfileData.fulfilled, (state, action) => {
        state.data.profileData = action.payload.data;
        state.loading = false;
      })
      .addCase(ProfileData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ProfileData.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(updateAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = false;
      });
  },
});

export default Auth.reducer;
