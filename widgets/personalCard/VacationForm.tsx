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
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { useNavigation } from '@react-navigation/native';
import {
  fetchEmployeeInfo,
  updateVacations,
} from '../../entities/employee/api/employeeInfoApi';
import type { VacationData } from '../../entities/employee/model/employeeInfoTypes';
import { Platform } from 'react-native';

export const VacationForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [vacations, setVacations] = useState<VacationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<{
    index: number;
    field: 'started' | 'ended' | 'leave_order_date' | 'recall_order_date' | 'recalled';
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.vacations && Array.isArray(data.vacations)) {
        setVacations(data.vacations);
      } else {
        setVacations([]);
      }
    } catch (error) {
      console.error('Failed to load vacations data:', error);
      setVacations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyVacation = (): VacationData => ({
    kind: '',
    period: '',
    started: '',
    ended: '',
    leave_order: '',
    unused_days: '',
    unpaid_days: '',
    recall_order: '',
    recall_order_date: '',
    leave_order_date: '',
    recalled: '',
  });

  const handleAddVacation = () => {
    setVacations([...vacations, createEmptyVacation()]);
  };

  const handleRemoveVacation = (index: number) => {
    setVacations(vacations.filter((_, i) => i !== index));
  };

  const handleUpdateVacation = (index: number, field: keyof VacationData, value: string) => {
    const updated = [...vacations];
    updated[index] = { ...updated[index], [field]: value };
    setVacations(updated);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
      if (event.type === 'set' && selectedDate && showDatePicker) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        handleUpdateVacation(showDatePicker.index, showDatePicker.field, formattedDate);
      }
    } else if (selectedDate && showDatePicker) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleUpdateVacation(showDatePicker.index, showDatePicker.field, formattedDate);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateVacations(vacations);
      Alert.alert('Успешно', 'Данные об отпусках обновлены', [
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
                  isDark ? 'bg-orange-900/20' : 'bg-orange-50'
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
                  name="calendar"
                  size={24}
                  color={isDark ? '#FB923C' : '#F97316'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Отпуск
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  График отпусков и заявки
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          {vacations.length === 0 && (
            <ThemedCard className="mb-4 p-4">
              <ThemedText variant="muted" className="text-center">
                Нет данных об отпусках
              </ThemedText>
            </ThemedCard>
          )}

          {vacations.map((vacation, index) => (
            <ThemedCard key={index} className="mb-4 p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText variant="title" className="text-lg font-semibold">
                  Отпуск {index + 1}
                </ThemedText>
                <Pressable onPress={() => handleRemoveVacation(index)}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </Pressable>
              </View>

              <AppInput
                label="Вид отпуска"
                placeholder="Введите вид отпуска"
                value={vacation.kind || ''}
                onChangeText={(text) => handleUpdateVacation(index, 'kind', text)}
              />

              <AppInput
                label="Период"
                placeholder="Введите период"
                value={vacation.period || ''}
                onChangeText={(text) => handleUpdateVacation(index, 'period', text)}
              />

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата начала
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'started' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText variant="body" className={vacation.started ? '' : 'text-gray-400'}>
                    {vacation.started || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </Pressable>
              </View>

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата окончания
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'ended' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText variant="body" className={vacation.ended ? '' : 'text-gray-400'}>
                    {vacation.ended || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </Pressable>
              </View>

              <AppInput
                label="Приказ на отпуск"
                placeholder="Введите номер приказа"
                value={vacation.leave_order || ''}
                onChangeText={(text) => handleUpdateVacation(index, 'leave_order', text)}
              />

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата приказа на отпуск
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'leave_order_date' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText variant="body" className={vacation.leave_order_date ? '' : 'text-gray-400'}>
                    {vacation.leave_order_date || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </Pressable>
              </View>

              <AppInput
                label="Неиспользованные дни"
                placeholder="Введите количество дней"
                value={vacation.unused_days || ''}
                onChangeText={(text) => handleUpdateVacation(index, 'unused_days', text)}
                keyboardType="numeric"
              />

              <AppInput
                label="Неоплаченные дни"
                placeholder="Введите количество дней"
                value={vacation.unpaid_days || ''}
                onChangeText={(text) => handleUpdateVacation(index, 'unpaid_days', text)}
                keyboardType="numeric"
              />

              <AppInput
                label="Приказ об отзыве"
                placeholder="Введите номер приказа"
                value={vacation.recall_order || ''}
                onChangeText={(text) => handleUpdateVacation(index, 'recall_order', text)}
              />

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата приказа об отзыве
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'recall_order_date' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText variant="body" className={vacation.recall_order_date ? '' : 'text-gray-400'}>
                    {vacation.recall_order_date || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </Pressable>
              </View>

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата отзыва
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'recalled' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText variant="body" className={vacation.recalled ? '' : 'text-gray-400'}>
                    {vacation.recalled || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </Pressable>
              </View>
            </ThemedCard>
          ))}

          <AppButton
            title="Добавить отпуск"
            variant="outline"
            onPress={handleAddVacation}
            className="mb-4"
          />

          <AppButton
            title="Сохранить"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          />

          {showDatePicker && (
            <DateTimePicker
              value={
                vacations[showDatePicker.index]?.[showDatePicker.field]
                  ? new Date(vacations[showDatePicker.index][showDatePicker.field]!)
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

