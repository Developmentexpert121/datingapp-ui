import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import ProfileSection from '../../components/Profile/profileSection';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ProfileSection />
    </SafeAreaView>
  );
};

export default ProfileScreen;
