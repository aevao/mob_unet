import { View } from 'react-native';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export const TaskSkeleton = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View>
      {[1, 2, 3].map((i) => (
        <ThemedCard key={i} className="mb-3 p-4">
          <View className="mb-3">
            <View 
              className="mb-2 h-5 rounded"
              style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}
            />
            <View 
              className="mb-2 h-4 w-3/4 rounded"
              style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}
            />
            <View 
              className="h-4 w-1/2 rounded"
              style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}
            />
          </View>
          <View 
            className="h-4 w-1/3 rounded"
            style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}
          />
        </ThemedCard>
      ))}
    </View>
  );
};

