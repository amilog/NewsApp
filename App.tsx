import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  NavigationTheme,
  NavigationDarkTheme,
} from 'src/themes/NavigationTheme';
import RootNavigator from '@navigation/RootNavigator';

function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer
        theme={isDark ? NavigationDarkTheme : NavigationTheme}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
});

export default App;
