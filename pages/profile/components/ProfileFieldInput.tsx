import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { AppInput } from '../../../shared/ui/AppInput';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

interface ProfileFieldInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  error?: string;
  editable?: boolean;
}

export const ProfileFieldInput = ({
  icon,
  label,
  value,
  onChange,
  isEditing,
  placeholder,
  keyboardType = 'default',
  error,
  editable = true,
}: ProfileFieldInputProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (isEditing && editable) {
    return (
      <View className="px-4 py-2">
        <AppInput
          label={label}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || label}
          keyboardType={keyboardType}
          error={error}
        />
      </View>
    );
  }

  return (
    <Pressable className="active:opacity-70">
      <View className="flex-row items-center px-4 py-4">
        {/* Иконка в цветном контейнере */}
        <View
          className={`mr-4 h-12 w-12 items-center justify-center rounded-xl ${
            isDark ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}
        >
          <Ionicons
            name={icon}
            size={22}
            color={isDark ? '#60A5FA' : '#2563EB'}
          />
        </View>

        {/* Контент */}
        <View className="flex-1">
          <ThemedText
            variant="body"
            className="text-sm font-medium"
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          >
            {label}
          </ThemedText>
          <ThemedText
            variant="body"
            className="mt-1 text-base font-semibold"
            style={{ color: isDark ? '#E5E7EB' : '#111827' }}
          >
            {value || '—'}
          </ThemedText>
        </View>

      </View>
    </Pressable>
  );
};
