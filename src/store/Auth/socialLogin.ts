import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';
// import {GOOGLE_WEB_CLIENT_ID, GOOGLE_CLIENT_ID_IOS} from '@env';

const configureGoogleSignIn = async () => {
  await GoogleSignin.configure({
    // scopes: googleScopes,
    // scopes: ['email', 'profile'],
    webClientId:
      '151623051367-b882b5sufigjbholkehodmi9ccn4hv6m.apps.googleusercontent.com',
    offlineAccess: true,
    // hostedDomain: '',
    // accountName: '',
  });
};

export const googleLogin = async () => {
  configureGoogleSignIn();
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    console.log('00000000', GoogleSignin);
    const userInfo = await GoogleSignin.signIn();
    return userInfo?.user;
  } catch (error) {
    console.log('error NETWORK_ERROR', error);
  }
};

///// ************************  Apple Login //

export async function onAppleButtonPress() {
  try {
    // Perform login request with requested scopes
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    // Decode identity token if available
    if (appleAuthRequestResponse?.identityToken) {
      const userInfo = jwtDecode(appleAuthRequestResponse?.identityToken);
      return userInfo;
    } else {
      throw new Error('No identity token returned');
    }
  } catch (error: any) {
    console.error('Apple Authentication Error:', error);
    return null; // Handle the error as appropriate for your app
  }
}

// *****************************Facebook Login //
// const handleFacebookLogin = async () => {
//   try {
//     console.log('asdfdsa cancelled');
//     const result = await LoginManager.logInWithPermissions([
//       'public_profile',
//       'email',
//     ]);
//     console.log('first', LoginManager);
//     if (result.isCancelled) {
//       console.log('......Login cancelled');
//     } else {
//       const data = await AccessToken.getCurrentAccessToken();
//       if (!data) {
//         console.log('Something went wrong obtaining access token');
//       } else {
//         console.log(
//           'Login success with permissions: ' +
//             result.grantedPermissions.toString(),
//         );
//         console.log('Access Token: ' + data.accessToken.toString());
//       }
//     }
//   } catch (error) {
//     console.log('Login fail with error: ' + error);
//   }
// };
