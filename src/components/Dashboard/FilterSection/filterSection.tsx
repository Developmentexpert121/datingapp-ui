import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Slider} from 'react-native-elements';
import {RadioButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import CommonBackbutton from '../../commonBackbutton/backButton';
import RangeSlider from 'rn-range-slider';
import {Controller, useForm} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {updateProfileData} from '../../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Thumb from '../../settingsSection/Thumb';
import Rail from '../../settingsSection/Rail';
import RailSelected from '../../settingsSection/RailSelected';
import Label from '../../settingsSection/Label';
import Notch from '../../settingsSection/Notch';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      console.log(JSON.parse(userId));
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
};

interface UpdateForm {
  name: string;
  email: string;
  interests: string;
  gender: string;
}

const schema = yup.object().shape({
  // gender: yup.string().required('gender is required'),
});

const FilterSection = () => {
  const dispatch: any = useAppDispatch();
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );

  const {
    control,
    handleSubmit,
    reset,
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
    {value: 'men', label: 'Men'},
    {value: 'women', label: 'Women'},
    {value: 'everyone', label: 'Everyone'},
  ];

  const [checked, setChecked] = React.useState(profileData?.gender);
  const [checkedInterests, setCheckedInterests] = React.useState(
    profileData?.interests,
  );
  const [distance, setDistance] = useState(
    parseInt(profileData?.distance) || 0,
  );

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

  const [low, setLow] = useState<number>(18);
  const [high, setHigh] = useState<number>(56);

  const [minValue, setMinValue] = useState(18);
  const [maxValue, setMaxValue] = useState(56);

  const handleMinValueChange = (value: any) => {
    setMinValue(value);
    if (distance < value) {
      setDistance(value);
    }
  };

  const handleMaxValueChange = (value: any) => {
    setMaxValue(value);
    if (distance > value) {
      setDistance(value);
    }
  };

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
    <View>
      <CommonBackbutton title="Filter" />
      <View style={styles.boxContainer}>
        <View style={styles.distance}>
          <Text style={styles.textName}>Distance Preference</Text>
          <Text style={{fontFamily: 'Sansation_Regular', color: 'black'}}>
            {distance} Mi
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
      </View>

      <View style={styles.boxContainer}>
        <Text style={styles.textName}>Show Me</Text>
        <View style={styles.line} />
        <View>
          {options2.map(item => (
            <View key={item.value} style={styles.radio}>
              <Controller
                name={'interests'}
                control={control}
                defaultValue="Women"
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
                          fontFamily: 'Sansation_Regular',
                          paddingBottom: 8,
                        },
                      ]}>
                      {item.label}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setCheckedInterests(item.label);
                        dispatch(
                          updateProfileData({
                            field: 'interests',
                            value: item.label,
                            id: getUserId(),
                          }),
                        );
                      }}>
                      <Ionicons
                        name={
                          checkedInterests === item.label
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

      <View style={styles.boxContainer}>
        <View style={styles.distance}>
          <Text style={styles.textName}>Age Range</Text>
          <Text style={{fontFamily: 'Sansation_Regular', color: 'black'}}>
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

      <View style={styles.boxContainer}>
        <Text style={styles.textName}>Gender</Text>
        <View style={styles.line} />
        <View>
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
                          fontFamily: 'Sansation_Regular',
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
      </View>
    </View>
  );
};

export default FilterSection;

const styles = StyleSheet.create({
  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 15,
  },
  backPressIcon: {
    marginRight: 8,
    color: '#AC25AC',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#AC25AC',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
  },

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
    fontFamily: 'Sansation_Bold',
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
