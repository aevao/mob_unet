import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useAuthStore } from '../../entities/session/model/authStore';
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export const EmployeeCardScreen = () => {
  const { user, storedAvatarUrl } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const fullName =
    user?.surname && user?.firstName && user?.lastName
      ? `${user.surname} ${user.firstName} ${user.lastName}`
      : user?.name || 'Нет данных';

  const avatarUrl = getUserAvatarSync(user?.avatarUrl, null, storedAvatarUrl);

  // Пытаемся получить division и position из raw данных
  const rawData = user?.raw as any;
  const division = rawData?.division || null;
  const position = rawData?.position || null;
  const email = user?.email || null;
  const phone = user?.phone || null;

  return (
    <ScreenContainer>
      <AppScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <ThemedCard className="p-6">
            {/* Header */}
            <View className="mb-6 flex-row items-center">
              <View
                className={`h-12 w-12 items-center justify-center rounded-xl ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={24}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <ThemedText variant="title" className="ml-3 text-xl font-bold">
                Карточка сотрудника
              </ThemedText>
            </View>

            {/* University Name */}
            <ThemedText variant="muted" className="mb-6 text-center text-sm">
              Кыргызский государственный технический университет им. И. Раззакова
            </ThemedText>

            {/* Employee Info */}
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
                  ФИО:
                </ThemedText>
                <ThemedText variant="body" className="mb-4 text-base font-semibold">
                  {fullName}
                </ThemedText>

                {division && (
                  <>
                    <ThemedText variant="label" className="text-xs uppercase">
                      Подразделение:
                    </ThemedText>
                    <ThemedText variant="body" className="mb-4 text-base">
                      {division}
                    </ThemedText>
                  </>
                )}

                {position && (
                  <>
                    <ThemedText variant="label" className="text-xs uppercase">
                      Должность:
                    </ThemedText>
                    <ThemedText variant="body" className="mb-4 text-base">
                      {position}
                    </ThemedText>
                  </>
                )}

                {email && (
                  <>
                    <ThemedText variant="label" className="text-xs uppercase">
                      Email:
                    </ThemedText>
                    <ThemedText variant="body" className="mb-4 text-base">
                      {email}
                    </ThemedText>
                  </>
                )}

                {phone && (
                  <>
                    <ThemedText variant="label" className="text-xs uppercase">
                      Телефон:
                    </ThemedText>
                    <ThemedText variant="body" className="text-base">
                      {phone}
                    </ThemedText>
                  </>
                )}
              </View>
            </View>

            {/* Additional Info Card */}
            {(division || position) && (
              <View
                className={`rounded-xl p-4 ${
                  isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                }`}
              >
                <ThemedText variant="label" className="mb-2 text-xs uppercase">
                  Дополнительная информация
                </ThemedText>
                {division && (
                  <ThemedText variant="body" className="text-sm">
                    Подразделение: {division}
                  </ThemedText>
                )}
                {position && (
                  <ThemedText variant="body" className="mt-1 text-sm">
                    Должность: {position}
                  </ThemedText>
                )}
              </View>
            )}
          </ThemedCard>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

