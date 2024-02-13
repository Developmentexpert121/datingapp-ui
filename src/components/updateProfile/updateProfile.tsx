import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import CommonBackbutton from "../commonBackbutton/backButton"
import { Slider } from 'react-native-elements';
import SeventhStepScreen from '../Registration/seventhStepScreen';
import AppTextInput from '../AppTextInput/AppTextInput';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
interface UpdateForm {
    work: string;
    education: string;
    interest: string;
    language: string;
    name: string;
    email: string;
    password: string;
  }
  const defaultValues = {
    work:'',
    education: '',
    interest: '',
    language: '',
    name: '',
    email: '',
    password: '',
  };

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
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
                errors={Boolean(errors?.work)}
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

const UpdateProfile = () => {
const[height, setHeight] = useState(10);
const [title, setTitle] = useState<string>('');
const [value, setValue] = useState<string>('');
const [uploadError, setUploadError] = useState<boolean>(false);
const [selectedImage, setSelectedImage] = useState<any>(null);
const handleSliderChange = (value:any) => {
    setHeight(value);
  };
const dataArr = [{title:'Work', name:'Graphic designer'}, {title:'Education', name:'Lorem University'},
                 {title:'Interests', name:'Photography, Swimming, Travel'}, {title:'Relationship Goals', name:'Long-term open to short'},
                 {title:'Language I Know', name:'English'}];

const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    <ScrollView style={{paddingBottom: 20}}>
      <CommonBackbutton title="Edit Profile" />
      <SeventhStepScreen uploadError={uploadError} setUploadError={setUploadError} selectedImage={selectedImage} setSelectedImage={setSelectedImage} title="new" />
      <View style={styles.boxContainer}>
       <View style={styles.distance}>
        <Text style={styles.textName}>Height</Text>
        <Text>{height} mt</Text>
       </View>
       <View style={styles.line} />
        <Slider
        style={styles.slider}
        minimumValue={2}
        maximumValue={12}
        value={height}
        onValueChange={handleSliderChange}
        step={1}
        thumbTintColor="#BB2CBB"
        minimumTrackTintColor="#BB2CBB"
        maximumTrackTintColor="gray"
        thumbStyle={styles.thumbStyle}
      />
      </View>
      {dataArr && dataArr.map((item, index)=>(
      <View style={styles.boxContainer} key={index}>
       <Text style={styles.textName}>{item.title}</Text>
       <View style={styles.line} />
        <View>
        <TouchableOpacity style={styles.textField} onPress={()=>handleModal(item)}>
        <Text>{item.name}</Text>
        </TouchableOpacity>
        </View>
      </View>))}
      <BottomDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title={title} value={value} />
    </ScrollView>
  )
}

export default UpdateProfile;

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


     container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
      closeButton: {
        alignSelf: 'flex-end',
      },
      closeButtonText: {
        color: 'blue',
        fontSize: 16,
      },
      openButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
      },
      openButtonText: {
        color: '#fff',
        fontSize: 16,
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

      containerModal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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