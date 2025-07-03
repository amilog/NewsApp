import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

function DetailScreen() {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
