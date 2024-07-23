import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';

const FifthStepScreen = ({habits2, control, errors}: any) => {
  const dataArray = [
    {
      id: '1',
      title: 'What is your communication style?',
      texts: [
        'I stay on WhatsApp allday',
        'Big time texter',
        'Phone caller',
        'Video chatter',
        'Bad Texter',
        'Better in person',
      ],
      image: require('../../../assets/images/chat-balloon.png'),
    },
    {
      id: '2',
      title: 'How do you receive love?',
      texts: ['Thoughtful Gestures', 'Touch', 'Compliments', 'Time together'],
      image: require('../../../assets/images/love.png'),
    },

    {
      id: '3',
      title: 'What is your education level?',
      texts: ['Bachelors', 'In college', 'High school', 'PHD', 'Masters'],
      image: require('../../../assets/images/abroad.png'),
    },
    {
      id: '4',
      title: 'What is your zodiac sign?',
      texts: [
        'Capricorn',
        'Aquarius',
        'Pisces',
        'Aries',
        'Taurus',
        'Gemini',
        'Virgo',
        'Leo',
        'Libra',
        'Scorpio',
        'Cancer',
        'Sagittarius',
      ],
      image: require('../../../assets/images/moon.png'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>What else makes you, you?</Text>
        <Text style={styles.paragraphText}>
          Don't hold back Authenticity attracts authenticity.
        </Text>
        {errors.habits2 && (
          <Text style={{color: 'red', alignSelf: 'center', marginTop: 6}}>
            {errors.habits2.message}
          </Text>
        )}
        <View style={{height: 10}}></View>
        <Controller
          name={habits2}
          control={control}
          defaultValue={[]}
          render={({field: {onChange, value}}) => (
            <>
              {dataArray.map(item => (
                <View
                  key={item.id}
                  style={[
                    styles.boxContainer,
                    // errors.habits2 && styles.errorBorder,
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
                          console.log('updatedValue', updatedValue);
                          const existingCategoryIndex = updatedValue.findIndex(
                            (habit: any) => habit.id === item.id,
                          );
                          console.log(
                            'existingCategoryIndex',
                            existingCategoryIndex,
                          );
                          if (existingCategoryIndex !== -1) {
                            const existingSelections =
                              updatedValue[existingCategoryIndex]
                                .optionSelected;
                            const textIndex = existingSelections.indexOf(text);

                            if (textIndex !== -1) {
                              // If the text is already selected, remove it
                              existingSelections.splice(textIndex, 1);
                            } else {
                              // If the text is not selected, add it
                              existingSelections.push(text);
                            }

                            // Update the existing category with new selections
                            updatedValue[existingCategoryIndex].optionSelected =
                              existingSelections;
                          } else {
                            // Add new category with selected text
                            updatedValue.push({
                              id: item.id,
                              optionSelected: [text],
                            });
                          }

                          console.log('updatedValue', updatedValue);

                          onChange(updatedValue);
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

export default FifthStepScreen;

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
