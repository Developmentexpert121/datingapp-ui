import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {googleScopes} from '../api/constants';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

// import {GOOGLE_WEB_CLIENT_ID, GOOGLE_CLIENT_ID_IOS} from '@env';

export const configureGoogleSignIn = async () => {
  await GoogleSignin.configure({
    // scopes: googleScopes,
    webClientId:
      '926614695799-nq2mij6q6a8ok8oomurtl962kd3d62pd.apps.googleusercontent.com',
    offlineAccess: false,
    // hostedDomain: '',
    // accountName: '',
    iosClientId:
      '1097775841702-3616366houm9b5durv1ndpnv3779f07p.apps.googleusercontent.com',
  });
};

export const googleLogin = async () => {
  configureGoogleSignIn();
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    console.log('00000000', GoogleSignin);
    const userInfo = await GoogleSignin.signIn();
    console.log('111111111111');
    return userInfo?.user;
  } catch (error) {
    console.log('hhhh', error);
  }
};

/////   Apple Login //
// export async function onAppleButtonPress() {
//   try {
//     // performs login request
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
//       return userInfo;
//     }

//     // get current authentication state for user
//     // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
//     const credentialState = await appleAuth.getCredentialStateForUser(
//       appleAuthRequestResponse.user,
//     );

//     // use credentialState response to ensure the user is authenticated
//     if (credentialState === appleAuth.State.AUTHORIZED) {
//       // user is authenticated
//     }
//   } catch (error) {
//     console.log('Apple Authentication Error:', error);
//     // handle error
//   }
// }
