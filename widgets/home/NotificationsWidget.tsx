import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useAuthStore } from '../../entities/session/model/authStore';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { HomeStackParamList } from '../../app/navigation/types';

type NotificationsNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const NotificationsWidget = () => {
  const navigation = useNavigation<NotificationsNavigationProp>();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const alertNumber = user?.alertNumber ?? 0;

  const handlePress = () => {

  };

  if (alertNumber === 0) {
    return null;
  }

  return (
    <Pressable onPress={handlePress} className="mb-4">
      <ThemedCard className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className={`h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={isDark ? '#60A5FA' : '#2563EB'}
              />
            </View>
            <View className="ml-3 flex-1">
              <ThemedText variant="title" className="text-lg font-bold">
                Уведомления
              </ThemedText>
              <ThemedText variant="muted" className="mt-1 text-sm">
                У вас {alertNumber} {alertNumber === 1 ? 'новое уведомление' : 'новых уведомлений'}
              </ThemedText>
            </View>
          </View>
          <View className="ml-3 min-h-[24px] min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2">
            <ThemedText variant="title" className="text-xs font-bold text-white">
              {alertNumber}
            </ThemedText>
          </View>
        </View>
      </ThemedCard>
    </Pressable>
  );
};

