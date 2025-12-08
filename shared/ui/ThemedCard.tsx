import { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeStore } from '../../entities/theme/model/themeStore';

interface ThemedCardProps extends Omit<ViewProps, 'style'> {
  children: ReactNode;
  className?: string;
}

// Универсальная карточка с автоматическим цветом бордера/фона под тему
export const ThemedCard = ({ children, className, style, ...rest }: ThemedCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClasses = isDark
    ? 'rounded-3xl border border-[#1e293b] bg-[#020617]'
    : 'rounded-3xl border border-[#e2e8f0] bg-white';

  return (
    <View className={`${baseClasses} ${className ?? ''}`} style={style} {...rest}>
      {children}
    </View>
  );
};


