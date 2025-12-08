import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';

interface SectionCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  description?: string;
}

export const SectionCard = ({ title, icon, onPress, description }: SectionCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Pressable onPress={onPress}>
      <ThemedCard className="p-4 mb-2">
        <View className="flex-row items-center">
          <View
            className={`h-12 w-12 items-center justify-center rounded-xl ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}
          >
            <Ionicons
              name={icon}
              size={24}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </View>
          <View className="ml-4 flex-1">
            <ThemedText variant="body" className="text-base font-semibold">
              {title}
            </ThemedText>
            {description && (
              <ThemedText variant="muted" className="mt-1 text-xs">
                {description}
              </ThemedText>
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </ThemedCard>
    </Pressable>
  );
};

