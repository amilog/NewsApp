import axios from 'axios';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export const newsService = {
  getTopHeadlines: async (
    page: number = 1,
    pageSize: number = 5,
  ): Promise<NewsResponse | null> => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=bitcoin&apiKey=71a5c9d9ef644ea9964f707b8da4fe2b&page=${page}&pageSize=${pageSize}`,
      );

      return response.data;
    } catch (error) {
      return null;
    }
  },
};
