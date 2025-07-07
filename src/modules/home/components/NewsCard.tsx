import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import type { SharedValue } from 'react-native-reanimated';

import colors from '@constants/colors';
import { NewsArticle } from '@services/newsService';
import HeartIcon from '@icons/tabbar/like-icon.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ITEM_HEIGHT = 408;

interface NewsCardProps {
  article: NewsArticle;
  onPress?: (article: NewsArticle) => void;
  onLike?: (article: NewsArticle) => void;
  isLiked?: boolean;
  scrollY?: SharedValue<number>;
  viewportH?: SharedValue<number>;
  index?: number;
}

const AnimatedTitle: React.FC<{
  text: string;
  maxWidth: number;
}> = ({ text, maxWidth }) => {
  const translateX = useSharedValue(0);
  const [textWidth, setTextWidth] = React.useState(0);

  const measureRef = React.useRef<any>(null);

  useEffect(() => {
    if (measureRef.current) {
      measureRef.current.measure((x: number, y: number, w: number) => {
        setTextWidth(w);
      });
    }
  }, [text]);

  useEffect(() => {
    if (textWidth > maxWidth) {
      const scrollDistance = textWidth - maxWidth + 40;

      translateX.value = withRepeat(
        withSequence(
          withDelay(2500, withTiming(0, { duration: 0 })),
          withTiming(-scrollDistance, { duration: scrollDistance * 40 }),
          withDelay(1500, withTiming(-scrollDistance, { duration: 0 })),
          withTiming(0, { duration: 800 }),
        ),
        -1,
        false,
      );
    } else {
      translateX.value = 0;
    }
  }, [textWidth, maxWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (textWidth <= maxWidth) {
    return (
      <Text style={styles.titleText} numberOfLines={2}>
        {text}
      </Text>
    );
  }

  return (
    <View style={{ width: maxWidth, overflow: 'hidden' }}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.titleText} numberOfLines={1}>
          {text}
        </Text>
      </Animated.View>

      <Text
        style={[styles.titleText, { position: 'absolute', opacity: 0 }]}
        ref={measureRef}
      >
        {text}
      </Text>
    </View>
  );
};

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onPress,
  onLike,
  isLiked = false,
  scrollY,
  viewportH,
  index = 0,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  const animatedCardStyle = useAnimatedStyle(() => {
    if (!scrollY || !viewportH) return {};

    const viewH = viewportH.value;
    const currentScrollY = scrollY.value;

    const cardCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;

    const viewportCenterY = currentScrollY + viewH / 2;

    const distance = Math.abs(cardCenterY - viewportCenterY);

    const normalizedDistance = Math.min(distance / (viewH / 2), 1);

    const scale = 1 - normalizedDistance * 0.15;

    const opacity = 1 - normalizedDistance * 0.6;

    const rotationFactor = (cardCenterY - viewportCenterY) / (viewH / 2);
    const rotateX = rotationFactor * 12;

    return {
      transform: [
        { perspective: 1000 },
        { scale: Math.max(scale, 0.85) },
        { rotateX: `${Math.max(Math.min(rotateX, 12), -12)}deg` },
      ],
      opacity: Math.max(opacity, 0.4),
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    if (!scrollY || !viewportH) return {};

    const viewH = viewportH.value;
    const currentScrollY = scrollY.value;

    const cardCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;

    const viewportCenterY = currentScrollY + viewH / 2;

    const distance = cardCenterY - viewportCenterY;

    const parallaxY = (distance / viewH) * 30;

    return {
      transform: [{ translateY: parallaxY }],
    };
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'İndi';
    if (diffHours < 24) return `${diffHours} saat əvvəl`;
    if (diffDays < 7) return `${diffDays} gün əvvəl`;

    return date.toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePress = () => onPress?.(article);
  const handleLike = () => onLike?.(article);

  const glassColors =
    colorScheme === 'dark'
      ? {
          container: '#1e1e1e',
          containerBorder: 'transparent',
          content: 'rgba(0,0,0,0.5)',
          contentBorder: 'transparent',
          shadow: 'rgba(0,0,0,0.4)',
          dateContainer: 'rgba(0,0,0,0.4)',
        }
      : {
          container: '#ffffff',
          containerBorder: 'transparent',
          content: 'rgba(0,0,0,0.5)',
          contentBorder: 'transparent',
          shadow: 'rgba(0,0,0,0.4)',
          dateContainer: 'rgba(0,0,0,0.4)',
        };

  const likeColors = isLiked
    ? {
        background: 'rgba(255, 69, 58, 0.9)',
        border: 'rgba(255, 69, 58, 0.8)',
        iconColor: '#FFFFFF',
      }
    : colorScheme === 'dark'
    ? {
        background: 'rgba(255, 255, 255, 0.15)',
        border: 'rgba(255, 255, 255, 0.3)',
        iconColor: 'rgba(255, 255, 255, 0.85)',
      }
    : {
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'rgba(255, 255, 255, 1.0)',
        iconColor: 'rgba(0, 0, 0, 0.7)',
      };

  const titleMaxWidth = SCREEN_WIDTH - 64;

  return (
    <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.95}
        style={styles.touchableCard}
      >
        <View
          style={[
            styles.cardSurface,
            {
              backgroundColor: glassColors.container,
              borderColor: glassColors.containerBorder,
              shadowColor: glassColors.shadow,
            },
          ]}
        >
          <View style={styles.highlight} pointerEvents="none" />
          <View style={styles.innerFade} pointerEvents="none" />

          <View
            style={[
              styles.dateContainer,
              { backgroundColor: glassColors.dateContainer },
            ]}
          >
            <Text style={styles.dateText}>
              {formatDate(article.publishedAt)}
            </Text>
          </View>

          {article.urlToImage && (
            <View style={styles.imageContainer}>
              <Animated.View style={[styles.imageWrapper, animatedImageStyle]}>
                <FastImage
                  source={{
                    uri: article.urlToImage,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  style={styles.mainImage}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Animated.View>
              <View style={styles.imageOverlay} />
            </View>
          )}

          <View style={styles.contentSection}>
            <View
              style={[
                styles.sourceContainer,
                {
                  backgroundColor: glassColors.content,
                  borderColor: glassColors.contentBorder,
                },
              ]}
            >
              <Text
                style={[styles.sourceText, { color: theme.accent }]}
                numberOfLines={1}
              >
                {article.source.name}
              </Text>
            </View>

            <View style={styles.titleSection}>
              <AnimatedTitle text={article.title} maxWidth={titleMaxWidth} />
            </View>

            {article.description && (
              <Text style={styles.descriptionText} numberOfLines={2}>
                {article.description}
              </Text>
            )}

            <View
              style={[
                styles.footerContainer,
                {
                  backgroundColor: glassColors.content,
                  borderColor: glassColors.contentBorder,
                },
              ]}
            >
              <Text style={styles.authorText} numberOfLines={1}>
                {article.author || 'Müəllif məlum deyil'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.likeButton,
                  {
                    backgroundColor: likeColors.background,
                    borderColor: likeColors.border,
                  },
                ]}
                onPress={handleLike}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <HeartIcon
                  width={18}
                  height={18}
                  color={likeColors.iconColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(NewsCard);

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 14,
    marginHorizontal: 16,
    height: ITEM_HEIGHT - 28,
  },

  touchableCard: {
    flex: 1,
  },

  cardSurface: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
    flex: 1,
  },

  dateContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  imageContainer: {
    height: 260,
    position: 'relative',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '120%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f7',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  contentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },

  sourceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sourceText: {
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  titleSection: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  authorText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  likeButton: {
    padding: 8,
    borderRadius: 16,
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  innerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
