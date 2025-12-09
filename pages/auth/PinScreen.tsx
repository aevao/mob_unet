import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { useNavigation } from '@react-navigation/native';

type PinMode = 'create' | 'confirm' | 'enter';

export const PinScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { 
    hasPinCode, 
    setPinCode, 
    verifyPinCode, 
    refreshAccessToken, 
    setBiometricEnabled, 
    isBiometricEnabled,
    accessToken,
    refreshToken,
  } = useAuthStore();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [mode, setMode] = useState<PinMode>(hasPinCode ? 'enter' : 'create');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[]>([]);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Обновляем mode при изменении hasPinCode
  useEffect(() => {
    setMode(hasPinCode ? 'enter' : 'create');
  }, [hasPinCode]);

  useEffect(() => {
    // Автоматически предлагаем биометрию при входе, если она включена
    if (hasPinCode && isBiometricEnabled && biometricAvailable && mode === 'enter' && refreshToken) {
      const timer = setTimeout(() => {
        handleBiometricAuth();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPinCode, isBiometricEnabled, biometricAvailable, mode, refreshToken]);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setBiometricAvailable(true);
      setBiometricType(types);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Подтвердите вход',
        cancelLabel: 'Отмена',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await handleSuccessfulAuth();
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
    }
  };

  const handleSuccessfulAuth = async () => {
    // После успешной биометрии/PIN - делаем refresh токена
    // Биометрия/PIN разблокировали доступ к refreshToken, теперь обновляем accessToken
    if (refreshToken) {
      const success = await refreshAccessToken();
      if (!success) {
        Alert.alert('Ошибка', 'Не удалось обновить токен. Пожалуйста, войдите заново.');
        navigation.navigate('Login' as never);
      }
      // Если успешно, навигация произойдет автоматически через AppNavigator
    } else {
      Alert.alert('Ошибка', 'Нет токенов для входа. Пожалуйста, войдите заново.');
      navigation.navigate('Login' as never);
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === 4) {
        if (mode === 'create') {
          // Сохраняем первый PIN и переходим к подтверждению
          setConfirmPin(newPin);
          setPin('');
          setMode('confirm');
        } else if (mode === 'confirm') {
          // Сравниваем второй PIN с первым
          if (newPin === confirmPin) {
            handlePinCreated(newPin);
          } else {
            Alert.alert('Ошибка', 'PIN-коды не совпадают. Попробуйте снова.');
            setPin('');
            setConfirmPin('');
            setMode('create');
          }
        } else if (mode === 'enter') {
          handlePinEnter(newPin);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handlePinCreated = async (newPin: string) => {
    await setPinCode(newPin);
    setPin('');
    setConfirmPin('');

    // После создания PIN сразу используем его для разблокировки доступа к токену
    // Предлагаем включить биометрию (опционально)
    if (biometricAvailable) {
      Alert.alert(
        'Биометрическая аутентификация',
        'Хотите включить вход по отпечатку пальца или Face ID?',
        [
          {
            text: 'Нет',
            style: 'cancel',
            onPress: () => {
              handleSuccessfulAuth();
            },
          },
          {
            text: 'Да',
            onPress: async () => {
              await setBiometricEnabled(true);
              handleSuccessfulAuth();
            },
          },
        ],
      );
    } else {
      handleSuccessfulAuth();
    }
  };

  const handlePinEnter = async (enteredPin: string) => {
    const isValid = await verifyPinCode(enteredPin);
    if (isValid) {
      await handleSuccessfulAuth();
    } else {
      Alert.alert('Ошибка', 'Неверный PIN-код');
      setPin('');
    }
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          className={`h-4 w-4 rounded-full ${
            i < pin.length
              ? isDark
                ? 'bg-blue-500'
                : 'bg-blue-600'
              : isDark
                ? 'bg-gray-700'
                : 'bg-gray-300'
          }`}
        />,
      );
    }
    return dots;
  };

  const getBiometricIcon = () => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'face-recognition-outline';
    }
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'finger-print-outline';
    }
    return 'lock-closed-outline';
  };

  const getBiometricLabel = () => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Отпечаток';
    }
    return 'Биометрия';
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedCard className="w-full p-6">
            <View className="mb-8 items-center">
              <View
                className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
              >
                <Ionicons
                  name="lock-closed"
                  size={32}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <ThemedText variant="title" className="mb-2 text-2xl font-bold">
                {mode === 'create'
                  ? 'Создайте PIN-код'
                  : mode === 'confirm'
                    ? 'Подтвердите PIN-код'
                    : 'Разблокировать доступ'}
              </ThemedText>
              <ThemedText variant="muted" className="text-center text-sm">
                {mode === 'create' || mode === 'confirm'
                  ? 'PIN-код защитит доступ к вашему аккаунту'
                  : 'Введите PIN-код для доступа к приложению'}
              </ThemedText>
            </View>

            {/* PIN Dots */}
            <View className="mb-8 flex-row justify-center gap-3">
              {renderPinDots()}
            </View>

            {/* Biometric Button */}
            {mode === 'enter' && biometricAvailable && (
              <TouchableOpacity
                onPress={handleBiometricAuth}
                className={`mb-6 flex-row items-center justify-center rounded-xl border-2 py-4 ${
                  isDark
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-blue-600 bg-blue-50'
                }`}
              >
                <Ionicons
                  name={getBiometricIcon()}
                  size={24}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
                <ThemedText
                  variant="title"
                  className={`ml-2 text-base font-semibold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  {getBiometricLabel()}
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Number Pad */}
            <View className="gap-3">
              {[
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['', '0', 'delete'],
              ].map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row justify-center gap-3">
                  {row.map((item, colIndex) => {
                    if (item === '') {
                      return <View key={`${rowIndex}-${colIndex}`} className="h-16 w-20" />;
                    }
                    if (item === 'delete') {
                      return (
                        <TouchableOpacity
                          key={`${rowIndex}-${colIndex}`}
                          onPress={handlePinDelete}
                          className={`h-16 w-20 items-center justify-center rounded-xl ${
                            isDark ? 'bg-gray-800' : 'bg-gray-100'
                          }`}
                        >
                          <Ionicons
                            name="backspace-outline"
                            size={24}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                          />
                        </TouchableOpacity>
                      );
                    }
                    return (
                      <TouchableOpacity
                        key={`${rowIndex}-${colIndex}`}
                        onPress={() => handlePinInput(item)}
                        className={`h-16 w-20 items-center justify-center rounded-xl ${
                          isDark ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <ThemedText variant="title" className="text-2xl font-semibold">
                          {item}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Back to Login */}
            {mode === 'enter' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login' as never)}
                className="mt-6"
              >
                <ThemedText variant="subtitle" className="text-center text-sm">
                  Войти с логином и паролем
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

