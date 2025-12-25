import { useMemo } from 'react';
import { Alert, View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { useAuthStore } from '../../entities/session/model/authStore';
import { AppButton } from '../../shared/ui/AppButton';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';
import { useProfileEdit } from './hooks/useProfileEdit';
import { useAvatarUpload } from './hooks/useAvatarUpload';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileFooter } from './components/ProfileFooter';
import { ProfileSkeleton } from './components/ProfileSkeleton';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ProfileFieldInput } from './components/ProfileFieldInput';
import { PhoneInput } from './components/PhoneInput';
import { DatePickerField } from './components/DatePickerField';
import { getPrimaryFields, getSecondaryFields, getUserFullName, getUserRoleLabel } from './utils/getProfileFields';

export const ProfileScreen = () => {
  const { user, logout, storedAvatarUrl, isInitialized } = useAuthStore();
  const { ticket } = useStudentTicketStore();

  const {
    isEditing,
    isSaving,
    formData,
    errors,
    startEditing,
    cancelEditing,
    updateField,
    saveProfile,
    saveAvatar,
  } = useProfileEdit();

  const { isUploading, showImagePickerOptions } = useAvatarUpload({
    onUpload: saveAvatar,
  });

  // Показываем skeleton пока данные загружаются
  if (!isInitialized || !user) {
    return (
      <ScreenContainer>
        <AppScrollView showsVerticalScrollIndicator={false}>
          <ProfileSkeleton />
        </AppScrollView>
      </ScreenContainer>
    );
  }

  // Вычисляемые значения
  const fullName = useMemo(() => getUserFullName(user), [user]);
  const avatarUrl = useMemo(
    () => getUserAvatarSync(user?.avatarUrl, ticket?.photo, storedAvatarUrl),
    [user?.avatarUrl, ticket?.photo, storedAvatarUrl],
  );
  const roleLabel = useMemo(() => getUserRoleLabel(user?.role), [user?.role]);

  // Формируем поля профиля
  const primaryFields = useMemo(() => {
    return getPrimaryFields(formData, user, errors, updateField as any);
  }, [formData, user, errors, updateField]);

  const secondaryFields = useMemo(() => {
    return getSecondaryFields(formData, user, ticket, errors, updateField as any);
  }, [formData, user, ticket, errors, updateField]);

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

  const handleEditToggle = () => {
    if (isEditing) {
      cancelEditing();
    } else {
      startEditing();
    }
  };

  const handleAvatarUpload = async () => {
    await showImagePickerOptions();
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header с крупным аватаром */}
        <ProfileHeader
          avatarUrl={avatarUrl}
          fullName={fullName}
          role={user.role}
          roleLabel={roleLabel}
          group={ticket?.group}
          onAvatarPress={handleAvatarUpload}
          onEditPress={handleEditToggle}
          isUploading={isUploading}
          isEditing={isEditing}
        />

        {/* Основные поля */}
        <ThemedCard className="mb-3 overflow-hidden rounded-2xl">
          {primaryFields[0] && (
            <PhoneInput
              label={primaryFields[0].label}
              value={primaryFields[0].value}
              onChange={primaryFields[0].onChange || (() => {})}
              isEditing={isEditing}
              error={primaryFields[0].error}
            />
          )}
          {primaryFields.length > 1 && (
            <>
              <View className="h-px bg-gray-200 dark:bg-gray-800 ml-16" />
              <DatePickerField
                label={primaryFields[1].label}
                value={primaryFields[1].value}
                onChange={primaryFields[1].onChange || (() => {})}
                isEditing={isEditing}
                error={primaryFields[1].error}
              />
            </>
          )}
        </ThemedCard>

        {/* Личная информация */}
        {secondaryFields.length > 0 && (
          <ThemedCard className="mb-4 overflow-hidden rounded-2xl">
            {secondaryFields.map((item, index) => (
              <View key={`${item.icon}-${index}`}>
                {index > 0 && (
                  <View className="h-px bg-gray-200 dark:bg-gray-800 ml-16" />
                )}
                <ProfileFieldInput
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  onChange={item.onChange || (() => {})}
                  isEditing={isEditing}
                  placeholder={item.placeholder}
                  keyboardType={item.keyboardType}
                  error={item.error}
                  editable={item.editable}
                />
              </View>
            ))}
          </ThemedCard>
        )}

        {/* Кнопки сохранения (только в режиме редактирования) */}
        {isEditing && (
          <View className="mb-4 flex-row gap-3">
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

        {/* Footer с именем и кнопкой выхода */}
        <ProfileFooter fullName={fullName} onLogout={handleLogout} />
      </AppScrollView>
    </ScreenContainer>
  );
};
