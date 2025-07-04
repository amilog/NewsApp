import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ImageBackground, StatusBar } from 'react-native';

import { NavigationTheme } from './src/themes/NavigationTheme';
import RootNavigator from '@navigation/RootNavigator';

function App() {
  return (
    <ImageBackground
      source={require('./src/assets/images/paper-background.jpg')} // hər screendə eyni arxa plan üçün şəkli burada verdim
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer theme={NavigationTheme}>
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
});

export default App;
