import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
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
      image: require('../../assets/images/bottleofchampagne.png'),
      imagePath: 'src/assets/images/bottleofchampagne.png',
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
      image: require('../../assets/images/smoking.png'),
      imagePath: 'src/assets/images/smoking.png',
    },
    {
      id: '3',
      title: 'Do you workout?',
      texts: ['Everyday', 'Often', 'Sometimes', 'Never'],
      image: require('../../assets/images/Mandumbbells.png'),
      imagePath: 'src/assets/images/Mandumbbells.png',
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
      image: require('../../assets/images/dogheart.png'),
      imagePath: 'src/assets/images/dogheart.png',
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
      image: require('../../assets/images/datestep.png'),
      imagePath: 'src/assets/images/datestep.png',
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>
          Let's talk lifestyle habits, your name
        </Text>
        <Text style={styles.paragraphText}>
          Do their habits match yours? You go first.
        </Text>
        <Controller
          name={habits1}
          control={control}
          defaultValue={[]}
          render={({field: {onChange, value}}) => (
            <>
              {dataArray.map(item => (
                <View key={item.id} style={styles.boxContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                      columnGap: 4,
                    }}>
                    <Image
                      source={item.image}
                      style={{height: 20, width: 20}}
                    />
                    <Text style={styles.title}>{item.title}</Text>
                  </View>
                  <View style={styles.textsContainer}>
                    {item.texts.map((text, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          onChange([
                            ...value.filter(
                              (habit: any) => habit.id !== item.id,
                            ),
                            {
                              id: item.id,
                              selectedText: text,
                              imagePath: item.imagePath,
                            },
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
    </ScrollView>
  );
};

export default ForthStepScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 40,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
    marginBottom: 10,
  },
  paragraphText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    marginBottom: 16,
    color: '#575757',
  },
  boxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Sansation-Bold',
  },
  textsContainer: {
    marginLeft: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textItem: {
    fontFamily: 'Sansation-Regular',
    color: '#545454',
    fontSize: 12,
    borderColor: '#ABABAB',
    borderWidth: 1,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
