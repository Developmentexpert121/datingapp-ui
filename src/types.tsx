import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined;
  Loginhome: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ChatScreen: undefined;
  Liked: undefined;
  Notification: undefined;
  Filter: undefined;
  Explore: undefined;
  Settings: undefined;
  Subscriptions: undefined;
  UpdateProfile: undefined;
  ChatPage: undefined;
  VideoCallRedirect: undefined;
  OtpScreen: undefined;
  ForgotPassword: undefined;
  NewPassword: any;
  exploreHome: any;
  AfterLogin: any;
  filterSection: any;
  NotificationScreen: any;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
