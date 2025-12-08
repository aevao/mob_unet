import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';

export const TopBar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { ticket } = useStudentTicketStore();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  const avatarUrl = ticket?.photo || user?.avatarUrl || null;
  const alertNumber = user?.alertNumber ?? 0;

  return (
    <View
      className={`flex-row items-center justify-between border-b px-4 ${
        isDark ? 'border-gray-800 bg-[#020617]' : 'border-gray-200 bg-white'
      }`}
      style={{ paddingTop: insets.top, paddingBottom: 12 }}
    >
      <View className="flex-row items-center gap-3">
        <ThemedText variant="title" className="text-xl font-bold">
          UNET
        </ThemedText>
      </View>
      <View className="flex-row items-center gap-3">
      <Pressable
        onPress={() => void toggleTheme()}
        className={`rounded-full border p-2 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={20}
          color={isDark ? '#E5E7EB' : '#1F2937'}
        />
      </Pressable>
        <Pressable
          className={`relative rounded-full border px-3 py-2 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={isDark ? '#E5E7EB' : '#1F2937'}
          />
          {alertNumber > 0 ? (
            <View className="absolute -right-1 -top-1 min-h-[18px] min-w-[18px] rounded-full bg-red-500 px-1">
              <ThemedText variant="title" className="text-center text-[10px] text-white">
                {alertNumber}
              </ThemedText>
            </View>
          ) : null}
        </Pressable>

        <View
          className={`h-10 w-10 overflow-hidden rounded-full border ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <ThemedText variant="body" className="text-center text-xs leading-10">
              UNET
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

