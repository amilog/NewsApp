import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoriteStore } from '@store/favoriteStore';
import colors from '@constants/colors';
import { NewsArticle } from '@services/newsService';
import NewsCard from '@modules/home/components/NewsCard';

function FavoriteScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const { favorites, removeFavorite, clearFavorites } = useFavoriteStore();

  const removeLikedArticle = useCallback(
    (article: NewsArticle) => {
      removeFavorite(article.url);
    },
    [removeFavorite],
  );

  const handleArticlePress = useCallback((article: NewsArticle) => {
    console.log('Bəyənilən xəbərə basıldı:', article.title);
  }, []);

  const handleClearAll = useCallback(() => {
    clearFavorites();
  }, [clearFavorites]);

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => (
      <NewsCard
        article={item}
        onPress={handleArticlePress}
        onLike={removeLikedArticle}
        isLiked={true}
      />
    ),
    [handleArticlePress, removeLikedArticle],
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0a0a0f' : '#f0f2f8' },
      ]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: theme.mainText }]}>
          Bəyənilən Xəbərlər
        </Text>
        {favorites.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: theme.accent }]}
            onPress={handleClearAll}
          >
            <Text style={[styles.clearButtonText, { color: theme.accent }]}>
              Hamısını sil
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item, index) => `liked-${item.url}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: theme.mainText }]}>
              Hələ bəyənilən xəbər yoxdur
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
              Xəbərləri bəyənməyə başlayın və burada görün
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: 380,
          offset: 380 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

export default FavoriteScreen;

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
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
