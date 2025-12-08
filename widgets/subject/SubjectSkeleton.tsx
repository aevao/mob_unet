import { View } from 'react-native';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export const SubjectSkeleton = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View className="flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <ThemedCard key={i} className="p-4">
          <View className="mb-3 flex-row items-center">
            <View
              className={`mr-3 h-10 w-10 rounded-xl ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            />
            <View className="flex-1 gap-2">
              <View
                className={`h-4 rounded ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
                style={{ width: '60%' }}
              />
              <View
                className={`h-3 rounded ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
                style={{ width: '40%' }}
              />
            </View>
          </View>
          <View className="gap-2">
            <View
              className={`h-3 rounded ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}
              style={{ width: '80%' }}
            />
            <View
              className={`h-3 rounded ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}
              style={{ width: '70%' }}
            />
            <View
              className={`h-3 rounded ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}
              style={{ width: '50%' }}
            />
          </View>
          <View
            className={`mt-4 h-10 rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          />
        </ThemedCard>
      ))}
    </View>
  );
};

