import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { News } from '../../entities/news/model/types';

interface NewsCardProps {
  news: News;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleFilePress = async (fileUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  };

  return (
    <ThemedCard className="mb-3 p-4">
      <View className="mb-3">
        <ThemedText variant="title" className="mb-2 text-lg font-bold">
          {news.title}
        </ThemedText>
        <ThemedText variant="muted" className="text-xs">
          {news.date_publication}
        </ThemedText>
      </View>

      <ThemedText variant="body" className="mb-3 text-sm leading-5">
        {news.description}
      </ThemedText>

      {news.employee_name && (
        <View className="mb-3 flex-row items-center">
          <Ionicons
            name="person-outline"
            size={14}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
          <ThemedText variant="muted" className="ml-1.5 text-xs">
            {news.employee_name}
          </ThemedText>
        </View>
      )}

      {news.files_news && news.files_news.length > 0 && (
        <View className="mt-3">
          <ThemedText variant="label" className="mb-2 text-xs">
            Прикрепленные файлы:
          </ThemedText>
          {news.files_news.map((file) => (
            <Pressable
              key={file.id}
              onPress={() => handleFilePress(file.file)}
              className={`mb-2 flex-row items-center rounded-lg border px-3 py-2 ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Ionicons
                name="document-outline"
                size={18}
                color={isDark ? '#60A5FA' : '#2563EB'}
              />
              <ThemedText variant="body" className="ml-2 flex-1 text-sm">
                {file.file.split('/').pop() || 'Файл'}
              </ThemedText>
              <Ionicons
                name="download-outline"
                size={18}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          ))}
        </View>
      )}
    </ThemedCard>
  );
};

