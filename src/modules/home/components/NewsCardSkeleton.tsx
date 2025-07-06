import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import colors from '@constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_HORIZONTAL_MARGIN = 16;
const CARD_HEIGHT = 260;

const NewsCardSkeleton: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  const pulse = useSharedValue(0.6);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.cardBackground },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: theme.subText + '33' },
          ]}
        />

        <View style={styles.contentArea}>
          <View
            style={[
              styles.textPlaceholder,
              { width: '60%', backgroundColor: theme.subText + '33' },
            ]}
          />
          <View
            style={[
              styles.textPlaceholder,
              { width: '90%', backgroundColor: theme.subText + '25' },
            ]}
          />
          <View
            style={[
              styles.textPlaceholder,
              { width: '80%', backgroundColor: theme.subText + '20' },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default React.memo(NewsCardSkeleton);

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: CARD_HORIZONTAL_MARGIN,
    marginVertical: 14,
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    height: CARD_HEIGHT + 100,
  },
  imagePlaceholder: {
    height: CARD_HEIGHT,
    width: '100%',
  },
  contentArea: {
    padding: 20,
  },
  textPlaceholder: {
    height: 18,
    borderRadius: 6,
    marginBottom: 12,
  },
});
