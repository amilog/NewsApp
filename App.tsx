import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';

import {
  NavigationTheme,
  NavigationDarkTheme,
} from './src/themes/NavigationTheme';
import RootNavigator from '@navigation/RootNavigator';

function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ImageBackground
      source={require('./src/assets/images/paper-background.jpg')} // hər screendə eyni arxa plan üçün şəkli burada verdim
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {isDark && <View style={styles.darkOverlay} pointerEvents="none" />}
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
    </ImageBackground>
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
