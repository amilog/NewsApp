import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

function HomeScreen() {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default HomeScreen;
