import { View } from 'react-native';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export const ScheduleSkeleton = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View className="flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <ThemedCard key={i} className="p-3">
          <View className="flex-row items-start">
            <View
              className={`h-12 w-12 rounded-md ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            />
            <View className="ml-3 flex-1 gap-2">
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
                style={{ width: '80%' }}
              />
              <View
                className={`h-3 rounded ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
                style={{ width: '50%' }}
              />
            </View>
          </View>
        </ThemedCard>
      ))}
    </View>
  );
};

