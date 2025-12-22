import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionCard } from '../../shared/ui/SectionCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchAllScientificActivityCategories } from '../../entities/scientificActivity/api/scientificActivityApi';
import type { ScientificActivityCategory } from '../../entities/scientificActivity/model/types';
import type { HomeStackParamList } from '../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ScientificActivity'>;

export const ScientificActivityScreen = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigation = useNavigation<NavigationProp>();

  const [items, setItems] = useState<ScientificActivityCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchAllScientificActivityCategories();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Не удалось загрузить категории. Потяните вниз, чтобы обновить.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    load();
  }, [load]);

  const getItemDescription = (item: ScientificActivityCategory) => {
    const parts: string[] = [];

    if (typeof item.time_kpi === 'number') {
      parts.push(`KPI: ${item.time_kpi}`);
    }
    if (item.is_head_of) {
      parts.push('Для заведующих');
    }
    if (item.is_director) {
      parts.push('Для директоров');
    }

    return parts.length ? parts.join(' • ') : undefined;
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View className="mb-4 p-1">
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Научная деятельность
          </ThemedText>

          {isLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator color={isDark ? '#60A5FA' : '#2563EB'} />
              <ThemedText variant="muted" className="mt-3 text-sm">
                Загружаем категории…
              </ThemedText>
            </View>
          ) : error ? (
            <View className="rounded-xl p-4" style={{ backgroundColor: isDark ? '#111827' : '#F3F4F6' }}>
              <ThemedText variant="body" className="text-sm font-semibold">
                Ошибка
              </ThemedText>
              <ThemedText variant="muted" className="mt-1 text-sm">
                {error}
              </ThemedText>
            </View>
          ) : items.length === 0 ? (
            <View className="rounded-xl p-4" style={{ backgroundColor: isDark ? '#111827' : '#F3F4F6' }}>
              <ThemedText variant="muted" className="text-sm">
                Пока нет доступных категорий.
              </ThemedText>
            </View>
          ) : (
            <View className="gap-1">
              {items.map((item) => (
                <SectionCard
                  key={item.id}
                  title={item.label}
                  icon="flask-outline"
                  description={getItemDescription(item)}
                  onPress={() => {
                    // TODO: Навигация к деталям категории
                    console.log('Scientific category:', item.id);
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

