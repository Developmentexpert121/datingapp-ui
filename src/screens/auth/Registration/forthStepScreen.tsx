import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';

const ForthStepScreen = ({
  habits1,
  control,
  errors,
  stepFourErrors,
  setStepFourErrors,
}: any) => {
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
      image: require('../../../assets/images/bottleofchampagne.png'),
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
      image: require('../../../assets/images/smoking.png'),
      imagePath: 'src/assets/images/smoking.png',
    },
    {
      id: '3',
      title: 'Do you workout?',
      texts: ['Everyday', 'Often', 'Sometimes', 'Never'],
      image: require('../../../assets/images/Mandumbbells.png'),
      imagePath: 'src/assets/images/Mandumbbells.png',
    },
    {
      id: '4',
      title: 'Do you have any pets?',
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
      image: require('../../../assets/images/dogheart.png'),
      imagePath: 'src/assets/images/dogheart.png',
    },
    {
      id: '5',
      title: 'Dates you like?',
      texts: [
        'Let`s be Friends',
        'Coffee Date',
        'Date at Night',
        'Binge Watcher',
        'Creatives',
        'Sporty',
        'Music Lover',
        'Travel',
      ],
      image: require('../../../assets/images/datestep.png'),
      imagePath: 'src/assets/images/datestep.png',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>
          Let's talk lifestyle habits, your name
        </Text>
        <Text style={styles.paragraphText}>
          Do their habits match yours? You go first.
        </Text>
        {stepFourErrors && (
          <Text style={{color: 'red', alignSelf: 'center', marginTop: 6}}>
            At least an item must be selected from each box
          </Text>
        )}
        <View style={{height: 10}}></View>
        <Controller
          name={habits1}
          control={control}
          defaultValue={[]}
          render={({field: {onChange, value}}) => (
            <>
              {dataArray.map(item => (
                <View
                  key={item.id}
                  style={[
                    styles.boxContainer,
                    // errors.habits1 && styles.errorBorder,
                  ]}>
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
                        onPress={() => {
                          const updatedValue = [...value];
                          const existingCategoryIndex = updatedValue.findIndex(
                            (habit: any) => habit.id === item.id,
                          );

                          if (item.id === '4') {
                            // Allow multiple selection for id '4'
                            if (existingCategoryIndex !== -1) {
                              const existingSelections =
                                updatedValue[existingCategoryIndex]
                                  .optionSelected;
                              const textIndex =
                                existingSelections.indexOf(text);

                              if (textIndex !== -1) {
                                // If the text is already selected, remove it
                                existingSelections.splice(textIndex, 1);
                              } else {
                                // If the text is not selected, add it
                                existingSelections.push(text);
                              }

                              // Update the existing category with new selections
                              updatedValue[
                                existingCategoryIndex
                              ].optionSelected = existingSelections;
                            } else {
                              // Add new category with selected text
                              updatedValue.push({
                                id: item.id,
                                optionSelected: [text],
                              });
                            }
                          } else {
                            // Allow only single selection for other ids
                            if (existingCategoryIndex !== -1) {
                              // Update the existing category with new selection
                              updatedValue[
                                existingCategoryIndex
                              ].optionSelected = [text];
                            } else {
                              // Add new category with selected text
                              updatedValue.push({
                                id: item.id,
                                optionSelected: [text],
                              });
                            }
                          }

                          onChange(updatedValue);
                          if (updatedValue.length === 5) {
                            setStepFourErrors(false);
                          }
                        }}>
                        <Text
                          style={[
                            styles.textItem,
                            // Apply styling if the text is selected
                            value.find(
                              (habit: any) =>
                                habit.id === item.id &&
                                habit.optionSelected.includes(text),
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
  errorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
});
