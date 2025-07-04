import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ImageBackground, StatusBar } from 'react-native';
import RootNavigator from './src/navigations/RootNavigator';

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
      <NavigationContainer>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
