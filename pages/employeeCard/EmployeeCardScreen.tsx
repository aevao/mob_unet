import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useAuthStore } from '../../entities/session/model/authStore';
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';
import { QrCodeModal } from '../../widgets/home/QrCodeModal';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { KstuLogo } from '../../shared/ui/KstuLogo';
export const EmployeeCardScreen = () => {
  const { user, storedAvatarUrl } = useAuthStore();
  const { theme } = useThemeStore();
  const [qrVisible, setQrVisible] = useState(false);
  const isDark = theme === 'dark';

  const fullName =
    user?.surname && user?.firstName && user?.lastName
      ? `${user.surname} ${user.firstName} ${user.lastName}`
      : user?.name || 'Нет данных';

  const avatarUrl = getUserAvatarSync(user?.avatarUrl, null, storedAvatarUrl);

  // Извлекаем данные из raw
  const rawData = user?.raw as any;
  const division = rawData?.division || null;
  const position = rawData?.position || null;
  const employeeId = user?.id || '—';
  const email = user?.email || null;
  const phone = user?.phone || null;
  const birthDate = user?.birthDate || null;
  const gender = user?.gender || null;

  return (
    <ScreenContainer>
      <AppScrollView showsVerticalScrollIndicator={false}>
        
          <ThemedCard className="relative overflow-hidden p-6 ">
            {/* Логотип по центру с opacity и зеркальным отражением */}
            <View
              className="absolute h-full w-96 inset-0 items-center justify-center mt-20"
              style={{ opacity: 0.3 }}
            >
              <View >
                <KstuLogo size={150} />
              </View>
            </View>

            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center">
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
              
            </View>

 

            {/* Employee Info */}
            <View className="mb-6 flex-row">
              <OptimizedImage
                uri={avatarUrl}
                style={{ width: 100, height: 120, borderRadius: 12 }}
                className="rounded-xl "
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

           

            

            
          </ThemedCard>
 
      </AppScrollView>

      <QrCodeModal visible={qrVisible} onClose={() => setQrVisible(false)} />
    </ScreenContainer>
  );
};
