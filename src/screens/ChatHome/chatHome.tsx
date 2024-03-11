import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import ChatSection from '../../components/Chat/allChats';
const ChatHome = () => {
  return (
    <SafeAreaView>
      <ChatSection />
    </SafeAreaView>
  );
};

export default ChatHome;
