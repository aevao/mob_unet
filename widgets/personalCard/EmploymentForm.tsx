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
  updateEmployment,
} from '../../entities/employee/api/employeeInfoApi';
import type { EmploymentData, ExperienceData } from '../../entities/employee/model/employeeInfoTypes';
import { Platform } from 'react-native';

export const EmploymentForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<EmploymentData>({
    total_experience: '',
    professional_experience: '',
    public_service_experience: '',
    private_service_experience: '',
    continuous_experience: '',
    experiences: [],
  });

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
      if (data.employment) {
        setFormData({
          total_experience: data.employment.total_experience || '',
          professional_experience: data.employment.professional_experience || '',
          public_service_experience: data.employment.public_service_experience || '',
          private_service_experience: data.employment.private_service_experience || '',
          continuous_experience: data.employment.continuous_experience || '',
          experiences: data.employment.experiences || [],
        });
      }
    } catch (error) {
      console.error('Failed to load employment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyExperience = (): ExperienceData => ({
    organization: '',
    position: '',
    started: '',
    ended: '',
    staff: null,
    employment_order: '',
    dismissal_order: '',
  });

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experiences: [...(formData.experiences || []), createEmptyExperience()],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...(formData.experiences || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, experiences: updated });
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceData, value: string | null) => {
    const updated = [...(formData.experiences || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, experiences: updated });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
      if (event.type === 'set' && selectedDate && showDatePicker) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        handleUpdateExperience(showDatePicker.index, showDatePicker.field, formattedDate);
      }
    } else if (selectedDate && showDatePicker) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleUpdateExperience(showDatePicker.index, showDatePicker.field, formattedDate);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateEmployment(formData);
      Alert.alert('Успешно', 'Данные о трудовой деятельности обновлены', [
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
                  isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'
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
                  name="briefcase"
                  size={24}
                  color={isDark ? '#818CF8' : '#6366F1'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Трудовая деятельность
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Трудовой стаж и история работы
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          <ThemedCard className="mb-4 p-4">
            <AppInput
              label="Общий стаж"
              placeholder="Введите общий стаж"
              value={formData.total_experience || ''}
              onChangeText={(text) => setFormData({ ...formData, total_experience: text })}
            />

            <AppInput
              label="Стаж по специальности"
              placeholder="Введите стаж по специальности"
              value={formData.professional_experience || ''}
              onChangeText={(text) => setFormData({ ...formData, professional_experience: text })}
            />

            <AppInput
              label="Стаж государственной службы"
              placeholder="Введите стаж госслужбы"
              value={formData.public_service_experience || ''}
              onChangeText={(text) => setFormData({ ...formData, public_service_experience: text })}
            />

            <AppInput
              label="Стаж частной службы"
              placeholder="Введите стаж частной службы"
              value={formData.private_service_experience || ''}
              onChangeText={(text) => setFormData({ ...formData, private_service_experience: text })}
            />

            <AppInput
              label="Непрерывный стаж"
              placeholder="Введите непрерывный стаж"
              value={formData.continuous_experience || ''}
              onChangeText={(text) => setFormData({ ...formData, continuous_experience: text })}
            />
          </ThemedCard>

          <ThemedCard className="mb-4 p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <ThemedText variant="title" className="text-lg font-semibold">
                Места работы
              </ThemedText>
            </View>

            {formData.experiences && formData.experiences.length > 0 ? (
              formData.experiences.map((experience, index) => (
                <View key={index} className="mb-4">
                  <View className="mb-3 flex-row items-center justify-between">
                    <ThemedText variant="label" className="text-base font-medium">
                      Место работы {index + 1}
                    </ThemedText>
                    <Pressable onPress={() => handleRemoveExperience(index)}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </Pressable>
                  </View>

                  <AppInput
                    label="Наименование организации"
                    placeholder="Введите название организации"
                    value={experience.organization || ''}
                    onChangeText={(text) => handleUpdateExperience(index, 'organization', text)}
                  />

                  <AppInput
                    label="Занимаемая должность"
                    placeholder="Введите должность"
                    value={experience.position || ''}
                    onChangeText={(text) => handleUpdateExperience(index, 'position', text)}
                  />

                  <View className="mb-3">
                    <ThemedText variant="label" className="mb-2 text-sm font-medium">
                      Дата начала работы
                    </ThemedText>
                    <Pressable
                      onPress={() => setShowDatePicker({ index, field: 'started' })}
                      className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <ThemedText variant="body" className={experience.started ? '' : 'text-gray-400'}>
                        {experience.started || 'Выберите дату'}
                      </ThemedText>
                      <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </Pressable>
                  </View>

                  <View className="mb-3">
                    <ThemedText variant="label" className="mb-2 text-sm font-medium">
                      Дата окончания работы
                    </ThemedText>
                    <Pressable
                      onPress={() => setShowDatePicker({ index, field: 'ended' })}
                      className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <ThemedText variant="body" className={experience.ended ? '' : 'text-gray-400'}>
                        {experience.ended || 'Выберите дату'}
                      </ThemedText>
                      <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </Pressable>
                  </View>

                  <AppInput
                    label="Номер приказа начала работы"
                    placeholder="Введите номер приказа"
                    value={experience.employment_order || ''}
                    onChangeText={(text) => handleUpdateExperience(index, 'employment_order', text)}
                  />

                  <AppInput
                    label="Номер приказа окончания работы"
                    placeholder="Введите номер приказа"
                    value={experience.dismissal_order || ''}
                    onChangeText={(text) => handleUpdateExperience(index, 'dismissal_order', text)}
                  />
                </View>
              ))
            ) : (
              <ThemedText variant="muted" className="text-center">
                Нет данных о местах работы
              </ThemedText>
            )}

            <AppButton
              title="Добавить место работы"
              variant="outline"
              onPress={handleAddExperience}
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
                formData.experiences?.[showDatePicker.index]?.[showDatePicker.field]
                  ? new Date(formData.experiences[showDatePicker.index][showDatePicker.field]!)
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

