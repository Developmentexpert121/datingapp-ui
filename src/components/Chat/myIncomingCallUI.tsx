import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';

export default function MyIncomingCallUI({call}: any) {
  return (
    <View>
      <Text>Incoming Call</Text>
      <Button title="Join!" onPress={() => call.join()} />
    </View>
  );
}
