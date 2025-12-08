import { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  withTabBar?: boolean;
  withPadding?: boolean;
}

export const AppScrollView = ({
  children,
  contentContainerStyle,
  withTabBar = true,
  withPadding = true,
  ...rest
}: AppScrollViewProps) => {
  const insets = useSafeAreaInsets();

  // Высота таб бара обычно около 60-80px, добавляем небольшой отступ
  const tabBarHeight = withTabBar ? 80 : 0;
  const bottomPadding = tabBarHeight + (insets.bottom || 0) + 16;

  const defaultStyles = withPadding
    ? {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: bottomPadding,
      }
    : {
        paddingBottom: bottomPadding,
      };

  return (
    <ScrollView
      {...rest}
      contentContainerStyle={[defaultStyles, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
};

