import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { AppInput } from '../../shared/ui/AppInput';
import { AppButton } from '../../shared/ui/AppButton';
import { CustomDropdown } from '../../shared/ui/CustomDropdown';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchEmployees } from '../../entities/employee/api/employeeApi';
import { createDocument } from '../../entities/document/api/createDocumentApi';
import type { Employee } from '../../entities/employee/model/types';
import type { DocumentTypeOption, CreateDocumentForm } from '../../entities/document/model/createDocumentTypes';

interface CreateDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DOCUMENT_TYPES: DocumentTypeOption[] = ['Рапорт', 'Заявление', 'Письмо'];

export const CreateDocumentModal = ({
  visible,
  onClose,
  onSuccess,
}: CreateDocumentModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<CreateDocumentForm>({
    type_doc: 'Рапорт',
    recipient_id: null,
    subject: '',
    content: '',
    is_urgent: false,
    files: [],
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    recipient_id?: string;
    subject?: string;
    content?: string;
  }>({});

  useEffect(() => {
    if (visible) {
      void loadEmployees();
    }
  }, [visible]);

  const loadEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const data = await fetchEmployees('E');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список сотрудников');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const handleSelectType = (value: string) => {
    setFormData({ ...formData, type_doc: value as DocumentTypeOption });
  };

  const handleSelectRecipient = (value: string) => {
    setFormData({ ...formData, recipient_id: parseInt(value, 10) });
    setErrors({ ...errors, recipient_id: undefined });
  };

  const handlePickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const fileUris = result.assets.map((asset) => asset.uri);
        setFormData({ ...formData, files: [...formData.files, ...fileUris] });
      }
    } catch (error) {
      console.error('Failed to pick files:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать файлы');
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: newFiles });
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.recipient_id) {
      newErrors.recipient_id = 'Выберите получателя';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Введите тему';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Введите содержание';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createDocument(formData);
      Alert.alert('Успешно', 'Документ успешно создан', [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            onSuccess?.();
            // Сброс формы
            setFormData({
              type_doc: 'Рапорт',
              recipient_id: null,
              subject: '',
              content: '',
              is_urgent: false,
              files: [],
            });
            setErrors({});
          },
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Не удалось создать документ';
      Alert.alert('Ошибка', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentTypeItems = useMemo(
    () =>
      DOCUMENT_TYPES.map((type) => ({
        label: type,
        value: type,
      })),
    []
  );

  const employeeItems = useMemo(
    () =>
      employees
        .filter((e) => e.is_active)
        .map((employee) => ({
          label: employee.full_name || employee.label,
          value: employee.value.toString(),
        })),
    [employees]
  );

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
                {/* Header */}
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Pressable onPress={onClose} hitSlop={8}>
                      <Ionicons
                        name="chevron-back"
                        size={24}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                    </Pressable>
                    <ThemedText variant="title" className="text-lg font-bold">
                      Новое обращение
                    </ThemedText>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Pressable
                      onPress={() =>
                        setFormData({ ...formData, is_urgent: !formData.is_urgent })
                      }
                      className="flex-row items-center gap-2"
                    >
                      <Ionicons
                        name={formData.is_urgent ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={
                          formData.is_urgent
                            ? isDark
                              ? '#60A5FA'
                              : '#2563EB'
                            : isDark
                              ? '#9CA3AF'
                              : '#6B7280'
                        }
                      />
                      <ThemedText variant="muted" className="text-xs">
                        Весьма срочно
                      </ThemedText>
                    </Pressable>
                    <Pressable onPress={onClose} hitSlop={8}>
                      <Ionicons
                        name="close"
                        size={24}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                    </Pressable>
                  </View>
                </View>

                <View className="mb-4 h-px bg-gray-200 dark:bg-gray-700" />

                {/* Document Type Selector */}
                <View className="mb-4">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Тип документа:
                  </ThemedText>
                  <CustomDropdown
                    items={documentTypeItems}
                    value={formData.type_doc}
                    onChange={handleSelectType}
                    placeholder="Выберите тип документа"
                    zIndex={2000}
                    searchable={false}
                  />
                </View>

                {/* Recipient Selector */}
                <View className="mb-4">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Кому: <ThemedText className="text-red-500">*</ThemedText>
                  </ThemedText>
                  <CustomDropdown
                    items={employeeItems}
                    value={formData.recipient_id?.toString() || null}
                    onChange={handleSelectRecipient}
                    placeholder={isLoadingEmployees ? 'Загрузка сотрудников...' : 'Выбрать подписывающего'}
                    zIndex={1000}
                    error={!!errors.recipient_id}
                    searchable={true}
                    searchPlaceholder="Поиск сотрудника..."
                    loading={isLoadingEmployees}
                  />
                  {errors.recipient_id && (
                    <ThemedText className="mt-1.5 text-xs text-red-500">
                      {errors.recipient_id}
                    </ThemedText>
                  )}
                </View>

                {/* Subject */}
                <AppInput
                  label="Тема:"
                  placeholder="Введите тему"
                  value={formData.subject}
                  onChangeText={(text) => {
                    setFormData({ ...formData, subject: text });
                    setErrors({ ...errors, subject: undefined });
                  }}
                  error={errors.subject}
                />

                {/* Content */}
                <View className="mb-3">
                  <ThemedText variant="label" className="mb-1 text-sm font-medium">
                    Содержание:
                  </ThemedText>
                  <TextInput
                    multiline
                    numberOfLines={6}
                    placeholder="Введите содержание"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    value={formData.content}
                    onChangeText={(text) => {
                      setFormData({ ...formData, content: text });
                      setErrors({ ...errors, content: undefined });
                    }}
                    className={`rounded-lg border px-3 py-2 text-base ${
                      errors.content
                        ? 'border-red-500'
                        : isDark
                          ? 'border-gray-700 bg-gray-900 text-gray-100'
                          : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    textAlignVertical="top"
                  />
                  {errors.content && (
                    <ThemedText className="mt-1 text-xs text-red-500">
                      {errors.content}
                    </ThemedText>
                  )}
                </View>

                {/* File Attachments */}
                <View className="mb-4">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Прикрепите дополнительные документы
                  </ThemedText>
                  <AppButton
                    title="Выбрать файлы"
                    variant="outline"
                    className='mb-2'
                    onPress={handlePickFiles}
                  />
                  {formData.files.length > 0 && (
                    <View className="mt-2 gap-2">
                      {formData.files.map((file, index) => (
                        <View
                          key={index}
                          className={`flex-row items-center justify-between rounded-lg border px-3 py-2 ${
                            isDark
                              ? 'border-gray-700 bg-gray-800'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <ThemedText variant="muted" className="flex-1 text-xs">
                            Файл {index + 1}
                          </ThemedText>
                          <Pressable onPress={() => handleRemoveFile(index)}>
                            <Ionicons
                              name="close-circle"
                              size={20}
                              color={isDark ? '#9CA3AF' : '#6B7280'}
                            />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Submit Button */}
                <AppButton
                  title="Отправить"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </ScrollView>
            </ThemedCard>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

