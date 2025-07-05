import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import colors from '@constants/colors';

import ArrowBackIcon from '@icons/arrow-back-icon.svg';

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <ArrowBackIcon width={24} height={24} color={colors.light.mainText} />
        <Text style={styles.headerText}>Home</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.mainText,
  },
});

export default HomeScreen;
