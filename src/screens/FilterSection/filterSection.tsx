import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Slider} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RangeSlider from 'rn-range-slider';
import {Controller, useForm} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {updateProfileData} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Thumb from '../SettingsSection/Thumb';
import Rail from '../SettingsSection/Rail';
import RailSelected from '../SettingsSection/RailSelected';
import Label from '../SettingsSection/Label';
import Notch from '../SettingsSection/Notch';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Geolocation from '@react-native-community/geolocation';
import Loader from '../../components/Loader/Loader';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      return JSON.parse(userId);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const defaultValues = {
  name: '',
  email: '',
  interests: '',
  gender: '',
  showInDistance: '',
  partnerType: '',
};

interface UpdateForm {
  name: string;
  email: string;
  interests: string;
  gender: string;
  showInDistance: string;
  partnerType: string;
}

const schema = yup.object().shape({});

const FilterSection = ({
  showIn,
  setShowIn,
  checkedInterests,
  setCheckedInterests,
  checkedRelationShip,
  setCheckedRelationShip,
  distance,
  setDistance,
  low,
  setLow,
  high,
  setHigh,
}: any) => {
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  useEffect(() => {
    setCheckedInterests(profileData?.interests);
  }, [profileData?.interests]);
  useEffect(() => {
    setCheckedRelationShip(profileData?.partnerType);
  }, [profileData?.partnerType]);
  const {
    control,
    formState: {errors},
  } = useForm<UpdateForm>({
    defaultValues,
    resolver: yupResolver<any>(schema),
  });
  const options = [
    {label: 'Male', value: 'first'},
    {label: 'Female', value: 'second'},
    {label: 'Non-Binary', value: 'third'},
    {label: 'Transgender', value: 'fourth'},
  ];
  const RelationShip = [
    {
      id: '1',
      name: 'Long term partner',
    },
    {
      id: '2',
      name: 'Long term open to short',
    },
    {
      id: '3',
      name: 'Short term open to long',
    },
    {
      id: '4',
      name: 'Short term fun',
    },
    {
      id: '5',
      name: 'New friends',
    },
    {
      id: '6',
      name: 'Still figuring it out',
    },
  ];
  const options2 = [
    {value: 'Male', label: 'Male'},
    {value: 'Female', label: 'Female'},
    {value: 'Everyone', label: 'Everyone'},
  ];

  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  const handleSliderChange = (value: any) => {
    setDistance(value);
    dispatch(
      updateProfileData({
        field: 'distance',
        value: value,
        id: getUserId(),
      }),
    );
  };
  const [minValue, setMinValue] = useState(18);
  const [maxValue, setMaxValue] = useState(56);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  useEffect(() => {
    const setLocation = async () => {
      setIsLocationEnabled(await DeviceInfo.isLocationEnabled());
    };
    setLocation();
    if (profileData?.ageRange) {
      const [lowStr, highStr] = profileData.ageRange.split(' ');
      const lowValue = parseInt(lowStr);
      const highValue = parseInt(highStr);
      setLow(lowValue);
      setHigh(highValue);
    }
  }, []);

  const handleValueChange = (newLow: any, newHigh: any) => {
    setLow(newLow);
    setHigh(newHigh);
    dispatch(
      updateProfileData({
        field: 'ageRange',
        value: `${newLow} ${newHigh}`,
        id: getUserId(),
      }),
    );
  };

  const [loader, setLoader] = useState<boolean>(false);

  const getLocationAndRegister = () => {
    if (!isLocationEnabled) {
      if (Platform.OS === 'android') {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
              },
            },
          ],
        );
      } else if (Platform.OS === 'ios') {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openURL('App-Prefs:Privacy&path=LOCATION');
              },
            },
          ],
        );
      }
      return;
    }

    dispatch(
      updateProfileData({
        field: 'showInDistance',
        value: !showIn,
        id: getUserId(),
      }),
    ).then(() => setShowIn(!showIn));

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        // console.log('latitude:', latitude);
        // console.log('Longitude:', longitude);
        const userId = await getUserId();
        setLoader(false);
        if (userId) {
          dispatch(
            updateProfileData({
              field: 'location',
              value: {latitude, longitude},
              id: userId,
            }),
          );
        }
      },

      err => {
        console.error('Error fetching location:22222', err);
        setLoader(false);
      },
      {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000}, // Increased timeout to 30000ms (30 seconds)
    );
  };

  const checkLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const result = await check(permission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available on this device');
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          requestLocationPermission();
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');

          Geolocation.requestAuthorization();
          getLocationAndRegister();
          setLoader(true);
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          showSettingsAlert();
          break;
      }
    } catch (error) {
      console.error('Failed to check permission:', error);
    }
  };

  const showSettingsAlert = () => {
    Alert.alert(
      'Location Permission',
      'The app needs location access to provide this feature. Please go to the app settings and enable location permissions.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
    );
  };

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      Geolocation.requestAuthorization();
      getLocationAndRegister();
      setLoader(true);
      dispatch(
        updateProfileData({
          field: 'showInDistance',
          value: !showIn,
          id: getUserId(),
        }),
      ).then(() => setShowIn(!showIn));
    } else if (result === RESULTS.BLOCKED) {
      showSettingsAlert();
    }
  };

  return (
    <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
      {/* Distance Preference */}
      <View style={styles.boxContainer}>
        <View style={styles.distance}>
          <Text style={styles.textName}>Distance Preference</Text>
          <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
            {distance} Mi
          </Text>
        </View>
        <View style={styles.line} />
        <View
          style={
            showIn && profileData.location !== undefined && isLocationEnabled
              ? {}
              : {opacity: 0.5}
          }
          pointerEvents={
            showIn && profileData.location !== undefined && isLocationEnabled
              ? 'auto'
              : 'none'
          }>
          <Slider
            style={styles.slider}
            minimumValue={4}
            maximumValue={50}
            value={distance}
            onSlidingComplete={handleSliderChange}
            step={1}
            thumbTintColor="#AC25AC"
            minimumTrackTintColor="#AC25AC"
            maximumTrackTintColor="gray"
            thumbStyle={styles.thumbStyle}
          />
        </View>
        <Controller
          name={'showInDistance'}
          control={control}
          render={() => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text
                style={{
                  fontFamily: 'Sansation-Regular',
                  marginTop: 2,
                  marginBottom: 8,
                  color: 'black',
                }}>
                Only show people in range
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  await checkLocationPermission();
                  setLoader(false);
                }}>
                <Ionicons
                  name={
                    showIn === true ? 'radio-button-on' : 'radio-button-off'
                  }
                  size={25}
                  color="#AC25AC"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      {/* Show Me */}
      <View style={styles.boxContainer}>
        <Text style={styles.textName}>Show Me</Text>
        <View style={styles.line} />
        <View>
          {options2.map(item => {
            return (
              <View key={item?.value} style={styles.radio}>
                <Controller
                  name={'interests'}
                  control={control}
                  defaultValue="Man"
                  render={() => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          {
                            color: errors?.interests ? 'red' : 'black',
                            fontFamily: 'Sansation-Regular',
                            paddingBottom: 8,
                          },
                        ]}>
                        {item?.label}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setCheckedInterests(item?.value);
                          dispatch(
                            updateProfileData({
                              field: 'interests',
                              value: item.value,
                              id: getUserId(),
                            }),
                          );
                        }}>
                        <Ionicons
                          name={
                            checkedInterests === item?.value
                              ? 'radio-button-on'
                              : 'radio-button-off'
                          }
                          size={25}
                          color="#AC25AC"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            );
          })}
        </View>
      </View>
      {/* Age Range */}
      <View style={styles.boxContainer}>
        <View style={styles.distance}>
          <Text style={styles.textName}>Age Range</Text>
          <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
            {low + '-' + high}
          </Text>
        </View>
        <View style={styles.line} />
        <RangeSlider
          style={[styles.slider, {marginVertical: 14}]}
          min={minValue}
          max={maxValue}
          low={low}
          high={high}
          step={1}
          floatingLabel
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onSliderTouchEnd={handleValueChange}
        />
      </View>
      {/* RelationShip goals */}
      <View style={styles.boxContainer}>
        <Text style={styles.textName}>RelationShip Goals</Text>
        <View style={styles.line} />
        {RelationShip.map(item => (
          <View key={item.id} style={styles.radio}>
            <Controller
              name={'partnerType'}
              control={control}
              render={() => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      {
                        color: errors?.partnerType ? 'red' : 'black',
                        fontFamily: 'Sansation-Regular',
                        paddingBottom: 8,
                      },
                    ]}>
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setCheckedRelationShip(item.name);
                      dispatch(
                        updateProfileData({
                          field: 'partnerType',
                          value: item.name,
                          id: getUserId(),
                        }),
                      );
                    }}>
                    <Ionicons
                      name={
                        checkedRelationShip === item.name
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={25}
                      color="#AC25AC"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ))}
      </View>
      {/* Gender */}
      {/* <View style={styles.boxContainer}>
        <Text style={styles.textName}>Gender</Text>
        <View style={styles.line} />
        {options.map(item => (
          <View key={item.value} style={styles.radio}>
            <Controller
              name={'gender'}
              control={control}
              defaultValue="Everyone"
              render={() => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      {
                        color: errors?.gender ? 'red' : 'black',
                        fontFamily: 'Sansation-Regular',
                        paddingBottom: 8,
                      },
                    ]}>
                    {item.label}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setChecked(item.label);
                      dispatch(
                        updateProfileData({
                          field: 'gender',
                          value: item.label,
                          id: getUserId(),
                        }),
                      );
                    }}>
                    <Ionicons
                      name={
                        checked === item.label
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={25}
                      color="#AC25AC"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ))}
      </View> */}
      {loader && <Loader />}
    </ScrollView>
  );
};

export default React.memo(FilterSection);

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 10,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  slider: {
    marginHorizontal: 20,
  },
  thumbStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#AC25AC',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  line: {
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  textName: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: 'black',
  },

  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  radio: {
    flexDirection: 'row',
    marginHorizontal: 18,
    alignItems: 'center',
  },
});
