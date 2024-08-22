import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import SmallLoader from '../Loader/SmallLoader';

const MainButton = (props: any) => {
  const {
    onPress,
    ButtonName,
    buttonStyle,
    loading,
    disabled: externalDisabled,
  } = props;

  // State to manage the loading visibility
  const [showLoader, setShowLoader] = useState<boolean>(false);

  // State to manage button disabled status internally
  const [internalDisabled, setInternalDisabled] = useState<boolean>(false);

  // Function to handle button press
  const _onPress = () => {
    setShowLoader(true); // Show loader when button is pressed
    setInternalDisabled(true); // Disable button after first click
    onPress && onPress(); // Call the onPress function passed from props

    setTimeout(() => {
      setShowLoader(false); // Hide loader after 1.5 seconds
      setInternalDisabled(false); // Enable button after 1.5 seconds
    }, 2000);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.1}
      style={[styles.button, buttonStyle]}
      onPress={_onPress}
      disabled={internalDisabled || externalDisabled} // Button disabled condition
    >
      {showLoader ? (
        <SmallLoader />
      ) : (
        <Text style={styles.buttonText}>{ButtonName}</Text>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#AC25AC',
    borderRadius: 20,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
});
