import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { Task } from '../../entities/task/model/types';
import type { TasksStackParamList } from '../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<TasksStackParamList>;

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

export const TaskCard = ({ task, onPress }: TaskCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigation = useNavigation<NavigationProp>();

  const responsibleMember = task.members.find(m => m.member_type === 'Ответственный');
  const hasMultipleMembers = task.members.length > 1;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('TaskDetail', { taskId: task.id });
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedCard className="mb-3 p-4">
        <View className="mb-3">
          <ThemedText variant="title" className="mb-2 text-base font-bold">
            {task.task_name}
          </ThemedText>
          
          <View className="mb-2 flex-row items-center">
            <Ionicons
              name="time-outline"
              size={14}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="muted" className="ml-1.5 text-xs">
              {task.create_date}
            </ThemedText>
            {task.deadline_date && (
              <>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={isDark ? '#EF4444' : '#DC2626'}
                  style={{ marginLeft: 12 }}
                />
                <ThemedText 
                  variant="muted" 
                  className="ml-1.5 text-xs"
                  style={{ color: isDark ? '#EF4444' : '#DC2626' }}
                >
                  До {task.deadline_date}
                </ThemedText>
              </>
            )}
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="muted" className="ml-1.5 text-xs">
              {task.status}
            </ThemedText>
          </View>
        </View>

        {responsibleMember && (
          <View className="mb-2 flex-row items-center">
            <Ionicons
              name="person-outline"
              size={14}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
            <ThemedText variant="body" className="ml-1.5 text-xs">
              {responsibleMember.member.first_name} {responsibleMember.member.surname}
            </ThemedText>
            {hasMultipleMembers && (
              <View className={`ml-2 rounded-full px-2 py-0.5 ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}>
                <ThemedText variant="label" className="text-xs">
                  +{task.members.length - 1}
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {task.attached_document && (
          <View className="mt-2 flex-row items-center">
            <Ionicons
              name="document-attach-outline"
              size={14}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
            <ThemedText variant="muted" className="ml-1.5 text-xs">
              Есть прикрепленный документ
            </ThemedText>
          </View>
        )}

        <View className="mt-3 flex-row items-center justify-between border-t pt-3"
          style={{ borderTopColor: isDark ? '#1e293b' : '#e2e8f0' }}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="muted" className="ml-1.5 text-xs">
              {task.creator.first_name} {task.creator.surname}
            </ThemedText>
          </View>
          
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </ThemedCard>
    </Pressable>
  );
};

