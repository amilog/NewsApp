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
    console.log(`📡 Fetching news page ${page}...`);

    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=bitcoin&apiKey=1a86a26561cf49289b518d572e483a1e&page=${page}&pageSize=${pageSize}`,
      );

      console.log('✅ Data received:', !!response.data);
      console.log(
        `📊 Articles count: ${response.data?.articles?.length} (page ${page})`,
      );

      return response.data;
    } catch (error) {
      console.log('❌ Failed to fetch news');
      return null;
    }
  },
};
