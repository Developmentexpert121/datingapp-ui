import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Root from './src/navigation/Root';
import GlobalModal from './src/components/Modals/GlobalModal';
import {withIAPContext} from 'react-native-iap';
import InternetModal from './src/components/Modals/InternetModal';
import {navigationRef} from './src/utils/staticNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LocationCheckComponent from './src/components/location/location';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {Text, TextInput} from 'react-native';

const App = () => {
  //@ts-ignore
  Text.defaultProps = Text.defaultProps || {};
  //@ts-ignore
  Text.defaultProps.allowFontScaling = false;
  //@ts-ignore
  TextInput.defaultProps = TextInput.defaultProps || {};
  //@ts-ignore
  TextInput.defaultProps.allowFontScaling = false;

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <Provider store={store}>
        <LocationCheckComponent>
          <NavigationContainer ref={navigationRef}>
            <Root />
            <GlobalModal />
            <InternetModal />
          </NavigationContainer>
        </LocationCheckComponent>
      </Provider>
    </SafeAreaProvider>
  );
};

export default withIAPContext(App);
