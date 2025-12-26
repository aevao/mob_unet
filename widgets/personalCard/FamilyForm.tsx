import { useState, useEffect } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { AppInput } from '../../shared/ui/AppInput';
import { AppButton } from '../../shared/ui/AppButton';
import { CustomDropdown } from '../../shared/ui/CustomDropdown';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { useNavigation } from '@react-navigation/native';
import {
  fetchEmployeeInfo,
  updateFamily,
} from '../../entities/employee/api/employeeInfoApi';
import type { FamilyData, RelativeData } from '../../entities/employee/model/employeeInfoTypes';
import { Platform } from 'react-native';

const MARITAL_STATUSES = [
  { label: 'Холост', value: 'холост' },
  { label: 'Женат/Замужем', value: 'женат' },
  { label: 'Разведен(а)', value: 'разведен' },
  { label: 'Вдовец/Вдова', value: 'вдовец' },
];

const RELATIONSHIPS = [
  { label: 'Супруг(а)', value: 'Супруг(а)' },
  { label: 'Ребенок', value: 'Ребенок' },
  { label: 'Родитель', value: 'Родитель' },
  { label: 'Брат/Сестра', value: 'Брат/Сестра' },
  { label: 'Другое', value: 'Другое' },
];

export const FamilyForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<FamilyData>({
    marital_status: '',
    relatives: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<{
    index: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.family) {
        setFormData({
          marital_status: data.family.marital_status || '',
          relatives: data.family.relatives || [],
        });
      }
    } catch (error) {
      console.error('Failed to load family data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyRelative = (): RelativeData => ({
    name: '',
    surname: '',
    patronymic: '',
    relationship: '',
    born: '',
  });

  const handleAddRelative = () => {
    setFormData({
      ...formData,
      relatives: [...(formData.relatives || []), createEmptyRelative()],
    });
  };

  const handleRemoveRelative = (index: number) => {
    const updated = [...(formData.relatives || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, relatives: updated });
  };

  const handleUpdateRelative = (index: number, field: keyof RelativeData, value: string) => {
    const updated = [...(formData.relatives || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, relatives: updated });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
      if (event.type === 'set' && selectedDate && showDatePicker) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        handleUpdateRelative(showDatePicker.index, 'born', formattedDate);
      }
    } else if (selectedDate && showDatePicker) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleUpdateRelative(showDatePicker.index, 'born', formattedDate);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateFamily(formData);
      Alert.alert('Успешно', 'Данные о семье обновлены', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось обновить данные';
      Alert.alert('Ошибка', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ThemedText>Загрузка...</ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Header */}
          <ThemedCard className="mb-5 p-4">
            <View className="flex-row items-center">
              <View
                className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${
                  isDark ? 'bg-pink-900/20' : 'bg-pink-50'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.1 : 0.08,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={isDark ? '#F472B6' : '#EC4899'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Семейное положение
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Семейный статус и родственники
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          <ThemedCard className="mb-4 p-4">
            <View className="mb-3">
              <ThemedText variant="label" className="mb-2 text-sm font-medium">
                Семейное положение
              </ThemedText>
              <CustomDropdown
                items={MARITAL_STATUSES}
                value={formData.marital_status || null}
                onChange={(value) => setFormData({ ...formData, marital_status: value })}
                placeholder="Выберите семейное положение"
                zIndex={3000}
              />
            </View>
          </ThemedCard>

          <ThemedCard className="mb-4 p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <ThemedText variant="title" className="text-lg font-semibold">
                Родственники
              </ThemedText>
            </View>

            {formData.relatives && formData.relatives.length > 0 ? (
              formData.relatives.map((relative, index) => (
                <View key={index} className="mb-4">
                  <View className="mb-3 flex-row items-center justify-between">
                    <ThemedText variant="label" className="text-base font-medium">
                      Родственник {index + 1}
                    </ThemedText>
                    <Pressable onPress={() => handleRemoveRelative(index)}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </Pressable>
                  </View>

                  <AppInput
                    label="Фамилия"
                    placeholder="Введите фамилию"
                    value={relative.surname || ''}
                    onChangeText={(text) => handleUpdateRelative(index, 'surname', text)}
                  />

                  <AppInput
                    label="Имя"
                    placeholder="Введите имя"
                    value={relative.name || ''}
                    onChangeText={(text) => handleUpdateRelative(index, 'name', text)}
                  />

                  <AppInput
                    label="Отчество"
                    placeholder="Введите отчество"
                    value={relative.patronymic || ''}
                    onChangeText={(text) => handleUpdateRelative(index, 'patronymic', text)}
                  />

                  <View className="mb-3">
                    <ThemedText variant="label" className="mb-2 text-sm font-medium">
                      Степень родства
                    </ThemedText>
                    <CustomDropdown
                      items={RELATIONSHIPS}
                      value={relative.relationship || null}
                      onChange={(value) => handleUpdateRelative(index, 'relationship', value)}
                      placeholder="Выберите степень родства"
                      zIndex={3000 - index}
                    />
                  </View>

                  <View className="mb-3">
                    <ThemedText variant="label" className="mb-2 text-sm font-medium">
                      Дата рождения
                    </ThemedText>
                    <Pressable
                      onPress={() => setShowDatePicker({ index })}
                      className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <ThemedText variant="body" className={relative.born ? '' : 'text-gray-400'}>
                        {relative.born || 'Выберите дату'}
                      </ThemedText>
                      <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <ThemedText variant="muted" className="text-center">
                Нет данных о родственниках
              </ThemedText>
            )}

            <AppButton
              title="Добавить родственника"
              variant="outline"
              onPress={handleAddRelative}
            />
          </ThemedCard>

          <AppButton
            title="Сохранить"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          />

          {showDatePicker && (
            <DateTimePicker
              value={
                formData.relatives?.[showDatePicker.index]?.born
                  ? new Date(formData.relatives[showDatePicker.index].born!)
                  : new Date()
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

