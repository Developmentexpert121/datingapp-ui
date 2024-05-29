import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {appleAuth} from '@invertase/react-native-apple-authentication';
const jwtDecode = require('jwt-decode'); // Use CommonJS require syntax

// import {appleAuth} from '@invertase/react-native-apple-authentication';
// import jwt_decode from 'jwt-decode';

// import {GOOGLE_WEB_CLIENT_ID, GOOGLE_CLIENT_ID_IOS} from '@env';

export const configureGoogleSignIn = async () => {
  await GoogleSignin.configure({
    // scopes: googleScopes,
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
    // console.log('00000000', GoogleSignin);
    const userInfo = await GoogleSignin.signIn();
    // console.log('111111111111');
    return userInfo?.user;
  } catch (error) {
    console.log('error NETWORK_ERROR', error);
  }
};

///// ************************  Apple Login //
export async function onAppleButtonPress() {
  console.log('111111111111');
  try {
    // Perform login request with requested scopes
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Log the response for debugging purposes
    console.log('appleAuth:', appleAuth);

    console.log('AppleAuthRequestResponse:', appleAuthRequestResponse);

    // Decode identity token if available
    if (appleAuthRequestResponse?.identityToken) {
      const userInfo = jwtDecode(appleAuthRequestResponse.identityToken); // Correct function usage
      console.log('User Info:', userInfo);
      return userInfo;
    } else {
      throw new Error('No identity token returned');
    }
  } catch (error: any) {
    console.error('Apple Authentication Error:', error);
    if (error.code) {
      switch (error.code) {
        case appleAuth.Error.CANCELED:
          console.log('User canceled the sign-in request');
          break;
        case appleAuth.Error.UNKNOWN:
          console.log('Unknown error occurred during Apple Sign-In');
          break;
        case appleAuth.Error.INVALID_RESPONSE:
          console.log('Invalid response from Apple Sign-In');
          break;
        case appleAuth.Error.NOT_HANDLED:
          console.log('Sign-In request not handled');
          break;
        case appleAuth.Error.FAILED:
          console.log('Sign-In request failed');
          break;
        default:
          console.log('Unhandled error code:', error.code);
          break;
      }
    } else {
      console.log('Unhandled error:', error);
    }

    return null; // Handle the error as appropriate for your app
  }
}

// export async function onAppleButtonPress() {
//   try {
//     // performs login request
//     console.log('first');
//     const appleAuthRequestResponse = await appleAuth.performRequest({
//       requestedOperation: appleAuth.Operation.LOGIN,
//       // Note: it appears putting FULL_NAME first is important, see issue #293
//       requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
//     });

//     // other fields are available, but full name is not
//     if (appleAuthRequestResponse?.identityToken) {
//       const userInfo = await jwt_decode(
//         appleAuthRequestResponse?.identityToken,
//       );
//       console.log('999999', userInfo);
//       return userInfo;
//     }

//     // get current authentication state for user
//     // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
//     const credentialState = await appleAuth.getCredentialStateForUser(
//       appleAuthRequestResponse.user,
//     );
//     console.log('999999', appleAuth);
//     // use credentialState response to ensure the user is authenticated
//     if (credentialState === appleAuth.State.AUTHORIZED) {
//       // user is authenticated
//     }
//   } catch (error) {
//     console.log('Apple Authentication Error:', error);
//     // handle error
//   }
// }

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
