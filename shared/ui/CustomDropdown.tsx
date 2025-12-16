import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { ThemedText } from './ThemedText';

export interface CustomDropdownProps {
  items: ItemType<string>[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  zIndex?: number;
  error?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
}

export const CustomDropdown = ({
  items,
  value,
  onChange,
  placeholder = 'Выберите значение',
  zIndex = 1000,
  error = false,
  searchable = false,
  searchPlaceholder = 'Поиск...',
  loading = false,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [localItems, setLocalItems] = useState(items);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Обновляем items при изменении пропса
  useEffect(() => {
    if (items.length > 0 || !loading) {
      setLocalItems(items);
    }
  }, [items, loading]);

  return (
    <View>
      <DropDownPicker
      open={open}
      value={value}
      items={localItems}
      setOpen={setOpen}
      setValue={(callback) => {
        const selected = callback(value);
        if (typeof selected === 'string') {
          onChange(selected);
        }
      }}
      setItems={setLocalItems}
      placeholder={placeholder}
      zIndex={zIndex}
      zIndexInverse={3000}
      listMode="MODAL"
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      searchTextInputStyle={{
        borderColor: isDark ? '#4B5563' : '#D1D5DB',
        borderRadius: 8,
        backgroundColor: isDark ? '#374151' : '#F9FAFB',
        color: isDark ? '#F3F4F6' : '#111827',
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
      }}
      searchContainerStyle={{
        borderBottomColor: isDark ? '#374151' : '#E5E7EB',
        borderBottomWidth: 1,
        paddingBottom: 12,
        marginBottom: 8,
      }}
      style={{
        borderColor: error ? '#EF4444' : isDark ? '#4B5563' : '#D1D5DB',
        borderRadius: 12,
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        minHeight: 50,
        borderWidth: error ? 2 : 1,
        paddingHorizontal: 16,
      }}
      textStyle={{
        color: isDark ? '#F3F4F6' : '#111827',
        fontSize: 15,
        fontWeight: '500',
      }}
      placeholderStyle={{
        color: isDark ? '#9CA3AF' : '#6B7280',
        fontSize: 15,
      }}
      labelStyle={{
        color: isDark ? '#F3F4F6' : '#111827',
        fontSize: 15,
      }}
      modalProps={{
        animationType: 'fade',
      }}
      modalContentContainerStyle={{
        padding: 20,
        backgroundColor: isDark ? '#111827' : '#FFFFFF',
        borderRadius: 16,
      }}
      modalTitle="Выберите значение"
      modalTitleStyle={{
        color: isDark ? '#F3F4F6' : '#111827',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
      }}
      dropDownContainerStyle={{
        borderColor: isDark ? '#4B5563' : '#D1D5DB',
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
      }}
      selectedItemLabelStyle={{
        color: isDark ? '#60A5FA' : '#2563EB',
        fontWeight: '600',
      }}
      selectedItemContainerStyle={{
        backgroundColor: isDark ? '#1E3A8A' : '#DBEAFE',
        borderRadius: 8,
        marginVertical: 2,
      }}
      itemSeparator
      itemSeparatorStyle={{
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
        height: 1,
      }}
      listItemContainerStyle={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 2,
      }}
      listItemLabelStyle={{
        color: isDark ? '#E5E7EB' : '#374151',
        fontSize: 15,
      }}
      arrowIconStyle={{
        tintColor: isDark ? '#9CA3AF' : '#6B7280',
        width: 20,
        height: 20,
      }}
      tickIconStyle={{
        tintColor: isDark ? '#60A5FA' : '#2563EB',
        width: 20,
        height: 20,
      }}
      closeIconStyle={{
        tintColor: isDark ? '#9CA3AF' : '#6B7280',
        width: 24,
        height: 24,
      }}
      badgeStyle={{
        backgroundColor: isDark ? '#2563EB' : '#2563EB',
      }}
      badgeTextStyle={{
        color: '#FFFFFF',
        fontSize: 12,
      }}
      loading={loading}
      activityIndicatorColor={isDark ? '#60A5FA' : '#2563EB'}
      emptyText="Нет данных"
      emptyTextStyle={{
        color: isDark ? '#9CA3AF' : '#6B7280',
        fontSize: 14,
      }}
      ListEmptyComponent={() =>
        loading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
            <ThemedText variant="muted" className="mt-4 text-sm">
              Загрузка...
            </ThemedText>
          </View>
        ) : (
          <View className="py-8 items-center">
            <ThemedText variant="muted" className="text-sm">
              Нет данных
            </ThemedText>
          </View>
        )
      }
    />
    </View>
  );
};

