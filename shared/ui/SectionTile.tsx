import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedCard } from './ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';

interface SectionTileProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  description?: string;
  color?: string;
}


export const SectionTile = ({
  title,
  icon,
  onPress,
  description,
  color,
}: SectionTileProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Используем мягкий синий цвет для иконки
  const iconColor = isDark ? '#60A5FA' : '#3B82F6';

  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <ThemedCard className="p-4 min-h-[120px] justify-between">
        <View className="items-start">
          <View
            className={`h-12 w-12 items-center justify-center rounded-xl mb-3 ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}
          >
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <ThemedText
            variant="body"
            className={`text-base font-medium  ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
          >
            {title}
          </ThemedText>
          {description && (
            <ThemedText variant="muted" className="mt-1 text-xs leading-4">
              {description}
            </ThemedText>
          )}
        </View>
      </ThemedCard>
    </Pressable>
  );
};

