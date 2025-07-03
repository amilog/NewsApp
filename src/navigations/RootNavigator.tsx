import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../modules/home/home.screen';
import DetailScreen from '../modules/screens/detail.screen';

export type RootStackParamList = {
  HomeScreen: undefined;
  DetailScreen: { id: string };
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Navigator>
      <Screen name="HomeScreen" component={HomeScreen} />
      <Screen name="DetailScreen" component={DetailScreen} />
    </Navigator>
  );
}

export default RootNavigator;
