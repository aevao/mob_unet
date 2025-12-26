import { useState, useEffect } from 'react';
import { View, Alert, Pressable, Platform } from 'react-native';
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
  updateEducation,
} from '../../entities/employee/api/employeeInfoApi';
import type { EducationData } from '../../entities/employee/model/employeeInfoTypes';

const EDUCATION_LEVELS = [
  { label: 'Высшее', value: 'Высшее' },
  { label: 'Среднее специальное', value: 'Среднее специальное' },
  { label: 'Среднее', value: 'Среднее' },
];

const EDUCATION_FORMS = [
  { label: 'Очная', value: 'Очная' },
  { label: 'Заочная', value: 'Заочная' },
  { label: 'Очно-заочная', value: 'Очно-заочная' },
];

export const EducationForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<{
    index: number;
    field: 'entered' | 'graduated';
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.education && Array.isArray(data.education)) {
        setEducationList(data.education);
      } else {
        setEducationList([createEmptyEducation()]);
      }
    } catch (error) {
      console.error('Failed to load education data:', error);
      setEducationList([createEmptyEducation()]);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyEducation = (): EducationData => ({
    diploma_number: '',
    level: '',
    form: '',
    institution: '',
    department: '',
    entered: '',
    graduated: '',
    disposed: '',
    qualification: '',
    academic_degree: '',
    academic_rank: '',
  });

  const handleAddEducation = () => {
    setEducationList([...educationList, createEmptyEducation()]);
  };

  const handleRemoveEducation = (index: number) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter((_, i) => i !== index));
    } else {
      Alert.alert('Ошибка', 'Должно быть хотя бы одно образование');
    }
  };

  const handleUpdateEducation = (index: number, field: keyof EducationData, value: string) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    setEducationList(updated);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
      if (event.type === 'set' && selectedDate && showDatePicker) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        handleUpdateEducation(showDatePicker.index, showDatePicker.field, formattedDate);
      }
    } else if (selectedDate && showDatePicker) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleUpdateEducation(showDatePicker.index, showDatePicker.field, formattedDate);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateEducation(educationList);
      Alert.alert('Успешно', 'Данные об образовании обновлены', [
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
                  isDark ? 'bg-purple-900/20' : 'bg-purple-50'
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
                  name="school"
                  size={24}
                  color={isDark ? '#A78BFA' : '#8B5CF6'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Образование
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Образовательные учреждения и дипломы
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          {educationList.map((education, index) => (
            <ThemedCard key={index} className="mb-4 p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText variant="title" className="text-lg font-semibold">
                  Образование {index + 1}
                </ThemedText>
                {educationList.length > 1 && (
                  <Pressable onPress={() => handleRemoveEducation(index)}>
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </Pressable>
                )}
              </View>

              <AppInput
                label="Номер диплома"
                placeholder="Введите номер диплома"
                value={education.diploma_number || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'diploma_number', text)}
              />

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Уровень образования
                </ThemedText>
                <CustomDropdown
                  items={EDUCATION_LEVELS}
                  value={education.level || null}
                  onChange={(value) => handleUpdateEducation(index, 'level', value)}
                  placeholder="Выберите уровень"
                  zIndex={3000 - index}
                />
              </View>

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Форма обучения
                </ThemedText>
                <CustomDropdown
                  items={EDUCATION_FORMS}
                  value={education.form || null}
                  onChange={(value) => handleUpdateEducation(index, 'form', value)}
                  placeholder="Выберите форму"
                  zIndex={3000 - index - 10}
                />
              </View>

              <AppInput
                label="Учебное заведение"
                placeholder="Введите название учебного заведения"
                value={education.institution || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'institution', text)}
              />

              <AppInput
                label="Факультет/Отделение"
                placeholder="Введите факультет или отделение"
                value={education.department || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'department', text)}
              />

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата поступления
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'entered' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark
                      ? 'border-gray-700 bg-gray-900'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText
                    variant="body"
                    className={education.entered ? '' : 'text-gray-400'}
                  >
                    {education.entered || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </Pressable>
              </View>

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Дата окончания
                </ThemedText>
                <Pressable
                  onPress={() => setShowDatePicker({ index, field: 'graduated' })}
                  className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                    isDark
                      ? 'border-gray-700 bg-gray-900'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <ThemedText
                    variant="body"
                    className={education.graduated ? '' : 'text-gray-400'}
                  >
                    {education.graduated || 'Выберите дату'}
                  </ThemedText>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </Pressable>
              </View>

              <AppInput
                label="Утилизирован"
                placeholder="Введите информацию об утилизации"
                value={education.disposed || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'disposed', text)}
              />

              <AppInput
                label="Квалификация"
                placeholder="Введите квалификацию"
                value={education.qualification || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'qualification', text)}
              />

              <AppInput
                label="Ученая степень"
                placeholder="Введите ученую степень"
                value={education.academic_degree || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'academic_degree', text)}
              />

              <AppInput
                label="Ученое звание"
                placeholder="Введите ученое звание"
                value={education.academic_rank || ''}
                onChangeText={(text) => handleUpdateEducation(index, 'academic_rank', text)}
              />
            </ThemedCard>
          ))}

          <AppButton
            title="Добавить образование"
            variant="outline"
            onPress={handleAddEducation}
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
                educationList[showDatePicker.index]?.[showDatePicker.field]
                  ? new Date(educationList[showDatePicker.index][showDatePicker.field]!)
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

