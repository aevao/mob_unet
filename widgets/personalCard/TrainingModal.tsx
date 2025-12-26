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
import { createTraining } from '../../entities/employee/api/employeeInfoApi';
import type { TrainingData } from '../../entities/employee/model/employeeInfoTypes';

interface TrainingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TrainingModal = ({ visible, onClose, onSuccess }: TrainingModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<TrainingData>({
    title: '',
    kind: '',
    started: '',
    ended: '',
    certification_type: '',
    certification: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<{
    field: 'started' | 'ended';
  } | null>(null);

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
      setShowDatePicker(null);
    }
    if (event.type === 'set' && selectedDate && showDatePicker) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, [showDatePicker.field]: formattedDate });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.kind.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTraining(formData);
      Alert.alert('Успешно', 'Повышение квалификации добавлено', [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            onSuccess?.();
            setFormData({
              title: '',
              kind: '',
              started: '',
              ended: '',
              certification_type: '',
              certification: undefined,
            });
          },
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось добавить повышение квалификации';
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
                        isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'
                      }`}
                    >
                      <Ionicons
                        name="trending-up-outline"
                        size={24}
                        color={isDark ? '#6EE7B7' : '#10B981'}
                      />
                    </View>
                    <ThemedText variant="title" className="text-base font-bold">
                      Повышение квалификации
                    </ThemedText>
                    <ThemedText variant="muted" className="mt-0.5 text-xs"></ThemedText>
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
                  label="Повышение квалификации"
                  placeholder="Введите название"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />

                <AppInput
                  label="Вид повышения"
                  placeholder="Введите вид повышения"
                  value={formData.kind}
                  onChangeText={(text) => setFormData({ ...formData, kind: text })}
                />

                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Дата начала
                  </ThemedText>
                  <Pressable
                    onPress={() => setShowDatePicker({ field: 'started' })}
                    className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                      isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <ThemedText variant="body" className={formData.started ? '' : 'text-gray-400'}>
                      {formData.started || 'Выберите дату'}
                    </ThemedText>
                    <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </Pressable>
                </View>

                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Дата окончания
                  </ThemedText>
                  <Pressable
                    onPress={() => setShowDatePicker({ field: 'ended' })}
                    className={`flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                      isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <ThemedText variant="body" className={formData.ended ? '' : 'text-gray-400'}>
                      {formData.ended || 'Выберите дату'}
                    </ThemedText>
                    <Ionicons name="calendar-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </Pressable>
                </View>

                <AppInput
                  label="Вид документа"
                  placeholder="Введите вид документа"
                  value={formData.certification_type}
                  onChangeText={(text) => setFormData({ ...formData, certification_type: text })}
                />

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
          value={
            formData[showDatePicker.field]
              ? new Date(formData[showDatePicker.field]!)
              : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </Modal>
  );
};

