import AsyncStorage from '@react-native-async-storage/async-storage';

//resusable function to store data in local storage of device
export const setLocalStorage = async (storageKey: string, data: any) => {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};

//resusable function to read data in local storage of device
export const getLocalStroage = async (storageKey: string) => {
  try {
    const value = await AsyncStorage.getItem(storageKey);
    if (value !== null) {
      const _value = JSON.parse(value);
      return _value;
    }
  } catch (e) {
    console.log(e);
  }
};

//resusable function to remove data in local storage of device
export const removeLocalStorage = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(storageKey);
    return true;
  } catch (e) {
    return false;
  }
};
