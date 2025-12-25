import { View } from 'react-native';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

const SkeletonLine = ({ width = '100%', height = 16 }: { width?: string | number; height?: number }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View
      className="rounded"
      style={{
        width,
        height,
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
      }}
    />
  );
};

export const ProfileSkeleton = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View className="flex-1">
      {/* Header Skeleton - карточка */}
      <View
        className="mx-4 mt-4 mb-4 rounded-2xl overflow-hidden"
        style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}
      >
        <View className="flex-row items-center p-4">
          <View
            className="h-20 w-20 rounded-full"
            style={{ backgroundColor: isDark ? '#374151' : '#E5E7EB' }}
          />
          <View className="ml-4 flex-1">
            <SkeletonLine width="70%" height={20} />
            <View className="mt-2">
              <SkeletonLine width="50%" height={14} />
            </View>
          </View>
        </View>
      </View>

      {/* List Skeleton */}
      <View
        className="mx-4 mt-4 mb-4 rounded-2xl overflow-hidden"
        style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}
      >
        {[1, 2].map((i) => (
          <View key={i}>
            <View className="px-4 py-4 flex-row items-center">
              <View
                className="mr-4 h-12 w-12 rounded-xl"
                style={{ backgroundColor: isDark ? '#374151' : '#E5E7EB' }}
              />
              <View className="flex-1">
                <SkeletonLine width={60} height={14} />
                <View className="mt-2">
                  <SkeletonLine width="80%" height={16} />
                </View>
              </View>
            </View>
            {i < 2 && (
              <View
                className="h-px"
                style={{ backgroundColor: isDark ? '#374151' : '#E5E7EB', marginLeft: 72 }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

