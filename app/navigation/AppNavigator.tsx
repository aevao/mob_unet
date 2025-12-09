import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../../entities/session/model/authStore';
import { Loader } from '../../shared/ui/Loader';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isInitialized, accessToken, refreshToken, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <Loader />;
  }

  const isAuthenticated = !!accessToken;
  // Если есть refreshToken, но нет accessToken - нужно разблокировать доступ через биометрию/PIN
  const needsUnlock = !!refreshToken && !accessToken;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated && !needsUnlock ? (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};


