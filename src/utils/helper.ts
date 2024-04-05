import { countryCodes } from "react-native-country-codes-picker";


export function findFlagByDialCode(dialCode: string) {
    // Find the country object with the given dial_code
    const country = countryCodes.find(
      (country) => country.dial_code === dialCode
    );
  
    // If the country is found, return its flag; otherwise, return null or any default value
    return country ? country.flag : null;
  }
  export const findScrollEnd = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: any;
    contentOffset: any;
    contentSize: any;
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };