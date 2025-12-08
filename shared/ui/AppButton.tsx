import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { ThemedText } from './ThemedText';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export const AppButton = ({
  title,
  loading,
  disabled,
  variant = 'primary',
  ...rest
}: AppButtonProps) => {
  const isDisabled = disabled || loading;
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClasses = 'w-full items-center justify-center rounded-xl py-3';

  const variantClasses =
    variant === 'primary'
      ? isDark
        ? 'bg-primaryDark'
        : 'bg-primary'
      : isDark
        ? 'border border-gray-600 bg-transparent'
        : 'border border-gray-300 bg-transparent';

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses} ${isDisabled ? 'opacity-60' : ''}`}
      activeOpacity={0.8}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : isDark ? '#E5E7EB' : '#111827'} />
      ) : (
        <ThemedText
          variant="body"
          className={`text-base font-semibold ${
            variant === 'primary' ? 'text-white' : ''
          }`}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

