import { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Pressable, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchTaskDetail } from '../../entities/task/api/taskApi';
import type { TaskDetail, TaskMember, TaskFile } from '../../entities/task/model/types';
import type { TasksStackParamList } from '../../app/navigation/types';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';

type TaskDetailScreenRouteProp = RouteProp<TasksStackParamList, 'TaskDetail'>;

const MemberCard = ({ member, isDark }: { member: TaskMember; isDark: boolean }) => {
  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case 'Ответственный':
        return isDark ? '#EF4444' : '#DC2626';
      case 'Соисполнитель':
        return isDark ? '#3B82F6' : '#2563EB';
      case 'Наблюдатель':
        return isDark ? '#6B7280' : '#4B5563';
      default:
        return isDark ? '#9CA3AF' : '#6B7280';
    }
  };

  const getMemberTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'Ответственный':
        return 'person';
      case 'Соисполнитель':
        return 'people';
      case 'Наблюдатель':
        return 'eye';
      default:
        return 'person-outline';
    }
  };

  return (
    <View
      className={`mb-2 flex-row items-center rounded-lg p-3 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}
    >
      <View className="mr-3 h-10 w-10 overflow-hidden rounded-full">
        <OptimizedImage
          uri={member.member.imeag}
          style={{ width: 40, height: 40 }}
          resizeMode="cover"
          fallbackIcon="person"
          showLoadingIndicator={false}
        />
      </View>
      <View className="flex-1">
        <ThemedText variant="body" className="text-sm font-semibold">
          {member.member.first_name} {member.member.surname}
        </ThemedText>
        {member.member.position && (
          <ThemedText variant="muted" className="mt-0.5 text-xs">
            {member.member.position}
          </ThemedText>
        )}
        {member.member.division && (
          <ThemedText variant="muted" className="mt-0.5 text-xs">
            {member.member.division}
          </ThemedText>
        )}
      </View>
      <View
        className="flex-row items-center rounded-full px-2.5 py-1"
        style={{ backgroundColor: getMemberTypeColor(member.member_type) + '20' }}
      >
        <Ionicons
          name={getMemberTypeIcon(member.member_type)}
          size={14}
          color={getMemberTypeColor(member.member_type)}
        />
        <ThemedText
          variant="label"
          className="ml-1.5 text-xs font-semibold"
          style={{ color: getMemberTypeColor(member.member_type) }}
        >
          {member.member_type}
        </ThemedText>
      </View>
    </View>
  );
};

export const TaskDetailScreen = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const taskId = route.params?.taskId;
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      void loadTask();
    }
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTaskDetail(taskId);
      setTask(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Не удалось загрузить задачу';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('выполнена') || status.includes('завершена')) {
      return isDark ? '#10B981' : '#059669';
    }
    if (status.includes('выполнения') || status.includes('Ждет')) {
      return isDark ? '#F59E0B' : '#D97706';
    }
    if (status.includes('просрочен')) {
      return isDark ? '#EF4444' : '#DC2626';
    }
    return isDark ? '#60A5FA' : '#2563EB';
  };

  const isOverdue = task?.deadline_date && new Date(task.deadline_date.split('.').reverse().join('-')) < new Date();

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
          <ThemedText variant="muted" className="mt-4">
            Загрузка задачи...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !task) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={isDark ? '#EF4444' : '#DC2626'}
          />
          <ThemedText variant="muted" className="mt-4 text-center text-red-400">
            {error || 'Задача не найдена'}
          </ThemedText>
          <Pressable
            onPress={() => navigation.goBack()}
            className={`mt-6 rounded-lg px-6 py-3 ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <ThemedText variant="body" className="font-semibold">
              Назад
            </ThemedText>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const responsibleMembers = task.members.filter((m) => m.member_type === 'Ответственный');
  const coExecutors = task.members.filter((m) => m.member_type === 'Соисполнитель');
  const watchers = task.members.filter((m) => m.member_type === 'Наблюдатель');

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1 p-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header with Back Button */}
        <View className="mb-4 flex-row items-center">

        </View>

        {/* Main Task Info */}
        <ThemedCard className="mb-4 p-4">
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <ThemedText variant="title" className="mb-2 text-xl font-bold">
                {task.task_name}
              </ThemedText>
              {task.is_critical && (
                <View
                  className="mb-2 self-start rounded-full px-3 py-1"
                  style={{ backgroundColor: isDark ? '#EF4444' + '20' : '#FEE2E2' }}
                >
                  <ThemedText
                    variant="label"
                    className="text-xs font-semibold"
                    style={{ color: isDark ? '#EF4444' : '#DC2626' }}
                  >
                    Критическая задача
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Status */}
          <View className="mb-3 flex-row items-center">
            <View
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: getStatusColor(task.status) }}
            />
            <ThemedText
              variant="body"
              className="text-sm font-semibold"
              style={{ color: getStatusColor(task.status) }}
            >
              {task.status}
            </ThemedText>
          </View>

          {/* Dates */}
          <View className="mb-2 flex-row items-center">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="muted" className="ml-2 text-sm">
              Создана: {task.create_date}
            </ThemedText>
          </View>

          {task.deadline_date && (
            <View className="mb-3 flex-row items-center">
              <Ionicons
                name={isOverdue ? 'alert-circle' : 'time-outline'}
                size={16}
                color={isOverdue ? (isDark ? '#EF4444' : '#DC2626') : (isDark ? '#9CA3AF' : '#6B7280')}
              />
              <ThemedText
                variant="muted"
                className="ml-2 text-sm"
                style={{ color: isOverdue ? (isDark ? '#EF4444' : '#DC2626') : undefined }}
              >
                Срок: {task.deadline_date}
                {isOverdue && ' (Просрочено)'}
              </ThemedText>
            </View>
          )}

          {/* Description */}
          {task.description && (
            <View className="mt-4 rounded-lg p-3" style={{ backgroundColor: isDark ? '#1e293b' : '#F9FAFB' }}>
              <ThemedText variant="label" className="mb-2 text-xs">
                Описание:
              </ThemedText>
              <ThemedText variant="body" className="text-sm leading-5">
                {task.description}
              </ThemedText>
            </View>
          )}
        </ThemedCard>

        {/* Creator */}
        <ThemedCard className="mb-4 p-4">
          <ThemedText variant="title" className="mb-3 text-base font-bold">
            Создатель задачи
          </ThemedText>
          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 overflow-hidden rounded-full">
              <OptimizedImage
                uri={task.creator.imeag}
                style={{ width: 48, height: 48 }}
                resizeMode="cover"
                fallbackIcon="person"
                showLoadingIndicator={false}
              />
            </View>
            <View className="flex-1">
              <ThemedText variant="body" className="text-sm font-semibold">
                {task.creator.first_name} {task.creator.surname}
              </ThemedText>
              {task.creator.position && (
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  {task.creator.position}
                </ThemedText>
              )}
              {task.creator.division && (
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  {task.creator.division}
                </ThemedText>
              )}
            </View>
            {task.creator.is_online && (
              <View className="h-3 w-3 rounded-full bg-green-500" />
            )}
          </View>
        </ThemedCard>

        {/* Members */}
        {task.members.length > 0 && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Участники ({task.members.length})
            </ThemedText>

            {responsibleMembers.length > 0 && (
              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-xs">
                  Ответственные:
                </ThemedText>
                {responsibleMembers.map((member) => (
                  <MemberCard key={member.id} member={member} isDark={isDark} />
                ))}
              </View>
            )}

            {coExecutors.length > 0 && (
              <View className="mb-3">
                <ThemedText variant="label" className="mb-2 text-xs">
                  Соисполнители:
                </ThemedText>
                {coExecutors.map((member) => (
                  <MemberCard key={member.id} member={member} isDark={isDark} />
                ))}
              </View>
            )}

            {watchers.length > 0 && (
              <View>
                <ThemedText variant="label" className="mb-2 text-xs">
                  Наблюдатели:
                </ThemedText>
                {watchers.map((member) => (
                  <MemberCard key={member.id} member={member} isDark={isDark} />
                ))}
              </View>
            )}
          </ThemedCard>
        )}

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Подзадачи ({task.subtasks.length})
            </ThemedText>
            {task.subtasks.map((subtask: any, index: number) => (
              <View
                key={subtask.id || index}
                className={`mb-2 rounded-lg p-3 ${
                  isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}
              >
                <ThemedText variant="body" className="text-sm">
                  {subtask.name || `Подзадача ${index + 1}`}
                </ThemedText>
              </View>
            ))}
          </ThemedCard>
        )}

        {/* Files */}
        {task.files && task.files.length > 0 && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Прикрепленные файлы ({task.files.length})
            </ThemedText>
            {task.files.map((file: TaskFile, index: number) => {
              const getFileName = (url: string) => {
                try {
                  const urlParts = url.split('/');
                  return urlParts[urlParts.length - 1] || `Файл ${index + 1}`;
                } catch {
                  return `Файл ${index + 1}`;
                }
              };

              const fileName = getFileName(file.file);

              return (
                <Pressable
                  key={index}
                  onPress={() => file.file && Linking.openURL(file.file)}
                  className={`mb-2 flex-row items-center rounded-lg border px-3 py-2.5 ${
                    isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Ionicons
                    name="document-outline"
                    size={20}
                    color={isDark ? '#60A5FA' : '#2563EB'}
                  />
                  <View className="ml-2 flex-1">
                    <ThemedText variant="body" className="text-sm">
                      {fileName}
                    </ThemedText>
                    {file.create_date && (
                      <ThemedText variant="muted" className="mt-0.5 text-xs">
                        {file.create_date}
                      </ThemedText>
                    )}
                  </View>
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </Pressable>
              );
            })}
          </ThemedCard>
        )}

        {/* Resources */}
        {task.resources && task.resources.length > 0 && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Ресурсы ({task.resources.length})
            </ThemedText>
            {task.resources.map((resource: any, index: number) => (
              <View
                key={resource.id || index}
                className={`mb-2 rounded-lg p-3 ${
                  isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}
              >
                <ThemedText variant="body" className="text-sm">
                  {resource.name || `Ресурс ${index + 1}`}
                </ThemedText>
              </View>
            ))}
          </ThemedCard>
        )}

        {/* Attached Document */}
        {task.attached_document && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Прикрепленный документ
            </ThemedText>
            <Pressable
              onPress={() => Linking.openURL(task.attached_document)}
              className={`flex-row items-center rounded-lg border px-3 py-2.5 ${
                isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Ionicons
                name="document-attach-outline"
                size={20}
                color={isDark ? '#60A5FA' : '#2563EB'}
              />
              <ThemedText variant="body" className="ml-2 flex-1 text-sm">
                {task.attached_document}
              </ThemedText>
              <Ionicons
                name="open-outline"
                size={18}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          </ThemedCard>
        )}

        {/* Report */}
        {task.report && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Отчет
            </ThemedText>
            <View className="rounded-lg p-3" style={{ backgroundColor: isDark ? '#1e293b' : '#F9FAFB' }}>
              <ThemedText variant="body" className="text-sm leading-5">
                {task.report}
              </ThemedText>
            </View>
            {task.report_file && (
              <Pressable
                onPress={() => Linking.openURL(task.report_file!)}
                className={`mt-3 flex-row items-center rounded-lg border px-3 py-2.5 ${
                  isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Ionicons
                  name="document-outline"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
                <ThemedText variant="body" className="ml-2 flex-1 text-sm">
                  Файл отчета
                </ThemedText>
                <Ionicons
                  name="download-outline"
                  size={18}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
              </Pressable>
            )}
          </ThemedCard>
        )}

       
      </ScrollView>
    </ScreenContainer>
  );
};

