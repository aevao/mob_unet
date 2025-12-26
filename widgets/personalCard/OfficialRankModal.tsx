import { useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { AppInput } from '../../shared/ui/AppInput';
import { AppButton } from '../../shared/ui/AppButton';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { createOfficialRank } from '../../entities/employee/api/employeeInfoApi';
import type { OfficialRankData } from '../../entities/employee/model/employeeInfoTypes';

interface OfficialRankModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const OfficialRankModal = ({ visible, onClose, onSuccess }: OfficialRankModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<OfficialRankData>({
    title: '',
    rank: '',
    assigned: '',
    certification: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (!result.canceled && result.assets[0]) {
        setFormData({ ...formData, certification: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Failed to pick file:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать файл');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, assigned: formattedDate });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.rank.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOfficialRank(formData);
      Alert.alert('Успешно', 'Дипломатический ранг добавлен', [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            onSuccess?.();
            setFormData({ title: '', rank: '', assigned: '', certification: undefined });
          },
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось добавить ранг';
      Alert.alert('Ошибка', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={onClose}
        >
          <View
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
            className="w-full max-w-md"
          >
            <ThemedCard className="w-full rounded-3xl p-4">
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-10 w-10 items-center justify-center rounded-xl ${
                        isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'
                      }`}
                    >
                      <Ionicons
                        name="ribbon-outline"
                        size={24}
                        color={isDark ? '#FCD34D' : '#F59E0B'}
                      />
                    </View>
                    <ThemedText variant="title" className="text-lg font-bold">
                      Дипломатический ранг
                    </ThemedText>
                  </View>
                  <Pressable onPress={onClose} hitSlop={8}>
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </Pressable>
                </View>

                <View className="mb-4 h-px bg-gray-200 dark:bg-gray-700" />

                <AppInput
                  label="Дипломатический ранг или иные звания"
                  placeholder="Введите название"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />

                <AppInput
                  label="Звание"
                  placeholder="Введите звание"
                  value={formData.rank}
                  onChangeText={(text) => setFormData({ ...formData, rank: text })}
                />

                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Дата присвоения
                  </ThemedText>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                      isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <ThemedText variant="body" className={formData.assigned ? '' : 'text-gray-400'}>
                      {formData.assigned || 'Выберите дату'}
                    </ThemedText>
                    <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </Pressable>
                </View>

                <View className="mb-4">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Сертификат
                  </ThemedText>
                  <AppButton
                    title={formData.certification ? 'Файл выбран' : 'Выбрать файл'}
                    variant="outline"
                    onPress={handlePickFile}
                  />
                  {formData.certification && (
                    <ThemedText variant="muted" className="mt-2 text-xs">
                      Файл: {formData.certification.split('/').pop()}
                    </ThemedText>
                  )}
                </View>

                <AppButton
                  title="Добавить"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </ScrollView>
            </ThemedCard>
          </View>
        </Pressable>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.assigned ? new Date(formData.assigned) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </Modal>
  );
};

