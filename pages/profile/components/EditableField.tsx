import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { AppInput } from '../../../shared/ui/AppInput';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

interface EditableFieldProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
}

export const EditableField = ({
  icon,
  label,
  value,
  isEditing,
  onChange,
  placeholder,
  keyboardType = 'default',
}: EditableFieldProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View className="mb-4">
      {isEditing ? (
        <AppInput
          label={label}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || label}
          keyboardType={keyboardType}
        />
      ) : (
        <>
          <View className="mb-1 flex-row items-center gap-2">
            <Ionicons
              name={icon}
              size={18}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="label" className="text-sm">
              {label}
            </ThemedText>
          </View>
          <ThemedText variant="body" className="mt-1 text-base font-medium">
            {value || '—'}
          </ThemedText>
        </>
      )}
    </View>
  );
};

