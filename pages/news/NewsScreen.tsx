import { useEffect } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { NewsCard } from '../../widgets/news/NewsCard';
import { NewsSkeleton } from '../../widgets/news/NewsSkeleton';
import { useNewsStore } from '../../entities/news/model/newsStore';

export const NewsScreen = () => {
  const { news, isLoading, error, fetchNews } = useNewsStore();

  useEffect(() => {
    void fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Новости
          </ThemedText>

          {isLoading ? (
            <NewsSkeleton />
          ) : error ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center text-red-400">
                {error}
              </ThemedText>
            </View>
          ) : news.length === 0 ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center">
                Новостей пока нет
              </ThemedText>
            </View>
          ) : (
            <View>
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};
