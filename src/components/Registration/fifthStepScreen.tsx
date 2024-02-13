import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import {useForm, Controller} from 'react-hook-form';
const FifthStepScreen = ({habits2, control, errors}: any) => {
 const [touchedItems, setTouchedItems] = useState<{ itemId: string; touchedText: string }[]>([]);
  const dataArray = [
    { id: '1', title:'What is your communication style?',  texts: ['I stay on whatsAap allday', 'big time texter', 'Phone caller', 'Video chatter', 'Bad Texter', 'Better in person'] },
    { id: '2', title:'How do you receive love?', texts: ['Thoughtful Gestures', 'Touch', 'Compliments', 'Time together'] },
    { id: '3', title:'What is your education level?', texts: ['Bachelors', 'In college', 'High school', 'PHD', 'Masters'] },
    { id: '4', title:'What is your zodiac sign?', texts: ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Virgo', 'Leo', 'Libra', 'Scorpio', 'Cancer', 'Sagittarius'] },

    // Add more items as needed
  ];

  const handleTextTouch = (itemId: string, touchedText: string) => {
    setTouchedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.itemId === itemId);

      if (existingItem) {
        return prevItems.map((item) => (item.itemId === itemId ? { itemId, touchedText } : item));
      } else {
        return [...prevItems, { itemId, touchedText }];
      }
    });
  };

  const isTextTouched = (itemId: string, text: string) => {
    return touchedItems.some((item) => item.itemId === itemId && item.touchedText === text);
  };

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.headerText}>What else makes you, you?</Text>
      <Text style={styles.paragraphText}>Don't hold back Authenticity attracts authenticity.</Text>
      {/* {dataArray.map((item) => (
        <View style={styles.itemContainer} key={item.id}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.textsContainer}>
            {item.texts.map((text, index) => (
              <TouchableOpacity key={index} onPress={() => handleTextTouch(item.id, text)}>
                <Text style={[styles.textItem, isTextTouched(item.id, text) && { color: '#BB2CBB', borderColor:'#BB2CBB' }]}>
                  {text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))} */}

           <Controller
            name={habits2}
            control={control}
            defaultValue={[]}
            render={({field: {onChange, value}}) => (
              <>
                {dataArray.map(item => (
                  <View key={item.id} style={styles.boxContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.textsContainer}>
                      {item.texts.map((text, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            onChange([
                              ...value.filter(
                                (habit: any) => habit.id !== item.id,
                              ),
                              {id: item.id, selectedText: text},
                            ])
                          }>
                          <Text
                            style={[
                              styles.textItem,
                              value.find(
                                (habit: any) =>
                                  habit.id === item.id &&
                                  habit.selectedText === text,
                              ) && {color: '#BB2CBB', borderColor: '#BB2CBB'},
                            ]}>
                            {text}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </>
            )}
          />
        {errors.habits2 && <Text style={{color:'red', alignSelf:'center'}}>{errors.habits2.message}</Text>}
    </View>
  </SafeAreaView>
  )
}

export default FifthStepScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  paragraphText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  title:{
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 16,
    borderBottomColor: '#ccc',
    //borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
     // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  textsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  textItem: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
    padding: 8,
  },
  boxContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
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
})