import { create } from 'zustand';
import { NewsArticle } from '../services/newsService';
import { newsService } from '../services/newsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storage/localStorage';

const PAGE_SIZE = 5;

interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalResults: number;

  setArticles: (articles: NewsArticle[]) => void;
  addArticles: (articles: NewsArticle[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  setTotalResults: (total: number) => void;
  resetNews: () => void;
  fetchFirstPage: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  refreshNews: () => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  totalResults: 0,

  setArticles: articles => set({ articles }),
  addArticles: articles =>
    set(state => ({
      articles: [...state.articles, ...articles],
    })),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setHasMore: hasMore => set({ hasMore }),
  setCurrentPage: page => set({ currentPage: page }),
  setTotalResults: total => set({ totalResults: total }),
  resetNews: () =>
    set({
      articles: [],
      loading: false,
      error: null,
      hasMore: true,
      currentPage: 1,
      totalResults: 0,
    }),
  fetchFirstPage: async () => {
    const { currentPage } = get();
    if (currentPage !== 1) set({ currentPage: 1 });
    await get().refreshNews();
  },
  fetchNextPage: async () => {
    const { loading, hasMore, currentPage } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    try {
      const resp = await newsService.getTopHeadlines(
        currentPage + 1,
        PAGE_SIZE,
      );
      if (resp && resp.articles && resp.articles.length > 0) {
        set(state => ({
          articles: [...state.articles, ...resp.articles],
          currentPage: currentPage + 1,
          hasMore: resp.articles.length === PAGE_SIZE,
        }));

        AsyncStorage.setItem(
          STORAGE_KEYS.NEWS_CACHE,
          JSON.stringify([...get().articles]),
        ).catch(() => {});
      } else {
        set({ hasMore: false });
      }
    } catch (e) {
      console.error('News fetch error', e);
      set({ error: 'Xəbər yüklənmədi' });
    } finally {
      set({ loading: false });
    }
  },
  refreshNews: async () => {
    set({ loading: true });
    try {
      const resp = await newsService.getTopHeadlines(1, PAGE_SIZE);
      if (resp && resp.articles) {
        set({
          articles: resp.articles,
          currentPage: 1,
          hasMore: resp.articles.length === PAGE_SIZE,
          error: null,
        });

        AsyncStorage.setItem(
          STORAGE_KEYS.NEWS_CACHE,
          JSON.stringify(resp.articles),
        ).catch(() => {});
      }
    } catch (e) {
      console.error('News refresh error', e);
      set({ error: 'Xəbər yüklənmədi' });
    } finally {
      set({ loading: false });
    }
  },
}));
