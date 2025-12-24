import { Alert, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { useAuthStore } from '../../entities/session/model/authStore';
import { AppButton } from '../../shared/ui/AppButton';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';
import { useProfileEdit } from './hooks/useProfileEdit';
import { useAvatarUpload } from './hooks/useAvatarUpload';
import { EditableField } from './components/EditableField';
import { AvatarEditor } from './components/AvatarEditor';

export const ProfileScreen = () => {
  const { user, logout, storedAvatarUrl } = useAuthStore();
  const { ticket } = useStudentTicketStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const {
    isEditing,
    isSaving,
    formData,
    startEditing,
    cancelEditing,
    updateField,
    saveProfile,
  } = useProfileEdit();

  const { isUploading, showImagePickerOptions } = useAvatarUpload();

  const fullName = user?.surname && user?.firstName && user?.lastName
    ? `${user.surname} ${user.firstName} ${user.lastName}`
    : user?.name || '—';

  const avatarUrl = getUserAvatarSync(user?.avatarUrl, ticket?.photo, storedAvatarUrl);

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
            <AvatarEditor
              avatarUrl={avatarUrl}
              onPress={showImagePickerOptions}
              isUploading={isUploading}
            />

            <ThemedText variant="title" className="mt-4 text-xl font-sans">
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
            <View className="mb-4 flex-row items-center justify-between">
              <ThemedText variant="title" className="text-lg font-semibold">
                Личная информация
              </ThemedText>
              {!isEditing ? (
                <Pressable
                  onPress={startEditing}
                  className="active:opacity-70"
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={isDark ? '#60A5FA' : '#2563EB'}
                  />
                </Pressable>
              ) : (
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={cancelEditing}
                    disabled={isSaving}
                    className="active:opacity-70"
                  >
                    <Ionicons
                      name="close-outline"
                      size={20}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </Pressable>
                  <Pressable
                    onPress={saveProfile}
                    disabled={isSaving}
                    className="active:opacity-70"
                  >
                    <Ionicons
                      name="checkmark-outline"
                      size={20}
                      color={isDark ? '#10B981' : '#059669'}
                    />
                  </Pressable>
                </View>
              )}
            </View>

            <EditableField
              icon="person-outline"
              label="Имя"
              value={formData.firstName}
              isEditing={isEditing}
              onChange={(value) => updateField('firstName', value)}
              placeholder="Введите имя"
            />

            <EditableField
              icon="person-outline"
              label="Фамилия"
              value={formData.lastName}
              isEditing={isEditing}
              onChange={(value) => updateField('lastName', value)}
              placeholder="Введите фамилию"
            />

            <EditableField
              icon="person-outline"
              label="Отчество"
              value={formData.surname}
              isEditing={isEditing}
              onChange={(value) => updateField('surname', value)}
              placeholder="Введите отчество"
            />

            <EditableField
              icon="mail-outline"
              label="Email"
              value={formData.email}
              isEditing={isEditing}
              onChange={(value) => updateField('email', value)}
              placeholder="Введите email"
              keyboardType="email-address"
            />

            <EditableField
              icon="call-outline"
              label="Телефон"
              value={formData.phone}
              isEditing={isEditing}
              onChange={(value) => updateField('phone', value)}
              placeholder="Введите телефон"
              keyboardType="phone-pad"
            />

            <EditableField
              icon="calendar-outline"
              label="Дата рождения"
              value={formData.birthDate}
              isEditing={isEditing}
              onChange={(value) => updateField('birthDate', value)}
              placeholder="ДД.ММ.ГГГГ"
            />

            {ticket?.code_stud && (
              <View className="mb-4">
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

            {isEditing && (
              <View className="mt-4 flex-row gap-3">
                <View className="flex-1">
                  <AppButton
                    title="Отмена"
                    onPress={cancelEditing}
                    variant="outline"
                    disabled={isSaving}
                  />
                </View>
                <View className="flex-1">
                  <AppButton
                    title={isSaving ? 'Сохранение...' : 'Сохранить'}
                    onPress={saveProfile}
                    loading={isSaving}
                    disabled={isSaving}
                  />
                </View>
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
