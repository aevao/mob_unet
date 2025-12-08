import { Text, TextProps } from 'react-native';
import { useThemeStore } from '../../entities/theme/model/themeStore';

type Variant = 'title' | 'subtitle' | 'body' | 'muted' | 'label';

interface ThemedTextProps extends TextProps {
  variant?: Variant;
}

const variantClasses: Record<Variant, { light: string; dark: string }> = {
  title: {
    light: 'text-gray-900',
    dark: 'text-white',
  },
  subtitle: {
    light: 'text-gray-600',
    dark: 'text-gray-300',
  },
  body: {
    light: 'text-gray-800',
    dark: 'text-gray-100',
  },
  muted: {
    light: 'text-gray-500',
    dark: 'text-gray-400',
  },
  label: {
    light: 'text-gray-500',
    dark: 'text-gray-300',
  },
};

export const ThemedText = ({ variant = 'body', className, style, ...rest }: ThemedTextProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const palette = variantClasses[variant];
  const colorClass = isDark ? palette.dark : palette.light;

  return <Text className={`${colorClass} ${className ?? ''}`} style={style} {...rest} />;
};


