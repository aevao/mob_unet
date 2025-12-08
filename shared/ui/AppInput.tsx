import { forwardRef } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { ThemedText } from './ThemedText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ label, error, className, ...rest }, ref) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const baseClasses =
      'w-full rounded-lg border px-3 py-2 text-base ' +
      (isDark ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-300 bg-white text-gray-900');

    const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';

    return (
      <View className="mb-3 w-full">
        {label ? (
          <ThemedText variant="label" className="mb-1 text-sm font-medium">
            {label}
          </ThemedText>
        ) : null}
        <TextInput
          ref={ref}
          className={`${baseClasses} ${error ? 'border-red-500' : ''} ${className ?? ''}`}
          placeholderTextColor={placeholderColor}
          {...rest}
        />
        {error ? <ThemedText className="mt-1 text-xs text-red-500">{error}</ThemedText> : null}
      </View>
    );
  },
);

AppInput.displayName = 'AppInput';


