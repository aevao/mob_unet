import { Alert, Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { useAuthStore } from '../../entities/session/model/authStore';
import { AppButton } from '../../shared/ui/AppButton';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const { ticket } = useStudentTicketStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const fullName = user?.surname && user?.firstName && user?.lastName
    ? `${user.surname} ${user.firstName} ${user.lastName}`
    : user?.name || '—';

  const avatarUrl = ticket?.photo || user?.avatarUrl || null;

  const roleLabel =
    user?.role === 'teacher'
      ? 'Преподаватель'
      : user?.role === 'student'
        ? 'Студент'
        : user?.role === 'employee'
          ? 'Сотрудник'
          : '—';

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти из аккаунта?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Аватар и основная информация */}
          <ThemedCard className="items-center p-6">
            <View
              className={`h-24 w-24 overflow-hidden rounded-full border-4 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <View
                  className={`h-full w-full items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}
                >
                  <Ionicons
                    name="person"
                    size={40}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
              )}
            </View>

            <ThemedText variant="title" className="mt-4 text-xl font-bold">
              {fullName}
            </ThemedText>

            <View className="mt-2 flex-row items-center gap-1">
              <Ionicons
                name="school-outline"
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <ThemedText variant="muted" className="text-sm">
                {roleLabel}
              </ThemedText>
            </View>

            {ticket?.group && (
              <View className="mt-2 flex-row items-center gap-1">
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="muted" className="text-sm">
                  {ticket.group}
                </ThemedText>
              </View>
            )}
          </ThemedCard>

          {/* Личная информация */}
          <ThemedCard className="mt-4 p-4">
            <ThemedText variant="title" className="mb-4 text-lg font-semibold">
              Личная информация
            </ThemedText>

            <View className="mb-4">
              <View className="mb-1 flex-row items-center gap-2">
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="label" className="text-sm">
                  Полное имя
                </ThemedText>
              </View>
              <ThemedText variant="body" className="mt-1 text-base font-medium">
                {fullName}
              </ThemedText>
            </View>

            {user?.email && (
              <View className="mb-4">
                <View className="mb-1 flex-row items-center gap-2">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText variant="label" className="text-sm">
                    Email
                  </ThemedText>
                </View>
                <ThemedText variant="body" className="mt-1 text-base font-medium">
                  {user.email}
                </ThemedText>
              </View>
            )}

            {user?.phone && (
              <View className="mb-4">
                <View className="mb-1 flex-row items-center gap-2">
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText variant="label" className="text-sm">
                    Телефон
                  </ThemedText>
                </View>
                <ThemedText variant="body" className="mt-1 text-base font-medium">
                  {user.phone}
                </ThemedText>
              </View>
            )}

            {user?.birthDate && (
              <View className="mb-4">
                <View className="mb-1 flex-row items-center gap-2">
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText variant="label" className="text-sm">
                    Дата рождения
                  </ThemedText>
                </View>
                <ThemedText variant="body" className="mt-1 text-base font-medium">
                  {user.birthDate}
                </ThemedText>
              </View>
            )}

            {ticket?.code_stud && (
              <View>
                <View className="mb-1 flex-row items-center gap-2">
                  <Ionicons
                    name="card-outline"
                    size={18}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText variant="label" className="text-sm">
                    Номер студенческого билета
                  </ThemedText>
                </View>
                <ThemedText variant="body" className="mt-1 text-base font-medium">
                  {ticket.code_stud}
                </ThemedText>
              </View>
            )}
          </ThemedCard>

          {/* Кнопка выхода */}
          <View className="mt-6 mb-4">
            <Pressable
              onPress={handleLogout}
              className={`flex-row items-center justify-center rounded-xl border p-4 ${
                isDark
                  ? 'border-red-900/50 bg-red-950/30'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <ThemedText variant="body" className="ml-2 text-base font-semibold text-red-500">
                Выйти из аккаунта
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

