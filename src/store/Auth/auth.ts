import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../services/http/http-common';
import {
  activityLoaderFinished,
  activityLoaderStarted,
} from '../Activity/activity';
import {
  navigation,
  otpModal,
  toggleGlobalModal,
} from '../reducer/authSliceState';
import {setLocalStorage} from '../../api/storage';
interface authData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const ProfileData: any = createAsyncThunk(
  'auth/ProfileData',
  async () => {
    try {
      const response: any = await http.get(`/user/profile`);
      if (response.status === 200) {
        // console.log('Profile data api hit ----------');
        await AsyncStorage.setItem(
          'profileData',
          JSON.stringify(response.data),
        );
        return response.data;
      }
    } catch (error: any) {
      console.log('error UserProfile', error);
    }
  },
);

export const setAuthData: any = createAsyncThunk(
  'auth/setAuthData',
  async (_, {dispatch}: any) => {
    try {
      const authToken: any = await AsyncStorage.getItem('authToken');
      const userId: any = await AsyncStorage.getItem('userId');
      const profileData: any = await AsyncStorage.getItem('profileData');

      const authTokenRes = JSON.parse(authToken);
      const userIdRes = JSON.parse(userId);
      const profileRes = JSON.parse(profileData);

      // console.log('test()((()()()', userIdRes, authTokenRes);
      if (userIdRes && authTokenRes) {
        console.log('Go to profile data api ---->');
        dispatch(ProfileData());
      }
      return {token: authTokenRes, userId: userIdRes, profileRes: profileRes};
    } catch (error: any) {
      console.log('Bad request');
      return {error: 'Bad Request'};
    }
  },
);

export const GoogleLogin = createAsyncThunk(
  'auth/GoogleLogin',
  async (data: any, {dispatch}: any) => {
    try {
      // dispatch(activityLoaderStarted());
      console.log('google login data ==>', data);
      const response: any = await http.post('/auth/loginwithgoogle', data);
      if (response.status === 200) {
        console.log('Api google response ==>', JSON.stringify(response.data));
        // return {...response.data, userid: data.socialId};
        return response.data;
      }
    } catch (error: any) {
      console.error('google login  error', error);
      if (error.response && error.response.status === 400) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label:
                'Invalid credentials, Enter valid credentials or create a new account',
            },
          }),
        );
        return {};
      } else {
        throw error;
      }
    }
  },
);
export const AppleLogin = createAsyncThunk(
  'auth/AppleLogin',
  async (data: any, {dispatch}: any) => {
    try {
      // dispatch(activityLoaderStarted());
      console.log('Apple login data ==>', data);
      const response: any = await http.post('/auth/loginwithapple', data);
      if (response.status === 200) {
        console.log('Apple login Response ==>', response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error('Apple login error', error);
      if (error.response && error.response.status === 400) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label:
                'Invalid credentials, Enter valid credentials or create a new account',
            },
          }),
        );
        return {};
      } else {
        throw error;
      }
    }
  },
);

export const LoginSignIn = createAsyncThunk(
  'auth/LoginSignIn',
  async (data: any, {dispatch}: any) => {
    console.log('Login data ==>', data);
    try {
      dispatch(activityLoaderStarted());
      const response: any = await http.post('/user/signin', data);
      if (response.status === 200) {
        await AsyncStorage.setItem(
          'authToken',
          JSON.stringify(response?.data?.token),
        );
        console.log('authToken =>', response?.data?.token);
        await AsyncStorage.setItem(
          'userId',
          JSON.stringify(response?.data?._id),
        );
        console.log('UserID =>', response?.data?._id);
        dispatch(ProfileData());
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: 'Login Successful',
            },
          }),
        );
        // console.log(response?.data, 'loginData---->>>>');
        return response.data;
      }
    } catch (error: any) {
      console.error('first error', error);
      if (error.response && error.response.status === 400) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label:
                'Invalid credentials, Enter valid credentials or create a new account',
            },
          }),
        );
        return {};
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
      const response = await http.post('/user/signup', data);
      if (response.status === 200) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: 'Registration Successful.',
            },
          }),
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('RegisterSignUp', error);
      dispatch(
        toggleGlobalModal({
          visible: true,
          data: {
            text: 'OK',
            label: 'Something went Worng Please try again ',
          },
        }),
      );
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
    }
  },
);

export const EmailVerification = createAsyncThunk(
  'auth/EmailVerification',
  // (navigation:any)=>
  async (data: any, {dispatch}: any) => {
    // dispatch(activityLoaderStarted());
    try {
      const response = await http.post('/user/sendEmailVerification', data);
      if (response.status === 200) {
        response.data.success &&
          dispatch(
            otpModal({
              visible: true,
            }),
          );
        return response.data;
      }
    } catch (error: any) {
      console.error('EmailVerification', error);
      if (error.response && error.response.status === 400) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: 'User already exists',
            },
          }),
        );
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      // dispatch(activityLoaderFinished());
    }
  },
);
export const VerifyOtp = createAsyncThunk(
  'auth/VerifyOtp',
  // (navigation:any)=>
  async (data: any, {dispatch}: any) => {
    try {
      const response = await http.post('/user/verifyOtp', data);

      if (response.status === 200) {
        response.data.success &&
          dispatch(
            otpModal({
              visible: false,
            }),
          );
        return response.data;
      }
    } catch (error: any) {
      console.log('VerifyOtp error', error);
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
    }
  },
);

export const ResetPassword = createAsyncThunk(
  'auth/ForgotPassword',
  async (data: any, {dispatch}: any) => {
    console.log('.........dddddd');
    try {
      const response = await http.post('/user/forgetPassword', data);
      if (response.status === 200) {
        response.data.success &&
          dispatch(
            otpModal({
              visible: true,
            }),
          );
        return response.data;
      }
    } catch (error: any) {
      console.error('EmailVerification', error);
      if (error.response && error.response.status === 400) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: error.response.data.message,
            },
          }),
        );
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      // dispatch(activityLoaderFinished());
    }
  },
);
export const NewPasswordAdd = createAsyncThunk(
  'auth/NewPassword',
  async (data: any, {dispatch}: any) => {
    console.log('000000000000');
    try {
      const response = await http.post('/user/resetPassword', data);
      if (response.status === 200) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: 'Password Reset Successful',
            },
          }),
        );
        response.data.success;
        return response.data;
      }
    } catch (error: any) {
      console.error('resetPassword', error);
      if (error.response && error.response.status === 400) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: 'Same Password',
            },
          }),
        );
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
      // dispatch(activityLoaderFinished());
    }
  },
);

export const uploadImages = createAsyncThunk(
  'auth/uploadImages',
  async (formData: any, {dispatch}: any) => {
    try {
      const response = await http.post('/user/upload', formData, {
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
      const response = await http.patch('/user/update-profile', data);
      if (response.status === 200) {
        if (data.field !== 'profilePercentage') {
          dispatch(ProfileData());
        }
        // console.log('>>>>>>>>>>>>>>', response?.config?.data);
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
    }
  },
);

export const likedAUser = createAsyncThunk(
  'auth/likedAUser',
  async (data: any, {dispatch, rejectWithValue}: any) => {
    // console.log('.........dsfgvadlfghads', data);
    try {
      const response = await http.post('/user/likeUser', data);
      // console.log('res------>>>>>', response);
      if (response.status === 200) {
        console.log('Like by meeee');
        return response.data;
      }
    } catch (error: any) {
      console.log('yyyyyyyyyyyyyyyyyy', error.response.status);
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else if (error.response.status === 403) {
        return rejectWithValue(error.response);
      } else {
        throw error;
      }
    } finally {
      //  dispatch(activityLoaderFinished());
    }
  },
);

export const superLiked = createAsyncThunk(
  'auth/superLiked',
  async (data: any, {dispatch}: any) => {
    console.log('.........dsfgvas', data);
    try {
      const response = await http.post('/user/superLike', data);
      if (response.status === 200) {
        // console.log('Like by meeee', response);
        return response.data;
      }
    } catch (error: any) {
      console.log('superLiked');
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

export const likedMe = createAsyncThunk(
  'auth/likedMe',
  async (data: any, {dispatch}: any) => {
    try {
      const response = await http.get('/user/likedUsers', {
        params: {
          id: data.id,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
      console.log('::::::::::::::', response);
    } catch (error: any) {
      console.error('error LikidMe', error);
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        // console.log(error.response);
        console.log('------------------');
        throw error;
      }
    }
  },
);

export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers',
  async (
    {
      userId,
      checkedInterests,
      showIn,
      distance,
      low,
      high,
      checkedRelationShip,
    }: any,
    {dispatch}: any,
  ) => {
    try {
      // console.log('.d;alfjlajgfladfsg;lad;gh;');
      const response = await http.get('/user/getUsers', {
        params: {
          id: userId,
          checkedInterests: checkedInterests,
          showIn: showIn,
          distance: distance,
          low: low,
          high: high,
          partnerType: checkedRelationShip,
        },
      });
      if (response.status === 200) {
        // console.log('getUsers', response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error('error', error);
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        console.log(error);
        throw error;
      }
    } finally {
      //  dispatch(activityLoaderFinished());
    }
  },
);
export const getChatUsersList = createAsyncThunk(
  'auth/getChatUsersList',
  async ({userId}: any) => {
    console.log('Chat api user ID', userId);
    try {
      const response = await http.get('/users/chatlist', {
        params: {
          id: userId,
        },
      });
      if (response.status === 200) {
        // console.log('//////first', response.data);
        return response.data;
      }
    } catch (error: any) {
      console.log('error..', error);
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

export const getNotifications = createAsyncThunk(
  'auth/getNotifications',
  async ({userId, deviceToken}: any, {dispatch}: any) => {
    // console.log('wueyqierqgrqgrgrq', userId, deviceToken);
    try {
      const response = await http.get('/user/getNotification', {
        params: {
          id: userId || '',
          deviceToken: deviceToken,
        },
      });
      if (response.status === 200) {
        // console.log('dosfihjishifgis', response?.data);
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

export const handleNotificationRead = createAsyncThunk(
  'auth/handleNotificationRead',
  async (id: any, {dispatch}: any) => {
    try {
      const response = await http.delete(`/user/deleteNotification/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    }
  },
);

export const sendAMessage = createAsyncThunk(
  'auth/sendAMessage',
  async (data: any) => {
    // console.log('iegtrwhdfgegkotewrjotjwertwty', data);
    try {
      const response: any = await http.post(`/user/send-message`, data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    }
  },
);

export const reciveMessages = createAsyncThunk(
  'auth/reciveMessages',
  async (data: any, {dispatch}: any) => {
    // console.log('kjihdjbswfhuweufguwbgf..>>>..........>...>...', data);
    try {
      const response = await http.get(
        `/user/messages?senderId=${data.senderId}&receiverId=${data.receiverId}&limit=${data.limit}&skip=${data.skip}`,
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    }
  },
);

export const getReceivers = createAsyncThunk(
  'auth/getReceivers',
  async (data: any, {dispatch}: any) => {
    try {
      const response = await http.get(
        `/user/messageReceivers?senderId=${data.senderId}`,
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (data: any, {dispatch}: any) => {
    try {
      dispatch(activityLoaderStarted());

      const response = await http.delete(
        `/user/delete-account?userId=${data.senderId}`,
      );

      if (response.status === 200) {
        dispatch(updateAuthentication());
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
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (data: any, {dispatch}: any) => {
    // console.log('data', data);
    try {
      console.log('swjdfguwgyduwye');
      dispatch(activityLoaderStarted());
      const response = await http.delete(
        `/user/delete-account?userId=${data.senderId}`,
      );
      if (response.status === 200) {
        // console.log('________________-', response);
        dispatch(updateAuthentication());
        return response.data;
      }
    } catch (error: any) {
      console.error('error deleteUser:', error);
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
export const deactivateUser = createAsyncThunk(
  'auth/deleteUser',
  async (data: any, {dispatch}: any) => {
    console.log('deactivateUser', data);
    try {
      const response = await http.post('/user/deactivateAccount', data);
      if (response.status === 200) {
        console.log('999999999', response?.data?.message);
        return response.data;
      }
    } catch (error: any) {
      console.error('error:', error);
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    }
  },
);

export const updateAuthentication = createAsyncThunk(
  'auth/updateAuthentication',
  async () => {},
);

export const setModal = createAsyncThunk(
  'auth/setModal',
  async (_, {dispatch}: any) => {
    dispatch(
      toggleGlobalModal({
        visible: true,
        data: {
          text: 'OK',
          label: 'Already logged in on another device',
        },
      }),
    );
  },
);

export const setUserId = createAsyncThunk('auth/setUserId', async (id: any) => {
  return {_id: id};
});

export const videoCallToken = createAsyncThunk(
  'auth/videoCallToken',
  async (data: any, {dispatch}: any) => {
    // console.log(',,,,,,VIdeo calll');
    try {
      const response = await http.post(`/user/stream-chat/token`, data);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    }
  },
);
export const blockAUser = createAsyncThunk(
  'auth/likedAUser',
  async (data: any, {dispatch}: any) => {
    try {
      const response = await http.post('/user/blockUser', data);
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
    }
  },
);
export const UnBlockAUser = createAsyncThunk(
  'auth/likedAUser',
  async (data: any, {dispatch}: any) => {
    console.log('selectedUser._id', data);
    try {
      const response = await http.post('/user/unBlockUser', data);
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
    }
  },
);

export const verifyReceipt: any = createAsyncThunk(
  'auth/verifyReceipt',
  async (data: any, {dispatch}: any) => {
    try {
      const response = await http.post('/user/verify-receipt', data);
      if (response.status === 200) {
        console.log('response verifyReceipt', response.data);
        return response.data;
      }
    } catch (error: any) {
      console.log('error verifyReceipt', error);
      if (error.response && error.response.status === 400) {
        return {error: 'Bad Request'};
      } else {
        throw error;
      }
    } finally {
    }
  },
);

export const cancelLoginWithGoogle: any = createAsyncThunk(
  'activityLoader/cancelLoginWithGoogle',
  async (data: any) => {
    return data;
  },
);

const initialState: any = {
  data: {
    status: false,
    signin: {},
    loginwithgoogle: {},
    loginwithapple: {},
    signup: {},
    data: {},
    profileData: null,
    userData: null,
    isProfileDataPresenr: false,
    updateprofileData: {},
    allUsers: [],
    chatUsersList: [],
    allNotifications: [],
    userLike: [],
    meLike: [],
    signInInfo: '',
    otpVerified: false,
    checkDevice: false,
  },
  userID: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  authLoading: true,
};

const Auth: any = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth(state) {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      // GoogleLogin
      .addCase(GoogleLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GoogleLogin.fulfilled, (state, action) => {
        if (action.payload.data) {
          // Check if data is present in the payload
          state.data.loginwithgoogle = action.payload.data;
          state.isAuthenticated = true;
        } else {
          state.data.signInInfo = action.payload.error; // Assuming the error field is set properly on unsuccessful login
        }
      })
      .addCase(GoogleLogin.rejected, (state, action) => {
        state.loading = false;
      })
      // AppleLogin
      .addCase(AppleLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AppleLogin.fulfilled, (state, action) => {
        if (action.payload.data) {
          // Check if data is present in the payload
          state.data.loginwithgoogle = action.payload.data;
          state.isAuthenticated = true;
        } else {
          state.data.signInInfo = action.payload.error; // Assuming the error field is set properly on unsuccessful login
        }
      })
      .addCase(AppleLogin.rejected, (state, action) => {
        state.loading = false;
      })
      // LoginSignIn
      .addCase(LoginSignIn.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(LoginSignIn.fulfilled, (state, action) => {
        // console.log(action.payload.token, '<===action');
        state.token = action?.payload?.token;
        if (action.payload.data) {
          // Check if data is present in the payload
          state.data.signin = action.payload.data;
          state.isAuthenticated = true;
        } else {
          state.data.signInInfo = action.payload.error; // Assuming the error field is set properly on unsuccessful login
        }
        if (!state.userID) {
          console.log('UserId ==>', action.payload.data._id);
          state.userID = action.payload.data._id;
        }
      })
      .addCase(LoginSignIn.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(setAuthData.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(setAuthData.fulfilled, (state, action) => {
        state.data.profileData = action.payload.profileRes;
        state.token = action?.payload?.token;
        state.userID = action?.payload?.userId;
        if (!action?.payload?.token) {
          state.authLoading = false;
        }
      })
      .addCase(setAuthData.rejected, (state, action) => {
        state.authLoading = false;
      })
      // RegisterSignUp
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
      // ProfileData
      .addCase(ProfileData.fulfilled, (state, action) => {
        state.data.profileData = action.payload.data;
        state.loading = false;
        state.authLoading = false;
        if (!state.data.userData) {
          state.data.userData = {
            id: action.payload.data._id,
            name: action.payload.data.name,
            image: action.payload.data.profilePic,
          };
        }
      })
      .addCase(ProfileData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ProfileData.rejected, (state, action) => {
        state.loading = false;
      })
      // updateProfileData
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.data.updateprofileData = action.payload.data;
        state.loading = false;
      })
      .addCase(updateProfileData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateProfileData.rejected, (state, action) => {
        state.loading = false;
      })
      // getAllUsers
      .addCase(getAllUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.data.allUsers = action.payload.users;
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
      })
      // getChatUsersList
      .addCase(getChatUsersList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getChatUsersList.fulfilled, (state, action) => {
        state.data.chatUsersList = action.payload.users;
        state.loading = false;
      })
      .addCase(getChatUsersList.rejected, (state, action) => {
        state.loading = false;
      })
      // getNotifications
      .addCase(getNotifications.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.data.allNotifications = action.payload.notifications;
        state.loading = false;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
      })
      // likedAUser
      .addCase(likedAUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(likedAUser.fulfilled, (state, action) => {
        console.log('oooooooooooo');
        state.data.userLike = action.payload.notifications;
        state.loading = false;
      })
      .addCase(likedAUser.rejected, (state, action: any) => {
        console.log('CAllllllllllllllled', action.payload.status);
        if (action.payload.status === 403) {
          state.data.checkDevice = !state.data.checkDevice;
        }

        state.loading = false;
      })
      .addCase(superLiked.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(superLiked.fulfilled, (state, action) => {
        state.data.userLike = action.payload.notifications;
        state.loading = false;
      })
      .addCase(superLiked.rejected, (state, action) => {
        state.loading = false;
      })
      // likedMe
      .addCase(likedMe.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(likedMe.fulfilled, (state, action) => {
        // state.data.meLike = action.payload.notifications;
        state.loading = false;
      })
      .addCase(likedMe.rejected, (state, action) => {
        state.loading = false;
      })
      // VerifyOtp
      .addCase(VerifyOtp.fulfilled, (state, action) => {
        state.data.otpVerified = action.payload.success;
      })
      .addCase(updateAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.authLoading = false;
        // state.data.status = false;
        // state.data.signin = {};
        // state.data.signup = {};
        // state.data.data = {};
        state.data.profileData = null;
        state.data.isProfileDataPresenr = false;
        state.userID = null;
        // state.data.allUsers = [];
        // state.data.allNotifications = [];
      })
      .addCase(setUserId.fulfilled, (state, action) => {
        state.userID = action?.payload?._id;
      })
      .addCase(verifyReceipt.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(verifyReceipt.fulfilled, (state, action) => {
        // state.data.meLike = action.payload.notifications;
        state.loading = false;
      })
      .addCase(verifyReceipt.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelLoginWithGoogle.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(cancelLoginWithGoogle.fulfilled, (state, action) => {
        state.data.loginwithgoogle = {};
        state.loading = false;
      })
      .addCase(cancelLoginWithGoogle.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {resetAuth} = Auth.actions;
export default Auth.reducer;
