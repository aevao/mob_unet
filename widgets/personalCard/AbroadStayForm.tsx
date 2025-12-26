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
  updateAbroadStays,
} from '../../entities/employee/api/employeeInfoApi';
import type { AbroadStayData } from '../../entities/employee/model/employeeInfoTypes';
import { Platform } from 'react-native';

export const AbroadStayForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [stays, setStays] = useState<AbroadStayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<{
    index: number;
    field: 'started' | 'ended';
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.abroad_stays && Array.isArray(data.abroad_stays)) {
        setStays(data.abroad_stays);
      } else {
        setStays([]);
      }
    } catch (error) {
      console.error('Failed to load abroad stays data:', error);
      setStays([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyStay = (): AbroadStayData => ({
    purpose: '',
    country: '',
    started: '',
    ended: '',
  });

  const handleAddStay = () => {
    setStays([...stays, createEmptyStay()]);
  };

  const handleRemoveStay = (index: number) => {
    setStays(stays.filter((_, i) => i !== index));
  };

  const handleUpdateStay = (index: number, field: keyof AbroadStayData, value: string) => {
    const updated = [...stays];
    updated[index] = { ...updated[index], [field]: value };
    setStays(updated);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
      if (event.type === 'set' && selectedDate && showDatePicker) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        handleUpdateStay(showDatePicker.index, showDatePicker.field, formattedDate);
      }
    } else if (selectedDate && showDatePicker) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleUpdateStay(showDatePicker.index, showDatePicker.field, formattedDate);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateAbroadStays(stays);
      Alert.alert('Успешно', 'Данные о пребывании за границей обновлены', [
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
                  isDark ? 'bg-cyan-900/20' : 'bg-cyan-50'
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
                  name="airplane"
                  size={24}
                  color={isDark ? '#22D3EE' : '#06B6D4'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Прибывание за границей
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Командировки и поездки
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          {stays.length === 0 && (
            <ThemedCard className="mb-4 p-4">
              <ThemedText variant="muted" className="text-center">
                Нет данных о пребывании за границей
              </ThemedText>
            </ThemedCard>
          )}

          {stays.map((stay, index) => (
            <ThemedCard key={index} className="mb-4 p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText variant="title" className="text-lg font-semibold">
                  Поездка {index + 1}
                </ThemedText>
                <Pressable onPress={() => handleRemoveStay(index)}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </Pressable>
              </View>

              <AppInput
                label="Цель прибывания"
                placeholder="Введите цель прибывания"
                value={stay.purpose || ''}
                onChangeText={(text) => handleUpdateStay(index, 'purpose', text)}
              />

              <AppInput
                label="Страна"
                placeholder="Введите страну"
                value={stay.country || ''}
                onChangeText={(text) => handleUpdateStay(index, 'country', text)}
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
                  <ThemedText variant="body" className={stay.started ? '' : 'text-gray-400'}>
                    {stay.started || 'Выберите дату'}
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
                  <ThemedText variant="body" className={stay.ended ? '' : 'text-gray-400'}>
                    {stay.ended || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </Pressable>
              </View>
            </ThemedCard>
          ))}

          <AppButton
            title="Добавить поездку"
            variant="outline"
            onPress={handleAddStay}
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
                stays[showDatePicker.index]?.[showDatePicker.field]
                  ? new Date(stays[showDatePicker.index][showDatePicker.field]!)
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

