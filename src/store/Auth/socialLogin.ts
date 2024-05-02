import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {googleScopes} from '../api/constants';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

// import {GOOGLE_WEB_CLIENT_ID, GOOGLE_CLIENT_ID_IOS} from '@env';

export const configureGoogleSignIn = async () => {
  await GoogleSignin.configure({
    // scopes: googleScopes, // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '1074716618334-m6trdmrc4b3tojpaaufbslg616vt1al7.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: false,
    hostedDomain: '',
    accountName: '',
    // iosClientId: GOOGLE_CLIENT_ID_IOS,
  });
};

export const _googleLogin = async () => {
  //function to sign in google account
  configureGoogleSignIn();
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const userInfo = await GoogleSignin.signIn();
    return userInfo?.user;
  } catch (error) {
    console.log('dansdasndn', error);
  }
};

/////   Apple Login //
export async function onAppleButtonPress() {
  try {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // other fields are available, but full name is not
    if (appleAuthRequestResponse?.identityToken) {
      const userInfo = await jwt_decode(
        appleAuthRequestResponse?.identityToken,
      );
      return userInfo;
    }

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  } catch (error) {
    console.log('Apple Authentication Error:', error);
    // handle error
  }
}
