import {createAsyncThunk, SerializedError} from '@reduxjs/toolkit';
import {ProfileData} from '../../Auth/auth';

interface LoginResponse {
  data: {[x: string]: string};
  code: number;
  message: string;
}

// Thunk for updating user profile
export const profileUpdate = createAsyncThunk<
  LoginResponse,
  any,
  {rejectValue: SerializedError}
>('user/profileUpdate', async (data: any, thunkApi: any) => {
  try {
    const response = await ProfileData.profileUpdate(data);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error as SerializedError);
  }
});

// Thunk for getting user profile
export const getProfile = createAsyncThunk<
  LoginResponse,
  void,
  {rejectValue: SerializedError}
>('/user/profile', async (data: any, thunkApi: any) => {
  try {
    const response = await ProfileData.getProfile();
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error as SerializedError);
  }
});
