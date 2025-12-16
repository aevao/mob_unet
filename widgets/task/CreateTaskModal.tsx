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
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { AppInput } from '../../shared/ui/AppInput';
import { CustomDropdown } from '../../shared/ui/CustomDropdown';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchEmployees } from '../../entities/employee/api/employeeApi';
import { createTask } from '../../entities/task/api/createTaskApi';
import type { Employee } from '../../entities/employee/model/types';
import type { CreateTaskForm, CreateTaskMember } from '../../entities/task/model/createTaskTypes';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateTaskModal = ({ visible, onClose, onSuccess }: CreateTaskModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<CreateTaskForm>({
    task_name: '',
    is_critical: false,
    description: '',
    members: [],
    deadline_date: null,
    allow_change_deadline: true,
    skip_dayoffs: false,
    check_after_finish: false,
    determ_by_subtasks: true,
    report_after_finish: false,
    subtasks: [],
    attached_document: '',
    files: [],
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [showAdditionalParams, setShowAdditionalParams] = useState(false);
  const [errors, setErrors] = useState<{
    task_name?: string;
    members?: string;
  }>({});

  // Выбранные участники по типам
  const [responsibleMember, setResponsibleMember] = useState<number | null>(null);
  const [coExecutors, setCoExecutors] = useState<number[]>([]);
  const [watchers, setWatchers] = useState<number[]>([]);

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

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return '';
    }
  };

  const getCurrentDate = (): Date => {
    if (formData.deadline_date) {
      try {
        return new Date(formData.deadline_date);
      } catch {
        return new Date();
      }
    }
    return new Date();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        setFormData({ ...formData, deadline_date: formattedDate });
      }
    } else {
      // iOS - сохраняем временную дату
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleDateConfirm = () => {
    if (tempDate) {
      const formattedDate = tempDate.toISOString().split('T')[0];
      setFormData({ ...formData, deadline_date: formattedDate });
    }
    setShowDatePicker(false);
    setTempDate(null);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
    setTempDate(null);
  };

  const handleClearDate = () => {
    setFormData({ ...formData, deadline_date: null });
  };

  const handlePickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const fileUris = result.assets.map((asset) => asset.uri);
        setFormData({ ...formData, files: [...(formData.files || []), ...fileUris] });
      }
    } catch (error) {
      console.error('Failed to pick files:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать файлы');
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = formData.files?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, files: newFiles });
  };

  const handleSelectResponsible = (value: string) => {
    const memberId = parseInt(value, 10);
    setResponsibleMember(memberId);
    setErrors({ ...errors, members: undefined });
  };

  const handleSelectCoExecutor = (value: string) => {
    const memberId = parseInt(value, 10);
    if (!coExecutors.includes(memberId)) {
      setCoExecutors([...coExecutors, memberId]);
    }
  };

  const handleSelectWatcher = (value: string) => {
    const memberId = parseInt(value, 10);
    if (!watchers.includes(memberId)) {
      setWatchers([...watchers, memberId]);
    }
  };

  const removeMember = (type: 'responsible' | 'coExecutor' | 'watcher', id: number) => {
    if (type === 'responsible') {
      setResponsibleMember(null);
    } else if (type === 'coExecutor') {
      setCoExecutors(coExecutors.filter((m) => m !== id));
    } else if (type === 'watcher') {
      setWatchers(watchers.filter((m) => m !== id));
    }
  };

  const getEmployeeName = (id: number): string => {
    const employee = employees.find((e) => e.value === id);
    return employee?.full_name || employee?.label || '';
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.task_name.trim()) {
      newErrors.task_name = 'Введите наименование задачи';
    }

    if (!responsibleMember) {
      newErrors.members = 'Выберите ответственного';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // Формируем массив участников
    const members: CreateTaskMember[] = [];
    
    if (responsibleMember) {
      members.push({
        member_id: responsibleMember,
        member_type: 'Ответственный',
      });
    }

    coExecutors.forEach((id) => {
      members.push({
        member_id: id,
        member_type: 'Соисполнитель',
      });
    });

    watchers.forEach((id) => {
      members.push({
        member_id: id,
        member_type: 'Наблюдатель',
      });
    });

    const submitData: CreateTaskForm = {
      ...formData,
      members,
    };

    setIsSubmitting(true);
    try {
      await createTask(submitData);
      Alert.alert('Успешно', 'Задача успешно создана', [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            onSuccess?.();
            // Сброс формы
            setFormData({
              task_name: '',
              is_critical: false,
              description: '',
              members: [],
              deadline_date: null,
              allow_change_deadline: true,
              skip_dayoffs: false,
              check_after_finish: false,
              determ_by_subtasks: true,
              report_after_finish: false,
              subtasks: [],
              attached_document: '',
              files: [],
            });
            setResponsibleMember(null);
            setCoExecutors([]);
            setWatchers([]);
            setErrors({});
          },
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось создать задачу';
      Alert.alert('Ошибка', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 items-center justify-end bg-black/40"
          onPress={onClose}
        >
          <View
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
            className="w-full h-[93%]"
           
          >
            <ThemedCard className="h-full w-full rounded-3xl p-0 overflow-hidden">
              {/* Fixed Header */}
              <View className={`border-b px-4 pt-4 pb-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Pressable onPress={onClose} hitSlop={8}>
                      <Ionicons
                        name="chevron-back"
                        size={24}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                    </Pressable>
                    <ThemedText variant="title" className="text-lg font-bold">
                      Новая задача
                    </ThemedText>
                  </View>
                  <Pressable onPress={onClose} hitSlop={8}>
                    <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </Pressable>
                </View>
              </View>

              {/* Scrollable Content */}
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
              >

                {/* Task Name */}
                <View className="mb-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <ThemedText variant="label" className="text-sm font-medium">
                      Наименование
                    </ThemedText>
                    <Pressable
                      onPress={() =>
                        setFormData({ ...formData, is_critical: !formData.is_critical })
                      }
                      className="flex-row items-center gap-2"
                    >
                      <Ionicons
                        name={formData.is_critical ? 'checkbox' : 'square-outline'}
                        size={18}
                        color={
                          formData.is_critical
                            ? isDark
                              ? '#EF4444'
                              : '#DC2626'
                            : isDark
                              ? '#9CA3AF'
                              : '#6B7280'
                        }
                      />
                      <ThemedText variant="muted" className="text-xs">
                        Важная задача
                      </ThemedText>
                    </Pressable>
                  </View>
                  <AppInput
                    placeholder="Введите наименование задачи"
                    value={formData.task_name}
                    onChangeText={(text) => {
                      setFormData({ ...formData, task_name: text });
                      setErrors({ ...errors, task_name: undefined });
                    }}
                    error={errors.task_name}
                  />
                </View>

                {/* Description */}
                <View className="mb-3">
                  <ThemedText variant="label" className="mb-1 text-sm font-medium">
                    Описание
                  </ThemedText>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Введите описание задачи"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    className={`rounded-lg border px-3 py-2 text-base ${
                      isDark
                        ? 'border-gray-700 bg-gray-900 text-gray-100'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    textAlignVertical="top"
                  />
                </View>

                {/* File Attachments */}
                <View className="mb-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <ThemedText variant="label" className="text-sm font-medium">
                      Прикрепление файла
                    </ThemedText>
                    <ThemedText variant="muted" className="text-xs">
                      {formData.files && formData.files.length > 0
                        ? `${formData.files.length} файл(ов)`
                        : 'Файл не выбран'}
                    </ThemedText>
                  </View>
                  <Pressable
                    onPress={handlePickFiles}
                    className={`mb-2 rounded-lg border px-3 py-2.5 ${
                      isDark
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <ThemedText variant="body" className="text-center text-sm">
                      Выбрать файлы
                    </ThemedText>
                  </Pressable>
                  {formData.files && formData.files.length > 0 && (
                    <View className="mt-2">
                      {formData.files.map((file, index) => {
                        const fileName = file.split('/').pop() || `Файл ${index + 1}`;
                        return (
                          <View
                            key={index}
                            className="mb-2 flex-row items-center justify-between rounded-lg border p-2"
                          >
                            <ThemedText variant="body" className="flex-1 text-sm" numberOfLines={1}>
                              {fileName}
                            </ThemedText>
                            <Pressable onPress={() => handleRemoveFile(index)}>
                              <Ionicons name="close-circle" size={20} color="#EF4444" />
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* Responsible Member */}
                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Ответственный (Обязательное поле)
                  </ThemedText>
                  {responsibleMember ? (
                    <View className="mb-2 flex-row items-center justify-between rounded-lg border p-2">
                      <ThemedText variant="body" className="flex-1 text-sm">
                        {getEmployeeName(responsibleMember)}
                      </ThemedText>
                      <Pressable onPress={() => setResponsibleMember(null)}>
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                      </Pressable>
                    </View>
                  ) : (
                    <CustomDropdown
                      items={employeeItems}
                      value={null}
                      onChange={handleSelectResponsible}
                      placeholder={isLoadingEmployees ? 'Загрузка...' : 'Выбрать сотрудника'}
                      zIndex={3000}
                      error={!!errors.members}
                      searchable={true}
                      searchPlaceholder="Поиск сотрудника..."
                      loading={isLoadingEmployees}
                    />
                  )}
                  {errors.members && (
                    <ThemedText className="mt-1 text-xs text-red-500">{errors.members}</ThemedText>
                  )}
                </View>

                {/* Co-executors */}
                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Соисполнитель
                  </ThemedText>
                  {coExecutors.length > 0 && (
                    <View className="mb-2">
                      {coExecutors.map((id) => (
                        <View
                          key={id}
                          className="mb-2 flex-row items-center justify-between rounded-lg border p-2"
                        >
                          <ThemedText variant="body" className="flex-1 text-sm">
                            {getEmployeeName(id)}
                          </ThemedText>
                          <Pressable onPress={() => removeMember('coExecutor', id)}>
                            <Ionicons name="close-circle" size={20} color="#EF4444" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                  <CustomDropdown
                    items={employeeItems.filter((item) => !coExecutors.includes(parseInt(item.value, 10)))}
                    value={null}
                    onChange={handleSelectCoExecutor}
                    placeholder={isLoadingEmployees ? 'Загрузка...' : 'Выбрать сотрудника'}
                    zIndex={2000}
                    searchable={true}
                    searchPlaceholder="Поиск сотрудника..."
                    loading={isLoadingEmployees}
                  />
                </View>

                {/* Watchers */}
                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Наблюдатель
                  </ThemedText>
                  {watchers.length > 0 && (
                    <View className="mb-2">
                      {watchers.map((id) => (
                        <View
                          key={id}
                          className="mb-2 flex-row items-center justify-between rounded-lg border p-2"
                        >
                          <ThemedText variant="body" className="flex-1 text-sm">
                            {getEmployeeName(id)}
                          </ThemedText>
                          <Pressable onPress={() => removeMember('watcher', id)}>
                            <Ionicons name="close-circle" size={20} color="#EF4444" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                  <CustomDropdown
                    items={employeeItems.filter((item) => !watchers.includes(parseInt(item.value, 10)))}
                    value={null}
                    onChange={handleSelectWatcher}
                    placeholder={isLoadingEmployees ? 'Загрузка...' : 'Выбрать сотрудника'}
                    zIndex={1000}
                    searchable={true}
                    searchPlaceholder="Поиск сотрудника..."
                    loading={isLoadingEmployees}
                  />
                </View>

                {/* Deadline */}
                <View className="mb-3">
                  <ThemedText variant="label" className="mb-2 text-sm font-medium">
                    Крайний срок
                  </ThemedText>
                  <View className="flex-row items-center gap-2">
                    <Pressable
                      onPress={() => {
                        setTempDate(getCurrentDate());
                        setShowDatePicker(true);
                      }}
                      className={`flex-1 flex-row items-center justify-between rounded-lg border px-3 py-2.5 ${
                        isDark
                          ? 'border-gray-700 bg-gray-900'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <ThemedText
                        variant="body"
                        className={
                          formData.deadline_date
                            ? isDark
                              ? 'text-gray-100'
                              : 'text-gray-900'
                            : isDark
                              ? 'text-gray-400'
                              : 'text-gray-500'
                        }
                      >
                        {formData.deadline_date
                          ? formatDate(formData.deadline_date)
                          : 'Выберите дату'}
                      </ThemedText>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                    </Pressable>
                    {formData.deadline_date && (
                      <Pressable
                        onPress={handleClearDate}
                        className={`h-10 w-10 items-center justify-center rounded-lg ${
                          isDark ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                      </Pressable>
                    )}
                  </View>
                  
                  {showDatePicker && (
                    <>
                      {Platform.OS === 'ios' ? (
                        <Modal
                          transparent
                          visible={showDatePicker}
                          onRequestClose={handleDateCancel}
                        >
                          <Pressable
                            className="flex-1 justify-end bg-black/50"
                            onPress={handleDateCancel}
                          >
                            <View
                              onStartShouldSetResponder={() => true}
                              className={`w-full rounded-t-3xl p-4 ${
                                isDark ? 'bg-gray-900' : 'bg-white'
                              }`}
                            >
                              <View className="mb-4 flex-row items-center justify-between">
                                <Pressable onPress={handleDateCancel}>
                                  <ThemedText
                                    variant="body"
                                    className={`text-base ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                                  >
                                    Отмена
                                  </ThemedText>
                                </Pressable>
                                <ThemedText variant="title" className="text-base font-semibold">
                                  Выберите дату
                                </ThemedText>
                                <Pressable onPress={handleDateConfirm}>
                                  <ThemedText
                                    variant="body"
                                    className={`text-base font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                                  >
                                    Выбрать
                                  </ThemedText>
                                </Pressable>
                              </View>
                              <View
                                style={{
                                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                                }}
                              >
                                <DateTimePicker
                                  value={tempDate || getCurrentDate()}
                                  mode="date"
                                  display="spinner"
                                  onChange={handleDateChange}
                                  minimumDate={new Date()}
                                  locale="ru_RU"
                                  themeVariant={isDark ? 'dark' : 'light'}
                                  textColor={isDark ? '#F3F4F6' : '#111827'}
                                  style={{
                                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                                  }}
                                />
                              </View>
                            </View>
                          </Pressable>
                        </Modal>
                      ) : (
                        <DateTimePicker
                          value={tempDate || getCurrentDate()}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                          minimumDate={new Date()}
                        />
                      )}
                    </>
                  )}
                </View>

                {/* Additional Parameters */}
                <Pressable
                  onPress={() => setShowAdditionalParams(!showAdditionalParams)}
                  className="mb-3"
                >
                  <ThemedText variant="label" className="text-sm font-medium">
                    Дополнительные параметры
                  </ThemedText>
                </Pressable>

                {showAdditionalParams && (
                  <View className="mb-3 space-y-2">
                    <Pressable
                      onPress={() =>
                        setFormData({
                          ...formData,
                          allow_change_deadline: !formData.allow_change_deadline,
                        })
                      }
                      className="flex-row items-center gap-2"
                    >
                      <Ionicons
                        name={formData.allow_change_deadline ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={
                          formData.allow_change_deadline
                            ? isDark
                              ? '#10B981'
                              : '#059669'
                            : isDark
                              ? '#9CA3AF'
                              : '#6B7280'
                        }
                      />
                      <ThemedText variant="body" className="text-sm">
                        Разрешить ответственному менять сроки задачи
                      </ThemedText>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        setFormData({
                          ...formData,
                          determ_by_subtasks: !formData.determ_by_subtasks,
                        })
                      }
                      className="flex-row items-center gap-2"
                    >
                      <Ionicons
                        name={formData.determ_by_subtasks ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={
                          formData.determ_by_subtasks
                            ? isDark
                              ? '#10B981'
                              : '#059669'
                            : isDark
                              ? '#9CA3AF'
                              : '#6B7280'
                        }
                      />
                      <ThemedText variant="body" className="text-sm">
                        Сроки определяются сроками подзадач
                      </ThemedText>
                    </Pressable>
                  </View>
                )}

                {/* Submit Button */}
                <Pressable
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  className={`mt-4 rounded-lg px-4 py-3 ${
                    isSubmitting
                      ? 'bg-gray-400'
                      : isDark
                        ? 'bg-blue-600'
                        : 'bg-blue-600'
                  }`}
                >
                  <ThemedText className="text-center text-base font-semibold text-white">
                    {isSubmitting ? 'Создание...' : 'Создать задачу'}
                  </ThemedText>
                </Pressable>
              </ScrollView>
            </ThemedCard>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

