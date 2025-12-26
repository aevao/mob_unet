import { useState, useEffect } from 'react';
import { View, Alert, Pressable } from 'react-native';
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
  updateResidencePlace,
} from '../../entities/employee/api/employeeInfoApi';
import type { ResidencePlaceData } from '../../entities/employee/model/employeeInfoTypes';

export const ResidencePlaceForm = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<ResidencePlaceData>({
    country: '',
    region: '',
    village: '',
    city: '',
    city_district: '',
    region_district: '',
    street: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployeeInfo();
      if (data.residence_place) {
        setFormData({
          country: data.residence_place.country || '',
          region: data.residence_place.region || '',
          village: data.residence_place.village || '',
          city: data.residence_place.city || '',
          city_district: data.residence_place.city_district || '',
          region_district: data.residence_place.region_district || '',
          street: data.residence_place.street || '',
        });
      }
    } catch (error) {
      console.error('Failed to load residence place data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateResidencePlace(formData);
      Alert.alert('Успешно', 'Данные места жительства обновлены', [
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
                  isDark ? 'bg-green-900/20' : 'bg-green-50'
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
                  name="location"
                  size={24}
                  color={isDark ? '#34D399' : '#10B981'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Место жительства
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  Адрес регистрации и проживания
                </ThemedText>
              </View>
            </View>
          </ThemedCard>

          <ThemedCard className="p-4">
            <AppInput
              label="Страна"
              placeholder="Введите страну"
              value={formData.country || ''}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
            />

            <AppInput
              label="Область"
              placeholder="Введите область"
              value={formData.region || ''}
              onChangeText={(text) => setFormData({ ...formData, region: text })}
            />

            <AppInput
              label="Район области"
              placeholder="Введите район области"
              value={formData.region_district || ''}
              onChangeText={(text) => setFormData({ ...formData, region_district: text })}
            />

            <AppInput
              label="Город"
              placeholder="Введите город"
              value={formData.city || ''}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />

            <AppInput
              label="Район города"
              placeholder="Введите район города"
              value={formData.city_district || ''}
              onChangeText={(text) => setFormData({ ...formData, city_district: text })}
            />

            <AppInput
              label="Село"
              placeholder="Введите село"
              value={formData.village || ''}
              onChangeText={(text) => setFormData({ ...formData, village: text })}
            />

            <AppInput
              label="Улица"
              placeholder="Введите улицу"
              value={formData.street || ''}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
            />

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

