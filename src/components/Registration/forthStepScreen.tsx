import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
const ForthStepScreen = ({habits1, control, errors}: any) => {
  const [touchedItems, setTouchedItems] = useState<
    {itemId: string; touchedText: string}[]
  >([]);
  const dataArray = [
    {
      id: '1',
      title: 'How often do you drink?',
      texts: [
        'Not for me',
        'Sober',
        'Sober curious',
        'On special occasions',
        'Socially on weekends',
        'Most Nights',
      ],
    },
    {
      id: '2',
      title: 'How often do you smoke?',
      texts: [
        'Social smoker',
        'Smoker when drinking',
        'Non-smoker',
        'Smoker',
        'Trying to quit',
      ],
    },
    {
      id: '3',
      title: 'Do you workout?',
      texts: ['Everyday', 'Often', 'Sometimes', 'Never'],
    },
    {
      id: '4',
      title: 'Do yoy have any pets?',
      texts: [
        'Dog',
        'Cat',
        'Reptile',
        'Bird',
        'Fish',
        `Don't have but love`,
        'Other',
        'Turtle',
        'Pet-free',
        'All the pets',
        'Want a pet',
      ],
    },
    {
      id: '5',
      title: 'Dates you like?',
      texts: [
        'Travel',
        'Date at Night',
        'Coffee Date',
        'Creatives',
        'Being Watcher',
        'Music Lover',
      ],
    },
  ];

  const handleTextTouch = (itemId: string, touchedText: string) => {
    setTouchedItems(prevItems => {
      const existingItem = prevItems.find(item => item.itemId === itemId);

      if (existingItem) {
        return prevItems.map(item =>
          item.itemId === itemId ? {itemId, touchedText} : item,
        );
      } else {
        return [...prevItems, {itemId, touchedText}];
      }
    });
  };

  const isTextTouched = (itemId: string, text: string) => {
    return touchedItems.some(
      item => item.itemId === itemId && item.touchedText === text,
    );
  };

  console.log(
    'errors 4th step-------------================================ ',
    errors,
  );
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Let's talk lifestyle habits, your name
        </Text>
        <Text style={styles.paragraphText}>
          Do their habits match yours? you go first.
        </Text>
        {/* {dataArray.map((item) => (
        <View style={styles.itemContainer} key={item.id}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.textsContainer}>
            {item.texts.map((text, index) => (
              <TouchableOpacity key={index} onPress={() => handleTextTouch(item.id, text)}>
                <Text style={[styles.textItem, isTextTouched(item.id, text) && { color: '#AC25AC', borderColor:'#AC25AC' }]}>
                  {text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))} */}
        <Controller
          name={habits1}
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
                            ) && {color: '#AC25AC', borderColor: '#AC25AC'},
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
        {errors.habits1 && (
          <Text style={{color: 'red', alignSelf: 'center'}}>
            {errors.habits1.message}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ForthStepScreen;

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
  title: {
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
    shadowOffset: {width: 0, height: 2},
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
});
