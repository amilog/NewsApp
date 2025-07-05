import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  useColorScheme,
  Dimensions,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import HomeScreen from '@modules/home/home.screen';
import FavoriteScreen from '@modules/favorite/favorite.screen';
import PaperIcon from '@icons/tabbar/paper-icon.svg';
import LikeIcon from '@icons/tabbar/like-icon.svg';
import colors from '@constants/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const TAB_BAR_WIDTH = 220;
const TAB_BAR_HEIGHT = 60;
const TAB_RADIUS = 32;
const TAB_COUNT = 2;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const tabWidth = TAB_BAR_WIDTH / TAB_COUNT;
  const indicatorX = useSharedValue(state.index * tabWidth);

  React.useEffect(() => {
    indicatorX.value = withSpring(state.index * tabWidth, {
      damping: 16,
      stiffness: 180,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const mirrorEffectStyle = [
    styles.mirrorEffect,
    colorScheme === 'dark'
      ? { backgroundColor: 'rgba(255,255,255,0.10)', opacity: 0.12 }
      : { backgroundColor: 'rgba(255,255,255,0.28)', opacity: 0.45 },
  ];

  const glassOverlayStyle = [
    styles.glassOverlay,
    colorScheme === 'dark'
      ? { backgroundColor: 'rgba(30,30,30,0.22)' }
      : { backgroundColor: 'rgba(255,255,255,0.18)' },
  ];

  const gradientOverlayStyle = [
    styles.gradientOverlay,
    colorScheme === 'dark'
      ? { backgroundColor: 'rgba(30,30,30,0.10)', opacity: 0.18 }
      : { backgroundColor: 'rgba(255,255,255,0.10)', opacity: 0.5 },
  ];

  return (
    <View
      style={[
        styles.tabBarWrapper,
        { width: SCREEN_WIDTH, pointerEvents: 'box-none' },
      ]}
    >
      <View
        style={[
          styles.tabBarContainer,
          {
            borderColor: theme.tabBarBorder,
            backgroundColor: theme.tabBar,
          },
        ]}
      >
        <View style={glassOverlayStyle} pointerEvents="none" />
        <View style={mirrorEffectStyle} pointerEvents="none" />
        <View style={gradientOverlayStyle} pointerEvents="none" />
        <Animated.View
          style={[
            styles.animatedIndicator,
            indicatorStyle,
            {
              width: tabWidth - 16,
              backgroundColor:
                colorScheme === 'dark'
                  ? 'rgba(255, 255, 255, 0.10)'
                  : 'rgba(255, 255, 255, 0.85)',
              shadowColor: colorScheme === 'dark' ? '#000' : '#222',
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const Icon = route.name === 'Home' ? PaperIcon : LikeIcon;
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={undefined}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <Icon
                width={22}
                height={22}
                color={isFocused ? theme.tabBarIcon : theme.tabBarIconInactive}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.tabBarIcon
                      : theme.tabBarIconInactive,
                  },
                  isFocused && styles.tabLabelActive,
                ]}
              >
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function BottomTabBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{ tabBarLabel: 'Favorites' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 36 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  tabBarContainer: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  tabBarLight: {
    borderColor: 'rgba(200,200,200,0.18)',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  tabBarDark: {
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(30,30,30,0.65)',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: TAB_RADIUS,
  },
  mirrorEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    borderTopLeftRadius: TAB_RADIUS,
    borderTopRightRadius: TAB_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.28)',
    opacity: 0.45,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    borderBottomLeftRadius: TAB_RADIUS,
    borderBottomRightRadius: TAB_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.10)',
    opacity: 0.5,
  },
  animatedIndicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 8,
    borderRadius: TAB_RADIUS - 8,
    zIndex: -1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 2,
  },
  tabLabel: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: 'bold',
  },
});

export default BottomTabBar;
