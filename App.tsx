import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './app/navigation/AppNavigator';
import { useThemeStore } from './entities/theme/model/themeStore';

export default function App() {
  const { theme, hydrate, isReady } = useThemeStore();

  useEffect(() => {
    if (!isReady) {
      void hydrate();
    }
  }, [hydrate, isReady]);

  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={statusBarStyle} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
