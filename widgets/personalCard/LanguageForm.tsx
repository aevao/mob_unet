import { useState, useEffect } from 'react';
import { View, Alert, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  updateLanguages,
} from '../../entities/employee/api/employeeInfoApi';
import type { LanguageData } from '../../entities/employee/model/employeeInfoTypes';

const LANGUAGE_LEVELS = [
  { label: 'A1', value: 'a1' },
  { label: 'A2', value: 'a2' },
  { label: 'B1', value: 'b1' },
  { label: 'B2', value: 'b2' },
  { label: 'C1', value: 'c1' },
  { label: 'C2', value: 'c2' },
];

export const LanguageForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.languages && Array.isArray(data.languages)) {
        setLanguages(data.languages);
      } else {
        setLanguages([]);
      }
    } catch (error) {
      console.error('Failed to load languages data:', error);
      setLanguages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyLanguage = (): LanguageData => ({
    is_mother_tongue: false,
    language: '',
    level: '',
  });

  const handleAddLanguage = () => {
    setLanguages([...languages, createEmptyLanguage()]);
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleUpdateLanguage = (index: number, field: keyof LanguageData, value: string | boolean) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Преобразуем boolean в строку для API
      const submitData = languages.map((lang) => ({
        ...lang,
        is_mother_tongue: lang.is_mother_tongue === true || lang.is_mother_tongue === 'True' ? 'True' : 'False',
      }));
      await updateLanguages(submitData);
      Alert.alert('Успешно', 'Данные о языках обновлены', [
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
                  isDark ? 'bg-teal-900/20' : 'bg-teal-50'
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
                  name="chatbubbles"
                  size={24}
                  color={isDark ? '#5EEAD4' : '#14B8A6'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Знание языков
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Изучаемые и известные языки
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          {languages.length === 0 && (
            <ThemedCard className="mb-4 p-4">
              <ThemedText variant="muted" className="text-center">
                Нет данных о языках
              </ThemedText>
            </ThemedCard>
          )}

          {languages.map((language, index) => (
            <ThemedCard key={index} className="mb-4 p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText variant="title" className="text-lg font-semibold">
                  Язык {index + 1}
                </ThemedText>
                <Pressable onPress={() => handleRemoveLanguage(index)}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </Pressable>
              </View>

              <AppInput
                label="Язык"
                placeholder="Введите название языка"
                value={language.language || ''}
                onChangeText={(text) => handleUpdateLanguage(index, 'language', text)}
              />

              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-sm font-medium">
                  Уровень владения
                </ThemedText>
                <CustomDropdown
                  items={LANGUAGE_LEVELS}
                  value={language.level || null}
                  onChange={(value) => handleUpdateLanguage(index, 'level', value)}
                  placeholder="Выберите уровень"
                  zIndex={3000 - index}
                />
              </View>

              <View className="mb-3 flex-row items-center justify-between">
                <ThemedText variant="label" className="text-sm font-medium">
                  Родной язык
                </ThemedText>
                <Switch
                  value={language.is_mother_tongue === true || language.is_mother_tongue === 'True'}
                  onValueChange={(value) => handleUpdateLanguage(index, 'is_mother_tongue', value)}
                  trackColor={{ false: '#767577', true: isDark ? '#2563EB' : '#3B82F6' }}
                  thumbColor={language.is_mother_tongue ? '#fff' : '#f4f3f4'}
                />
              </View>
            </ThemedCard>
          ))}

          <AppButton
            title="Добавить язык"
            variant="outline"
            onPress={handleAddLanguage}
            className="mb-4"
          />

          <AppButton
            title="Сохранить"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

