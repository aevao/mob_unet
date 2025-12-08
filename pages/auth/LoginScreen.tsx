import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppInput } from '../../shared/ui/AppInput';
import { AppButton } from '../../shared/ui/AppButton';
import { useAuthStore } from '../../entities/session/model/authStore';
import { KstuLogo } from '../../shared/ui/KstuLogo';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login, isLoading } = useAuthStore();

  const validate = () => {
    const nextErrors: { username?: string; password?: string } = {};

    if (!username) {
      nextErrors.username = 'Введите логин';
    }

    if (!password) {
      nextErrors.password = 'Введите пароль';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await login({ username, password });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Не удалось войти. Проверьте данные и попробуйте снова.';
      Alert.alert('Ошибка', message);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 items-center justify-center px-3">
          

          <ThemedCard className="mt-4 w-full p-5">
            <View className="flex-row items-center justify-between ">
            <ThemedText variant="title" className="mb-3 text-2xl font-semibold">
              Вход 
            </ThemedText>
            <KstuLogo size={54} />
            </View>
            <AppInput
              label="ИНН"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
              error={errors.username}
              placeholder="Введите ИНН"
            />

            <View>
              <AppInput
                label="Пароль"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                placeholder="Введите пароль"
                className="pr-10"
              />
              <TouchableOpacity
                className="absolute right-3 top-8 h-6 w-6 items-center justify-center"
                onPress={() => setPasswordVisible((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <View className="mt-3">
              <AppButton title="ВОЙТИ" onPress={handleSubmit} loading={isLoading} />
            </View>

            <TouchableOpacity className="mt-2 self-end">
              <ThemedText variant="subtitle" className="text-xs font-medium">
                Забыли пароль?
              </ThemedText>
            </TouchableOpacity>

            <View className="my-4 flex-row items-center">
              <View className="h-px flex-1 bg-gray-200" />
              <ThemedText variant="muted" className="mx-3 text-xs">
                или
              </ThemedText>
              <View className="h-px flex-1 bg-gray-200" />
            </View>

            <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-gray-300 px-4 py-3">
              <ThemedText variant="body" className="text-center text-sm font-semibold">
                Корпоративная почта Google
              </ThemedText>
            </TouchableOpacity>

            <ThemedText variant="muted" className="mt-2 text-center text-xs leading-4">
              Ваш пароль по умолчанию — ваш ИНН, если вы сотрудник.
              {'\n'}
              Если вы студент — s + ИНН.
            </ThemedText>

            <View className="my-4 h-px bg-gray-200" />

            <ThemedText
              variant="muted"
              className="mb-3 text-center text-xs font-semibold uppercase tracking-wide"
            >
              Дополнительно от UNET
            </ThemedText>

            <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-gray-300 px-4 py-3">
              <ThemedText variant="body" className="text-sm font-medium">
                Руководство пользователя
              </ThemedText>
              <ThemedText variant="muted" className="text-lg">
                ?
              </ThemedText>
            </TouchableOpacity>

            <View className="mt-2 flex-row gap-3">
              <TouchableOpacity className="flex-1 rounded-xl border border-gray-300 px-4 py-3">
                <ThemedText variant="body" className="text-center text-sm font-medium">
                  qr.kstu.kg
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 rounded-xl border border-gray-300 px-4 py-3">
                <ThemedText variant="body" className="text-center text-sm font-medium">
                  перейти в Iq
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedCard>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

