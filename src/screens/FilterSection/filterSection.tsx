import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
};

interface UpdateForm {
  name: string;
  email: string;
  interests: string;
  gender: string;
  showInDistance: string;
}

const schema = yup.object().shape({
  // gender: yup.string().required('gender is required'),
});

const FilterSection = ({
  showIn,
  setShowIn,
  checkedInterests,
  setCheckedInterests,
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
  const options2 = [
    {value: 'Male', label: 'Men'},
    {value: 'Female', label: 'Women'},
    {value: 'everyone', label: 'Everyone'},
  ];
  const [checked, setChecked] = React.useState(profileData?.gender);
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

  return (
    <ScrollView style={{marginTop: 10}}>
      {/* Distance Preference */}
      <View style={styles.boxContainer}>
        <View style={styles.distance}>
          <Text style={styles.textName}>Distance Preference</Text>
          <Text style={{fontFamily: 'Sansation-Regular', color: 'black'}}>
            {distance} MT
          </Text>
        </View>
        <View style={styles.line} />
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
                onPress={() => {
                  dispatch(
                    updateProfileData({
                      field: 'showInDistance',
                      value: !showIn,
                      id: getUserId(),
                    }),
                  ).then(() => setShowIn(!showIn));
                }}>
                <Ionicons
                  name={
                    showIn === true ? 'radio-button-on' : 'radio-button-off'
                  }
                  size={16}
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
          {options2.map(item => (
            <View key={item.value} style={styles.radio}>
              <Controller
                name={'interests'}
                control={control}
                defaultValue="female"
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
                      {item.label}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setCheckedInterests(item.value);
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
                          checkedInterests === item.value
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={16}
                        color="#AC25AC"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ))}
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
      {/* Gender */}
      <View style={styles.boxContainer}>
        <Text style={styles.textName}>Gender</Text>
        <View style={styles.line} />
        {options.map(item => (
          <View key={item.value} style={styles.radio}>
            <Controller
              name={'gender'}
              control={control}
              defaultValue="Male"
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
                      size={16}
                      color="#AC25AC"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default FilterSection;

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
    width: 18,
    height: 18,
    borderRadius: 9,
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
