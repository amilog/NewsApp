import React, { useEffect, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import FastImage from 'react-native-fast-image';
import colors from '@constants/colors';
import { NewsArticle } from '@services/newsService';
import NewsCard from './components/NewsCard';
import NewsCardSkeleton from './components/NewsCardSkeleton';
import { useFavoriteStore } from '@store/favoriteStore';
import { STORAGE_KEYS } from '@store/storage/localStorage';
import { useNewsStore } from '@store/newsStore';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 408;

function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  const {
    articles,
    loading,
    hasMore,
    currentPage,
    error,
    fetchFirstPage,
    fetchNextPage,
    refreshNews,
    setArticles,
  } = useNewsStore();

  const favorites = useFavoriteStore(state => state.favorites);
  const addFavorite = useFavoriteStore(state => state.addFavorite);
  const removeFavorite = useFavoriteStore(state => state.removeFavorite);
  const isFavorite = useFavoriteStore(state => state.isFavorite);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const scrollY = useSharedValue(0);
  const viewportH = useSharedValue(0);
  const isLoadingMore = loading && currentPage > 1;
  const isLoading = loading && currentPage === 1 && !isRefreshing;

  const CACHE_KEY = STORAGE_KEYS.NEWS_CACHE;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
      viewportH.value = event.layoutMeasurement.height;
    },
  });

  const fetchPage = useCallback(
    async (page: number, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
        await refreshNews();
        setIsRefreshing(false);
      } else if (page === 1) {
        await fetchFirstPage();
      } else {
        await fetchNextPage();
      }
    },
    [fetchFirstPage, fetchNextPage, refreshNews],
  );

  const loadCachedArticles = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CACHE_KEY);
      if (stored) {
        const cached: NewsArticle[] = JSON.parse(stored);
        setArticles(cached);

        const imagesToPreload = cached
          .filter(article => article.urlToImage)
          .slice(0, 10)
          .map(article => ({
            uri: article.urlToImage!,
            priority: FastImage.priority.low,
            cache: FastImage.cacheControl.cacheOnly,
          }));

        if (imagesToPreload.length > 0) {
          FastImage.preload(imagesToPreload);
        }
      } else {
        setArticles([]);
      }
    } catch (error) {
      setArticles([]);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    if (isOnline) {
      fetchPage(1, true);
    } else {
      loadCachedArticles();
    }
  }, [isOnline, fetchPage, loadCachedArticles]);

  const handleLoadMore = useCallback(() => {
    if (isOnline && hasMore && !isLoadingMore && !isLoading) {
      fetchPage(currentPage + 1, false);
    }
  }, [isOnline, hasMore, isLoadingMore, isLoading, currentPage, fetchPage]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      setIsOnline(online);

      if (online) {
        console.log('Online');
        fetchPage(1, true);
      } else {
        console.log('Offline');
        loadCachedArticles();
      }
    });

    NetInfo.fetch().then((state: any) => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      setIsOnline(online);

      if (online) {
        fetchPage(1, false);
      } else {
        loadCachedArticles();
      }
    });

    return unsubscribe;
  }, [fetchPage, loadCachedArticles]);

  const handleLike = useCallback(
    (article: NewsArticle) => {
      if (isFavorite(article.url)) {
        removeFavorite(article.url);
      } else {
        addFavorite(article);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  const handlePress = useCallback((article: NewsArticle) => {
    console.log('Article pressed:', article.title);
  }, []);

  const isArticleLiked = useCallback(
    (article: NewsArticle) => {
      return isFavorite(article.url);
    },
    [isFavorite],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: NewsArticle; index: number }) => (
      <NewsCard
        article={item}
        onPress={handlePress}
        onLike={handleLike}
        isLiked={isArticleLiked(item)}
        scrollY={scrollY}
        viewportH={viewportH}
        index={index}
      />
    ),
    [handlePress, handleLike, isArticleLiked, scrollY, viewportH],
  );

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <NewsCardSkeleton />;
    }
    return null;
  }, [isLoadingMore]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? '#0a0a0f' : '#f0f2f8' },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.mainText }]}>
            Xəbərlər
          </Text>
        </View>
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={item => `skeleton-${item}`}
          renderItem={() => <NewsCardSkeleton />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? '#0a0a0f' : '#f0f2f8' },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.mainText }]}>
            Xəbərlər
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.mainText }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.accent }]}
            onPress={handleRefresh}
          >
            <Text style={[styles.retryButtonText, { color: '#fff' }]}>
              Yenidən cəhd et
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0a0a0f' : '#f0f2f8' },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.mainText }]}>
          Xəbərlər
        </Text>
        <Text style={[styles.likedCount, { color: theme.accent }]}>
          {favorites.length} bəyənilən
        </Text>
      </View>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Keşlənmiş xəbərlərə baxırsınız</Text>
        </View>
      )}

      <Animated.FlatList
        data={articles}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.accent]}
            tintColor={theme.accent}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        getItemLayout={getItemLayout}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  likedCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  offlineBanner: {
    backgroundColor: '#ff9800',
    paddingVertical: 4,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
