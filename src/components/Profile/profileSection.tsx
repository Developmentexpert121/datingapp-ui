import React, {useState, useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Pressable, SafeAreaView, FlatList} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import CommonBackbutton from "../commonBackbutton/backButton"
import FooterComponent from '../Dashboard/footer/footer';

const data = [
  { title: 'Premium', description: 'Maximize your dating with all the benefits of premium with extra features included', price: '999INR' },
  { title: 'Premium Plus', description: 'Maximize your dating with all the benefits of premium with extra features included', price: '1,999INR' },
  // Add more data as needed
];
const data2 = ['unlimited likes', 'See who likes you', 'Priority likes', 'unlimited Rewards'];
const Box = ({ item, isActive }:any) => (
  <View style={[styles.boxContainer, isActive && styles.activeBox, {backgroundColor: item.title==='Premium'?'#BB2CBB':'grey'}]}>
    <Text style={styles.text}>{item.title}</Text>
    <Text style={styles.text2}>{item.description}</Text>
    <TouchableOpacity>
      <Text style={styles.upbtn}>Upgrade from {item.price}</Text>
    </TouchableOpacity>
  </View>
);

const TickListItem = ({ item }:any) => (
  <ListItem>
    <Icon name="checkmark-done" size={20} color="#BB2CBB" />
    <ListItem.Content>
      <ListItem.Title>{item}</ListItem.Title>
    </ListItem.Content>
  </ListItem>
);

const ProfileSection = () => {
  const navigation = useNavigation();
  const profileImage = 'https://source.unsplash.com/random/?profile&3';
  const profileCompletionPercentage = 71;
  const userName = 'John Doe';
  const userAddress = '123 Street, City';
  const userLocation = 'New York, USA';

  const profileCompletion = 71; // Set the completion percentage

  const calculateStrokeDasharray = (percentage: any) => {
    const circumference = 440; // 2 * π * radius (140 * 2 * π)
    const completedLength = (percentage / 100) * circumference;
    return [completedLength, circumference];
  };


  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef:any = useRef(null);

  const renderBox = ({ item, index }:any) => (
    <Box item={item} isActive={index === activeIndex} />
  );

  const handleDotPress = (index:any) => {
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({ animated: true, index });
  };

  return (
    <SafeAreaView>
      <CommonBackbutton title="Profile" />
    <View style={styles.container}>
      <TouchableOpacity onPress = {()=> navigation.navigate('Settings')}>
        <Feather name="settings" size={24} color="#BB2CBB" style={styles.settingIcon} />
      </TouchableOpacity>
      <View style={styles.profileImageContainer}>
        <Svg height="150" width="150" style={styles.progressCircle}>
          <Circle
            cx="75"
            cy="75"
            r="70"
            stroke="#e0e0e0" // Set a background color for the circle
            strokeWidth="5"
            fill="transparent"
          />
          <Circle
            cx="75"
            cy="75"
            r="70"
            stroke="#BB2CBB"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={calculateStrokeDasharray(profileCompletion)}
          />
          {/* <SvgText
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
            fontSize="24"
            fill="#3498db">
            {`${profileCompletion}%`}
          </SvgText> */}
        </Svg>
        <Image source={{uri: profileImage}} style={styles.profileImage} />
        <View style={styles.completionContainer}>
          <Text style={styles.completionText}>
            {profileCompletionPercentage}% Complete
          </Text>
        </View>
      </View>
      {/* <View style={styles.detailsContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userAddress}>{userAddress}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.userLocation}>{userLocation}</Text>
          <Ionicons
            name="location"
            size={20}
            color="#3498db"
            style={styles.locationIcon}
          />
        </View>
      </View> */}
      <TouchableOpacity onPress={()=>navigation.navigate('UpdateProfile')}>
        <Icons name="mode-edit" size={24} color="#BB2CBB" style={styles.editIcon} />
      </TouchableOpacity>
    </View>
      <View style={{ flex: 0 }}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={data}
        renderItem={renderBox}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.floor(offsetX / 300); // Assuming each box has a width of 300
          setActiveIndex(index);
        }}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
            <View style={[styles.dot, index === activeIndex && styles.activeDot]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <View style={{ flex: 0, paddingBottom: 115, backgroundColor:'white' }}>
      <FlatList
        data={data2}
        renderItem={({ item }) => <TickListItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    <FooterComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  profileImageContainer: {
    position: 'relative',
  },
  completionContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#BB2CBB',
    padding: 4,
    borderRadius: 12,
  },
  completionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userAddress: {
    fontSize: 16,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: '#95a5a6',
  },
  editIcon: {
    marginRight: 30,
    backgroundColor:'#edb9ed',
    borderRadius:20,
    padding:8
  },
  settingIcon: {
    marginLeft: 30,
    backgroundColor:'#edb9ed',
    borderRadius:20,
    padding:8
  },
  progressCircle: {
    position: 'absolute',
  },
  profileImage: {
    margin: 10,
    width: 130,
    height: 130,
    borderRadius: 75,
  },
  profileText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    marginLeft: 5,
  },

  backPress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 15,
  },
  backPressIcon: {
    marginRight: 8,
    color: '#BB2CBB',
  },
  stepsText: {
    color: 'grey',
    fontSize: 20,
    //backgroundColor: '#BB2CBB',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 80,
    fontWeight: 'bold',
  },

  boxContainer: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 5,
    shadowColor: '#000',
    width:380,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text:{
    alignSelf:'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text2:{
    alignSelf:'center',
    color: 'white',
    fontSize: 16,
    //fontWeight: 'bold',
  },
  upbtn:{
    alignSelf:'center',
    color: 'black',
    backgroundColor:'yellow',
    fontSize: 16,
    borderRadius:20,
    paddingHorizontal:15,
    paddingVertical:6,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#BB2CBB',
  },
  activeBox: {
   // borderWidth: 2,
    //borderColor: 'blue',
  },
});

export default ProfileSection;
