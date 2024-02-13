import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import CommonBackbutton from "../commonBackbutton/backButton"
import {yupResolver} from '@hookform/resolvers/yup';
import { Slider } from 'react-native-elements';
import {RadioButton} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import Icon1 from "react-native-vector-icons/FontAwesome"
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Icon3 from "react-native-vector-icons/Entypo"
import * as yup from 'yup';
import RangeSlider from 'rn-range-slider';
import Label from "./Label";
import Notch from "./Notch";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";
import AppTextInput from '../AppTextInput/AppTextInput';
interface UpdateForm {
    name: string;
    email: string;
    password: string;
    gender: string;
  }
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    gender:''
  };
  
  const schema = yup.object().shape({
    gender: yup.string().required('gender is required'),
  });

  const BottomDrawer = ({ isOpen, onClose, title, value }:any) => {
    console.log("titletitletitletitletitle ", title);
    console.log("value value value value ", value);
    const Data = [
      { id: 1, text: 'Lodo' },
      { id: 2, text: 'Cricket' },
      { id: 3, text: 'Football' },
      { id: 4, text: 'Shopping' },
      { id: 5, text: 'Coffee' },
      { id: 6, text: 'Movies' },
      { id: 7, text: 'Dancing' },
      { id: 8, text: 'Bikes' },
      { id: 9, text: 'games' },
    ];
  
    const avatars = [
      { id: '1', text: 'Long term partner' },
      { id: '2', text: 'Long term open to short'},
      { id: '3', text: 'Shirt term open to long'},
      { id: '4', text: 'Short term fun'},
      { id: '5', text: 'New friends'},
      { id: '6', text: 'Still figuring it out' },
      // Add more avatars as needed
    ];
    
      const {
          control,
          handleSubmit,
          watch,
          reset,
          setValue,
          formState: {errors},
        } = useForm<UpdateForm>({
          defaultValues,
          resolver: yupResolver<any>(schema),
        });
  
        useEffect(()=>{
          setValue(title, value);
        },[title])
      
        const onSubmit = (data:any) => {
      
        }
  
        const ListItem = ({ item }:any) => (
          <View style={styles.listItem}>
            <Text style={{color:'white', padding: 4}}>{item}</Text>
          </View>
        );
      
        const ListItem2 = ({ item }:any) => (
          <View style={styles.listItem2}>
            <TouchableOpacity>
            <Text style={{color:'grey', padding: 4}}>{item}</Text>
            </TouchableOpacity>
          </View>
        );
  
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isOpen}
          onRequestClose={onClose}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={onClose}
          >
          <View style={styles.drawer}>
              <Text style={styles.drawerText}>{title}</Text>
              {title==="Interests"?
                <View >
                  {/* {value.split(",").map((list:any, index:any)=>(
                   <Text key={index} style={{backgroundColor:'#BB2CBB', borderRadius:20, color:'#ffff'}}>{list}</Text>
                  ))} */}
                  <FlatList
                    data={value.split(",")}
                    renderItem={({ item }) => <ListItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3} // Display three items per row
                  />
                  <FlatList
                    data={Data}
                    renderItem={({ item }) => <ListItem2 item={item.text} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={4} // Display three items per row
                  />
                </View>:
                title==="Relationship Goals"?
                <View>
                  <Text style={{backgroundColor:'#BB2CBB', color:'white', borderRadius:20, width:220, padding:5, marginBottom:10}}>{value}</Text>
                  <FlatList
                    data={avatars}
                    renderItem={({ item }) => <ListItem2 item={item.text} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={4} // Display three items per row
                  />
                </View>:
              <AppTextInput
                  placeholder={"Enter Your " + title.split(" ")[0]}
  
                  name={title}
                  control={control}
                 // errors={Boolean(errors?.title)}
                  borderColor='#BB2CBB' 
                  borderWidth={1}
                  marginLeft={35}
          />}
  
          <View style={styles.containerBtn}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}>
            <Text style={styles.buttonText}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
            </View>
          </TouchableOpacity>
        </Modal>
      );
    };
const SettingsSection = () => {
const[distance, setDistance] = useState(10);
const [title, setTitle] = useState<string>('');
const [value, setValue] = useState<string>('');

    const handleSliderChange = (value:any) => {
        setDistance(value);
      };
const options = [
        {label: 'Male', value: 'first'},
        {label: 'Female', value: 'second'},
        {label: 'Non-Binary', value: 'third'},
        {label: 'Transgender', value: 'fourth'},
      ];
      const [checked, setChecked] = React.useState('Male');

      const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
      } = useForm<UpdateForm>({
        defaultValues,
        resolver: yupResolver<any>(schema)
      });


      const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(50);

//   const handleSliderChange = (value:any) => {
//     setDistance(value);
//   };

  const handleMinValueChange = (value:any) => {
    setMinValue(value);
    if (distance < value) {
      setDistance(value);
    }
  };

  const handleMaxValueChange = (value:any) => {
    setMaxValue(value);
    if (distance > value) {
      setDistance(value);
    }
  };

  const [low, setLow] = useState<any>(10);
  const [high, setHigh] = useState<any>(50);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value:any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback((newLow:any, newHigh:any) => {
      setLow(newLow);
      setHigh(newHigh);
    },
    [setLow, setHigh]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dataArr = [{title:'Phone Number', name:'+918765432109'}, {title:'Email Address', name:'example@gmail.com'},
  {title:'Location', name:'450000, bcbvnds, 87099'},{title:'Show Me', name:'women'},
                 {title:'Language I Know', name:'English'}];
const openDrawer = () => {
  setIsDrawerOpen(true);
};
            
const closeDrawer = () => {
  setIsDrawerOpen(false);
};

  const handleModal = (item:any) => {
    setTitle(item?.title);
    setValue(item?.name);
    setIsDrawerOpen(true);
}

  return (
    <ScrollView>
      <CommonBackbutton title="Settings" />
      <Text style={styles.title}>Account Settings</Text>
      {dataArr && dataArr.map((item, index)=>(
      <View style={styles.boxContainer} key={index}>
       <Text style={styles.textName}>{item.title}</Text>
       <View style={styles.line} />
        <View>
        <TouchableOpacity style={styles.textField} onPress={()=>handleModal(item)}>
        {index===0? <Icon1 name="phone" size={20} color="grey" />:
        index===1? <Icon2 name="email" size={20} color="grey" />:
        index===2? <Icon3 name="location" size={20} color="grey" />:'' }
        <Text>{item.name}</Text>
        </TouchableOpacity>
        </View>
      </View>))}

      

      <View style={styles.boxContainer}>
       <View style={styles.distance}>
        <Text style={styles.textName}>Distance Preference</Text>
        <Text>{distance} mi</Text>
       </View>
       <View style={styles.line} />
        <Slider
        style={styles.slider}
        minimumValue={4}
        maximumValue={50}
        value={distance}
        onValueChange={handleSliderChange}
        step={1}
        thumbTintColor="#BB2CBB"
        minimumTrackTintColor="#BB2CBB"
        maximumTrackTintColor="gray"
        thumbStyle={styles.thumbStyle}
      />
       
      </View>


      <View style={styles.boxContainer}>
       <View style={styles.distance}>
        <Text style={styles.textName}>Age Range</Text>
        <Text>{low +'-'+ high} age</Text>
       </View>
       <View style={styles.line} />
       <RangeSlider
            style={styles.slider}
            min={18}
            max={56}
            step={1}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            onValueChanged={handleValueChange}
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
              defaultValue=""
              render={({field: {onChange, value}}) => (
                <View style={{flex:1,flexDirection: 'row', justifyContent:'space-between'}}>
                  <Text
                    style={[
                      styles.radioLabel,
                      {color: errors?.gender ? 'red' : 'grey'},
                    ]}>
                    {item.label}
                  </Text>
                  <RadioButton
                    value={item.value}
                    status={value === item.value ? 'checked' : 'unchecked'}
                    onPress={() => onChange(item.value)}
                  />
                </View>
              )}
            />
          </View>
        ))}
        </View>
      </View>

      <View style={styles.boxContainer}>
       <Text style={[styles.textName, {color:'#BB2CBB'}]}>Log Out</Text>
      </View>
      <View style={styles.boxContainer}>
       <Text style={[styles.textName, {color:'#BB2CBB'}]}>Delete Account</Text>
      </View>
      <BottomDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title={title} value={value} />
    </ScrollView>
  )
}

export default SettingsSection;

const styles = StyleSheet.create({
    boxContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 5
      },
      textName:{
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
      },
      line:{
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10,
      },
      textField:{
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',

      },
      slider: {
       marginHorizontal: 20,
      },
      thumbStyle: {
        width: 16,
        height: 16,
        borderRadius: 8,
      },
      distance:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:20
    },
    radio: {
        flexDirection: 'row',
        marginHorizontal: 20,
        alignItems: 'center',
      },
      radioLabel: {
        marginLeft: 10,
      },

      sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#BB2CBB',
      },



      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      
      rangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      rangeSlider: {
        flex: 1,
      },
      rangeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#BB2CBB',
      },


      containerBtn: {
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      button: {
        width: 300,
        backgroundColor: '#BB2CBB',
        padding: 10,
        borderRadius: 20,
        marginBottom: 10,
      },
    
      buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
      },

      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      drawer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
      },
      drawerText: {
        fontSize: 18,
        marginBottom: 5,
        marginLeft:40
      },


      listItem: {
        width: '32%', // Each list item takes one-third of the width
       // height: 100,
       // borderWidth: 1,
        backgroundColor: '#BB2CBB',
        //borderColor: 'black',
        color: 'white',
        marginRight: 2,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10
      },

      listItem2: {
        width: '24%', // Each list item takes one-third of the width
       // height: 100,
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderColor: 'grey',
        color: 'grey',
        marginRight: 2,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:5
      },
})