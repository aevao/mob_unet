import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import type { AuthStackParamList } from './types';
import { LoginScreen } from '../../pages/auth/LoginScreen';
import { PinScreen } from '../../pages/auth/PinScreen';
import { useAuthStore } from '../../entities/session/model/authStore';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  const { refreshToken, hasPinCode, accessToken } = useAuthStore();

  // Определяем начальный экран:
  // 1. Если есть refreshToken, но нет accessToken - нужно разблокировать доступ (биометрия/PIN)
  // 2. Иначе показываем Login
  const initialRouteName = 
    refreshToken && !accessToken 
      ? 'Pin' 
      : 'Login';

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pin"
        component={PinScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


