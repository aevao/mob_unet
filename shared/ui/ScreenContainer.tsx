import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../entities/theme/model/themeStore';

interface ScreenContainerProps {
  children: ReactNode;
}

export const ScreenContainer = ({ children }: ScreenContainerProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      className={isDark ? 'flex-1 bg-gray-950' : 'flex-1 bg-background'}
      edges={['left', 'right']}
    >
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};



