import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';
import { QrCodeModal } from '../../widgets/home/QrCodeModal';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export const StudentTicketScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const { ticket, error } = useStudentTicketStore();
  const { user, storedAvatarUrl } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const fullName = ticket
    ? `${ticket.surname} ${ticket.first_name} ${ticket.last_name}`
    : user?.name || 'Нет данных';
  const avatarUrl = getUserAvatarSync(user?.avatarUrl, ticket?.photo, storedAvatarUrl);

  return (
    <ScreenContainer>
      <AppScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <ThemedCard className="p-6">
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className={`h-12 w-12 items-center justify-center rounded-xl ${
                    isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={isDark ? '#60A5FA' : '#2563EB'}
                  />
                </View>
                <ThemedText variant="title" className="ml-3 text-xl font-bold">
                  Студенческий билет
                </ThemedText>
              </View>
              <Pressable
                onPress={() => setQrVisible(true)}
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </Pressable>
            </View>

            {/* University Name */}
            <ThemedText variant="muted" className="mb-6 text-center text-sm">
              Кыргызский государственный технический университет им. И. Раззакова
            </ThemedText>

            {/* Student Info */}
            <View className="mb-6 flex-row">
              <OptimizedImage
                uri={avatarUrl}
                style={{ width: 100, height: 120, borderRadius: 12 }}
                className="rounded-xl bg-white"
                resizeMode="cover"
                fallbackIcon="person"
                showLoadingIndicator={false}
              />

              <View className="ml-4 flex-1">
                <ThemedText variant="label" className="text-xs uppercase">
                  Фамилия, фамилиясы:
                </ThemedText>
                <ThemedText variant="body" className="mb-4 text-base font-semibold">
                  {fullName}
                </ThemedText>

                <ThemedText variant="label" className="text-xs uppercase">
                  Группа:
                </ThemedText>
                <ThemedText variant="body" className="mb-4 text-base">
                  {ticket?.group || 'Нет данных'}
                </ThemedText>

                <ThemedText variant="label" className="text-xs uppercase">
                  Курс:
                </ThemedText>
                <ThemedText variant="body" className="mb-4 text-base">
                  {ticket?.cource || 'Нет данных'}
                </ThemedText>

                <ThemedText variant="label" className="text-xs uppercase">
                  Год обучения, окуган жылы:
                </ThemedText>
                <ThemedText variant="body" className="text-base">
                  {ticket?.year_study || 'Нет данных'}
                </ThemedText>
              </View>
            </View>

            {/* Student Code */}
            <View
              className={`rounded-xl p-4 ${
                isDark ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}
            >
              <ThemedText variant="label" className="mb-2 text-xs uppercase">
                Номер студенческого билета:
              </ThemedText>
              <ThemedText
                variant="body"
                className="text-lg font-bold"
                style={{ color: isDark ? '#60A5FA' : '#2563EB' }}
              >
                {ticket?.code_stud || 'Нет данных'}
              </ThemedText>
            </View>

            {error && (
              <ThemedText variant="muted" className="mt-4 text-xs text-red-400">
                {error}
              </ThemedText>
            )}
          </ThemedCard>
        </View>
      </AppScrollView>

      <QrCodeModal visible={qrVisible} onClose={() => setQrVisible(false)} />
    </ScreenContainer>
  );
};

