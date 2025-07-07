import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  NEWS_CACHE: 'news_cache',
  FAVORITES: 'favorites',
  LAST_FETCH: 'last_fetch',
};

interface CacheData<T> {
  data: T;
  timestamp: number;
  page: number;
}

export const storage = {
  saveToCache: async <T>(key: string, data: T, page: number = 1) => {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        page,
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.log('Cache save error:', error);
    }
  },

  getFromCache: async <T>(
    key: string,
    maxAge: number = 5 * 60 * 1000,
    page: number = 1,
  ): Promise<T | null> => {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const {
          data,
          timestamp,
          page: cachedPage,
        }: CacheData<T> = JSON.parse(cached);

        if (cachedPage === page && Date.now() - timestamp < maxAge) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.log('Cache read error:', error);
      return null;
    }
  },

  set: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Storage set error:', error);
    }
  },

  get: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log('Storage get error:', error);
      return null;
    }
  },

  delete: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Storage delete error:', error);
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Storage clear error:', error);
    }
  },
};
