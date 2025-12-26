import { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  updateMilitaryRegistration,
} from '../../entities/employee/api/employeeInfoApi';
import type { MilitaryRegistrationData } from '../../entities/employee/model/employeeInfoTypes';

export const MilitaryRegistrationForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<MilitaryRegistrationData>({
    rank: '',
    troop_kind: '',
    is_fit: true,
    draft_board: '',
    composition: '',
    specialty: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MilitaryRegistrationData, string>>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.military_registration) {
        setFormData({
          rank: data.military_registration.rank || '',
          troop_kind: data.military_registration.troop_kind || '',
          is_fit: data.military_registration.is_fit ?? true,
          draft_board: data.military_registration.draft_board || '',
          composition: data.military_registration.composition || '',
          specialty: data.military_registration.specialty || '',
        });
      }
    } catch (error) {
      console.error('Failed to load military registration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateMilitaryRegistration(formData);
      Alert.alert('Успешно', 'Данные воинского учета обновлены', [
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
                  isDark ? 'bg-blue-900/20' : 'bg-blue-50'
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
                  name="shield"
                  size={24}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Воинский учет
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Информация о воинском учете
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          <ThemedCard className="p-4">
            <AppInput
              label="Воинское звание"
              placeholder="Введите воинское звание"
              value={formData.specialty || ''}
              onChangeText={(text) => setFormData({ ...formData, specialty: text })}
            />

            <AppInput
              label="ВУС"
              placeholder="Введите ВУС"
              value={formData.rank || ''}
              onChangeText={(text) => setFormData({ ...formData, rank: text })}
            />

            <AppInput
              label="Род войск"
              placeholder="Введите род войск"
              value={formData.troop_kind || ''}
              onChangeText={(text) => setFormData({ ...formData, troop_kind: text })}
            />

            <AppInput
              label="Состав"
              placeholder="Введите состав"
              value={formData.composition || ''}
              onChangeText={(text) => setFormData({ ...formData, composition: text })}
            />

            <AppInput
              label="Военкомат по месту жительства"
              placeholder="Введите военкомат"
              value={formData.draft_board || ''}
              onChangeText={(text) => setFormData({ ...formData, draft_board: text })}
            />

            {/* Годен/Не годен */}
            <View className="mb-3 flex-row items-center justify-between">
              <ThemedText variant="label" className="text-sm font-medium">
                Годен к военной службе
              </ThemedText>
              <Switch
                value={formData.is_fit ?? true}
                onValueChange={(value) => setFormData({ ...formData, is_fit: value })}
                trackColor={{ false: '#767577', true: isDark ? '#2563EB' : '#3B82F6' }}
                thumbColor={formData.is_fit ? '#fff' : '#f4f3f4'}
              />
            </View>

            <AppButton
              title="Сохранить"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </ThemedCard>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

