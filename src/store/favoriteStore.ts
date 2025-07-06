import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '@services/newsService';
import { STORAGE_KEYS } from '@store/storage/localStorage';

interface FavoriteState {
  favorites: NewsArticle[];
  addFavorite: (article: NewsArticle) => void;
  removeFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: article =>
        set(state => ({
          favorites: [
            article,
            ...state.favorites.filter(
              (fav: NewsArticle) => fav.url !== article.url,
            ),
          ],
        })),
      removeFavorite: url =>
        set(state => ({
          favorites: state.favorites.filter(
            (fav: NewsArticle) => fav.url !== url,
          ),
        })),
      isFavorite: url => !!get().favorites.find(a => a.url === url),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
