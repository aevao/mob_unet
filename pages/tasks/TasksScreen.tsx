import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { TaskCard } from '../../widgets/task/TaskCard';
import { TaskSkeleton } from '../../widgets/task/TaskSkeleton';
import { useTaskStore } from '../../entities/task/model/taskStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { TaskCategory, Task } from '../../entities/task/model/types';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { CreateTaskModal } from '../../widgets/task/CreateTaskModal';
import { AppButton } from '../../shared/ui/AppButton';

const categoryLabels: Record<TaskCategory, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  OVERDUE: { label: 'Просроченные', icon: 'alert-circle', color: '#EF4444' },
  TODAY: { label: 'Сегодня', icon: 'today-outline', color: '#F59E0B' },
  WEEK: { label: 'На неделе', icon: 'calendar', color: '#3B82F6' },
  MONTH: { label: 'В этом месяце', icon: 'calendar-outline', color: '#8B5CF6' },
  LONGRANGE: { label: 'Долгосрочные', icon: 'time-outline', color: '#10B981' },
  INDEFINITE: { label: 'Без срока', icon: 'infinite-outline', color: '#6B7280' },
};

interface CategorySectionProps {
  category: TaskCategory;
  tasks: Task[];
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}

const CategorySection = ({ category, tasks, isExpanded, onToggle, isDark }: CategorySectionProps) => {
  const config = categoryLabels[category];
  const hasTasks = tasks.length > 0;

  if (!hasTasks) return null;

  return (
    <ThemedCard className="mb-4">
      <View
        className={`mb-2 flex-row items-center justify-between rounded-lg p-3 
          `}
      >
        <View className="flex-row items-center flex-1">
          <Ionicons
            name={config.icon}
            size={20}
            color={config.color}
          />
          <ThemedText variant="title" className="ml-2 text-base font-semibold">
            {config.label}
          </ThemedText>
          <View
            className={`ml-2 rounded-full px-2 py-0.5 ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}
          >
            <ThemedText variant="label" className={`text-xs ${isDark ? 'text-[#60A5FA]' : 'text-[#2563EB]'}`}>
              {tasks.length}
            </ThemedText>
          </View>
        </View>
        <Pressable className={`p-2 rounded-full ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`} onPress={onToggle}>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={isDark ? '#60A5FA' : '#2563EB'}
          />
        </Pressable>
      </View>

      {isExpanded && (
        <View className="px-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      )}
    </ThemedCard>
  );
};

export const TasksScreen = () => {
  const { user } = useAuthStore();
  const { allTasks, isLoading, error, fetchTasks } = useTaskStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [expandedCategories, setExpandedCategories] = useState<Set<TaskCategory>>(
    new Set(['OVERDUE', 'TODAY'])
  );
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      void fetchTasks(user.id);
    }
  }, [user?.id, fetchTasks]);

  const handleTaskCreated = () => {
    if (user?.id) {
      void fetchTasks(user.id);
    }
  };

  const toggleCategory = (category: TaskCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const categories: TaskCategory[] = ['OVERDUE', 'TODAY', 'WEEK', 'MONTH', 'LONGRANGE', 'INDEFINITE'];
  const hasAnyTasks = categories.some((cat) => allTasks[cat].length > 0);

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="pt-3">
          <View className="mb-4 flex-row items-center justify-between">
            <ThemedText variant="title" className="text-xl font-bold">
              Задачи
            </ThemedText>
            <Pressable
              onPress={() => setIsCreateModalVisible(true)}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="add"
                size={24}
                color={isDark ? '#60A5FA' : '#2563EB'}
              />
            </Pressable>
          </View>

          {isLoading ? (
            <TaskSkeleton />
          ) : error ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center text-red-400">
                {error}
              </ThemedText>
            </View>
          ) : !hasAnyTasks ? (
            <View className="py-12 items-center">
              <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color={isDark ? '#6B7280' : '#9CA3AF'}
              />
              <ThemedText variant="muted" className="mt-4 text-center">
                Нет задач
              </ThemedText>
            </View>
          ) : (
            <View>
              {categories.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  tasks={allTasks[category]}
                  isExpanded={expandedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  isDark={isDark}
                />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>

      <CreateTaskModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleTaskCreated}
      />
    </ScreenContainer>
  );
};
