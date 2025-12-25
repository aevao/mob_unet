import { useState } from 'react';
import { View, Pressable, Platform, Modal } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { AppInput } from '../../../shared/ui/AppInput';
import { useThemeStore } from '../../../entities/theme/model/themeStore';
import { formatBirthDate } from '../../../shared/lib/validation';

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  error?: string;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  isEditing,
  error,
}: DatePickerFieldProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [showPicker, setShowPicker] = useState(false);
  
  const [tempDate, setTempDate] = useState<Date>(() => {
    if (value) {
      // Парсим дату из формата ДД.ММ.ГГГГ
      const parts = value.split('.');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return new Date(2000, 0, 1);
  });

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setTempDate(date);
      // На iOS не применяем сразу, ждем подтверждения
      if (Platform.OS === 'android') {
        setShowPicker(false);
        const formatted = formatBirthDate(date.toISOString());
        onChange(formatted);
      }
    }
  };

  const handleDateConfirm = () => {
    const formatted = formatBirthDate(tempDate.toISOString());
    onChange(formatted);
    setShowPicker(false);
  };

  const handleDateCancel = () => {
    setShowPicker(false);
    // Восстанавливаем исходную дату
    if (value) {
      const parts = value.split('.');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        setTempDate(new Date(year, month, day));
      }
    }
  };

  const displayValue = value || '—';

  if (isEditing) {
    return (
      <View>
        <Pressable className='px-4' onPress={() => setShowPicker(true)}>
          <AppInput
            label={label}
            value={value}
            placeholder="ДД.ММ.ГГГГ"
            editable={false}
            error={error}
            onPressIn={() => setShowPicker(true)}
          />
        </Pressable>
        
        {showPicker && (
          <>
            {Platform.OS === 'ios' ? (
              <Modal
                transparent
                visible={showPicker}
                onRequestClose={handleDateCancel}
                animationType="slide"
              >
                <Pressable
                  className="flex-1 justify-end bg-black/50"
                  onPress={handleDateCancel}
                >
                  <View
                    onStartShouldSetResponder={() => true}
                    className={`w-full rounded-t-3xl p-4 ${
                      isDark ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    <View className="mb-4 flex-row items-center justify-between">
                      <Pressable onPress={handleDateCancel}>
                        <ThemedText
                          variant="body"
                          className={`text-base ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          Отмена
                        </ThemedText>
                      </Pressable>
                      <ThemedText variant="title" className="text-base font-semibold">
                        Выберите дату
                      </ThemedText>
                      <Pressable onPress={handleDateConfirm}>
                        <ThemedText
                          variant="body"
                          className={`text-base font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          Выбрать
                        </ThemedText>
                      </Pressable>
                    </View>
                    <View
                      style={{
                        backgroundColor: isDark ? '#111827' : '#FFFFFF',
                      }}
                    >
                      <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                        locale="ru_RU"
                        themeVariant={isDark ? 'dark' : 'light'}
                        textColor={isDark ? '#F3F4F6' : '#111827'}
                        style={{
                          backgroundColor: isDark ? '#111827' : '#FFFFFF',
                        }}
                      />
                    </View>
                  </View>
                </Pressable>
              </Modal>
            ) : (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </>
        )}
      </View>
    );
  }

  return (
    <Pressable className="active:opacity-70">
      <View className="flex-row items-center px-4 py-4">
        <View
          className={`mr-4 h-12 w-12 items-center justify-center rounded-xl ${
            isDark ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color={isDark ? '#60A5FA' : '#2563EB'}
          />
        </View>
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
            {displayValue}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
};
