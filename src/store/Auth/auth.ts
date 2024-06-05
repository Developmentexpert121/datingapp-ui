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
interface authData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const ProfileData = createAsyncThunk('auth/ProfileData', async () => {
  try {
    const response: any = await http.get(`/user/profile`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.log('12345', error);

      return {error: 'Bad Request'};
    }
  }
});

export const GoogleLogin = createAsyncThunk(
  'auth/GoogleLogin',
  async (data: any, {dispatch}: any) => {
    // console.log('////////////////////', data);
    try {
      // dispatch(activityLoaderStarted());
      const response: any = await http.post('/auth/loginwithgoogle', data);
      // console.log('response', response.data.redirect);
      if (response.status === 200) {
        // if (response.data.redirect === 'Steps') {
        //   navigation('Register');
        // } else {
        // await AsyncStorage.setItem(
        //   'authToken',
        //   JSON.stringify(response?.data?.token),
        // );
        // await AsyncStorage.setItem(
        //   'userId',
        //   JSON.stringify(response?.data?._id),
        // );
        // console.log('dfjdfhjhjdf', response?.data, response?.data?._id);
        // dispatch(ProfileData());
        // dispatch(
        //   toggleGlobalModal({
        //     visible: true,
        //     data: {
        //       text: 'OK',
        //       label: 'Login Successful',
        //     },
        //   }),
        // );
        // }
        return response.data;
      }
    } catch (error: any) {
      console.log('first error', error);
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
    //  finally {
    // dispatch(activityLoaderFinished());
    // }
  },
);
export const AppleLogin = createAsyncThunk(
  'auth/AppleLogin',
  async (data: any, {dispatch}: any) => {
    try {
      // dispatch(activityLoaderStarted());
      const response: any = await http.post('/auth/loginwithapple', data);
      // console.log(':::::::::', response);
      if (response.status === 200) {
        // await AsyncStorage.setItem(
        //   'authToken',
        //   JSON.stringify(response?.data?.token),
        // );
        // await AsyncStorage.setItem(
        //   'userId',
        //   JSON.stringify(response?.data?._id),
        // );
        // console.log('dfjdfhjhjdf', response?.data, response?.data?._id);
        // dispatch(ProfileData());
        // dispatch(
        //   toggleGlobalModal({
        //     visible: true,
        //     data: {
        //       text: 'OK',
        //       label: 'Login Successful',
        //     },
        //   }),
        // );
        return response.data;
      }
    } catch (error: any) {
      console.log('first error', error);
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
    // finally {
    //   dispatch(activityLoaderFinished());
    // }
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
        console.log('token Login', response?.data?.token);
        await AsyncStorage.setItem(
          'userId',
          JSON.stringify(response?.data?._id),
        );
        console.log('dfjdfhjhjdf', response?.data, response?.data?._id);
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
        return response.data;
      }
    } catch (error: any) {
      console.log('first error', error);
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
      console.log('RegisterSignUp Data', data);
      const response = await http.post('/user/signup', data);
      if (response.status === 200) {
        dispatch(
          toggleGlobalModal({
            visible: true,
            data: {
              text: 'OK',
              label: 'Registration Successful, Please Login now.',
            },
          }),
        );
        return response.data;
      }
    } catch (error: any) {
      console.log('RegisterSignUp', error);
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
      console.log('EmailVerification', error);
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
      console.log(response.data);
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

// export const UploadImage = createAsyncThunk(
//   'auth/UploadImage',
//   async (formData: any, {dispatch}: any) => {
//     try {
//       //  dispatch(activityLoaderStarted());
//       const response = await http.post('/user/upload-pic', formData, {
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (response.status === 200) {
//         return response.data;
//       }
//     } catch (error: any) {
//       if (error.response && error.response.status === 400) {
//         return {error: 'Bad Request'};
//       } else {
//         throw error;
//       }
//     } finally {
//       //  dispatch(activityLoaderFinished());
//     }
//   },
// );

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
      //  dispatch(activityLoaderStarted());
      // console.log('Updating Data', data);
      const response = await http.patch('/user/update-profile', data);
      if (response.status === 200) {
        dispatch(ProfileData());
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

export const likedAUser = createAsyncThunk(
  'auth/likedAUser',
  async (data: any, {dispatch}: any) => {
    try {
      const response = await http.post('/user/likeUser', data);
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

export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers',
  async (
    {userId, checkedInterests, showIn, distance, low, high}: any,
    {dispatch}: any,
  ) => {
    try {
      // console.log('.checkedInte', checkedInterests);
      const response = await http.get('/user/getUsers', {
        params: {
          id: userId,
          checkedInterests: checkedInterests,
          showIn: showIn,
          distance: distance,
          low: low,
          high: high,
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
export const getChatUsersList = createAsyncThunk(
  'auth/getChatUsersList',
  async ({userId}: any) => {
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
  async (userId: any, {dispatch}: any) => {
    try {
      const response = await http.get('/user/getNotification', {
        params: {id: userId},
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

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (data: any, {dispatch}: any) => {
    console.log('data', data.senderId);
    try {
      dispatch(activityLoaderStarted());
      console.log('Reachedddddddd', data);
      const response = await http.delete(
        `/user/delete-account?userId=${data.senderId}`,
      );
      console.log('response', response);
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
export const logoutUser = createAsyncThunk(
  'auth/deleteUser',
  async (data: any, {dispatch}: any) => {
    console.log('data', data.senderId);
    try {
      dispatch(activityLoaderStarted());
      // const response = await http.delete(
      //   `/user/delete-account?userId=${data.senderId}`,
      // );
      // console.log('response', response);
      // if (response.status === 200) {
      //   dispatch(updateAuthentication());
      //   return response.data;
      // }
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

export const updateAuthentication = createAsyncThunk(
  'auth/updateAuthentication',
  async () => {},
);

export const videoCallToken = createAsyncThunk(
  'auth/videoCallToken',
  async (data: any, {dispatch}: any) => {
    console.log(',,,,,,VIdeo calll');
    try {
      const response = await http.post(`/user/stream-chat/token`, data);

      if (response.status === 200) {
        console.log(',,,,,VIdeo calll200');
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

const initialState = {
  data: {
    status: false,
    signin: {},
    loginwithgoogle: {},
    loginwithapple: {},
    signup: {},
    data: {},
    profileData: {},
    allUsers: [],
    chatUsersList: [],
    allNotifications: [],
    signInInfo: '',
    otpVerified: false,
  },
  isAuthenticated: false,
  loading: false,
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
        // console.log('2222222222222222');
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
        if (action.payload.data) {
          // Check if data is present in the payload
          state.data.signin = action.payload.data;
          state.isAuthenticated = true;
        } else {
          state.data.signInInfo = action.payload.error; // Assuming the error field is set properly on unsuccessful login
        }
      })
      .addCase(LoginSignIn.rejected, (state, action) => {
        state.loading = false;
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
      })
      .addCase(ProfileData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ProfileData.rejected, (state, action) => {
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
      // VerifyOtp
      .addCase(VerifyOtp.fulfilled, (state, action) => {
        // console.log('/////////', action.payload);
        state.data.otpVerified = action.payload.success;
      })
      .addCase(updateAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        // state.data.status = false;
        // state.data.signin = {};
        // state.data.signup = {};
        // state.data.data = {};
        // state.data.profileData = {};
        // state.data.allUsers = [];
        // state.data.allNotifications = [];
      });
  },
});

export const {resetAuth} = Auth.actions;
export default Auth.reducer;
