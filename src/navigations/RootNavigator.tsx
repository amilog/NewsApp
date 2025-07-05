import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabBar from './BottomTabBar';
import DetailScreen from '@modules/screens/detail.screen';

export type RootStackParamList = {
  BottomTabBar: undefined;
  DetailScreen: { id: string };
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
      <Screen name="BottomTabBar" component={BottomTabBar} />
      <Screen name="DetailScreen" component={DetailScreen} />
    </Navigator>
  );
}

export default RootNavigator;
