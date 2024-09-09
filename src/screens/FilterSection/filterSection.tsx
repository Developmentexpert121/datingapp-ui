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
import {useFocusEffect} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface UserPreferences {
  checkedInterests: string; // "Everyone"
  checkedRelationShip: string; // "Long term partner"
  distance: number; // 34
  high: number; // 53
  low: number; // 20
  showIn: boolean; // true
}

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

const FilterSection = ({filterData, setSelectedFilterData}: any) => {
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const [loader, setLoader] = useState<boolean>(false);
  const {
    control,
    formState: {errors},
  } = useForm<UpdateForm>({
    defaultValues,
    resolver: yupResolver<any>(schema),
  });
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

  const handleSliderChange = (value: any) => {
    setSelectedFilterData((prev: any) => ({
      ...prev,
      distance: value,
    }));
  };

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = (newLow: any, newHigh: any) => {
    setSelectedFilterData((prev: any) => ({
      ...prev,
      low: newLow,
    }));
    setSelectedFilterData((prev: any) => ({
      ...prev,
      high: newHigh,
    }));
  };

  return (
    <View>
      <ScrollView
        style={{marginTop: hp(3)}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(10)}}>
        {/* Distance Preference */}
        <View style={styles.boxContainer}>
          <View style={styles.distance}>
            <Text style={styles.textName}>Distance Preference</Text>
            <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
              {filterData.distance} Mi
            </Text>
          </View>
          <View style={styles.line} />
          <View
            style={
              // showIn && profileData.location !== undefined && isLocationEnabled
              filterData.showInDistance ? {} : {opacity: 0.5}
            }
            pointerEvents={filterData.showInDistance ? 'auto' : 'none'}>
            <Slider
              style={styles.slider}
              minimumValue={4}
              maximumValue={50}
              value={filterData.distance}
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
                    // await checkLocationPermission();
                    setLoader(false);
                    setSelectedFilterData((prev: any) => ({
                      ...filterData,
                      showInDistance: !prev.showInDistance,
                    }));

                    // dispatch(
                    //   updateProfileData({
                    //     field: 'showInDistance',
                    //     value: !filterData.showIn,
                    //     id: getUserId(),
                    //   }),
                    // );
                  }}>
                  <Ionicons
                    name={
                      filterData.showInDistance === true
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
                            setSelectedFilterData((prev: any) => ({
                              ...prev,
                              interests: item?.value,
                            }));

                            // dispatch(
                            //   updateProfileData({
                            //     field: 'interests',
                            //     value: item.value,
                            //     id: getUserId(),
                            //   }),
                            // );
                          }}>
                          <Ionicons
                            name={
                              filterData.interests === item?.value
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
              {filterData.low + '-' + filterData.high}
            </Text>
          </View>
          <View style={styles.line} />
          <RangeSlider
            style={[styles.slider, {marginVertical: 14}]}
            min={18}
            max={65}
            low={filterData.low}
            high={filterData.high}
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
                        setSelectedFilterData((prev: any) => ({
                          ...prev,
                          partnerType: item?.name,
                        }));
                        // dispatch(
                        //   updateProfileData({
                        //     field: 'partnerType',
                        //     value: item.name,
                        //     id: getUserId(),
                        //   }),
                        // );
                      }}>
                      <Ionicons
                        name={
                          filterData.partnerType === item.name
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
        {loader && <Loader />}
      </ScrollView>
    </View>
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
