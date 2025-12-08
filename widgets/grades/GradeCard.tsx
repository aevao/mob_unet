import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export interface GradeItem {
  id: string;
  subject: string;
  teacher: string;
  module1?: string | null;
  module2?: string | null;
  exam?: string | null;
  finalGrade?: string | null;
  attendance: string;
}

interface GradeCardProps {
  grade: GradeItem;
}

const getGradeColor = (grade: string | null | undefined, isDark: boolean) => {
  if (!grade) return isDark ? 'text-gray-400' : 'text-gray-500';
  const numGrade = parseFloat(grade);
  if (numGrade >= 4.5) {
    return isDark ? 'text-green-400' : 'text-green-600';
  }
  if (numGrade >= 3.5) {
    return isDark ? 'text-yellow-400' : 'text-yellow-600';
  }
  if (numGrade >= 2.5) {
    return isDark ? 'text-orange-400' : 'text-orange-600';
  }
  return isDark ? 'text-red-400' : 'text-red-600';
};

const getGradeBgColor = (grade: string | null | undefined, isDark: boolean) => {
  if (!grade) return isDark ? 'bg-gray-800' : 'bg-gray-100';
  const numGrade = parseFloat(grade);
  if (numGrade >= 4.5) {
    return isDark ? 'bg-green-600/20' : 'bg-green-50';
  }
  if (numGrade >= 3.5) {
    return isDark ? 'bg-yellow-600/20' : 'bg-yellow-50';
  }
  if (numGrade >= 2.5) {
    return isDark ? 'bg-orange-600/20' : 'bg-orange-50';
  }
  return isDark ? 'bg-red-600/20' : 'bg-red-50';
};

const getAttendanceColor = (attendance: string, isDark: boolean) => {
  const percent = parseInt(attendance.replace('%', ''));
  if (percent >= 90) {
    return isDark ? 'text-green-400' : 'text-green-600';
  }
  if (percent >= 75) {
    return isDark ? 'text-yellow-400' : 'text-yellow-600';
  }
  return isDark ? 'text-red-400' : 'text-red-600';
};

export const GradeCard = ({ grade }: GradeCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ThemedCard className="mb-3 p-4">
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1">
          <View className="mb-2 flex-row items-center gap-2">
            <View
              className={`h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}
            >
              <Ionicons
                name="school-outline"
                size={20}
                color={isDark ? '#60A5FA' : '#2563EB'}
              />
            </View>
            <View className="flex-1">
              <ThemedText variant="title" className="text-base font-bold">
                {grade.subject}
              </ThemedText>
            </View>
          </View>

          {grade.teacher && (
            <View className="mb-3 flex-row items-center">
              <Ionicons
                name="person-outline"
                size={14}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <ThemedText variant="muted" className="ml-1.5 text-xs">
                {grade.teacher}
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Модули и оценки */}
      <View className="mb-3 flex-row gap-2">
        {/* Модуль 1 */}
        {grade.module1 && (
          <View className="flex-1">
            <View
              className={`rounded-xl px-3 py-2.5 ${getGradeBgColor(grade.module1, isDark)}`}
            >
              <View className="mb-1 flex-row items-center gap-1.5">
                <Ionicons
                  name="document-text-outline"
                  size={12}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="label" className="text-[10px]">
                  Модуль 1
                </ThemedText>
              </View>
              <ThemedText
                variant="title"
                className={`text-lg font-bold ${getGradeColor(grade.module1, isDark)}`}
              >
                {grade.module1 || '—'}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Модуль 2 */}
        {grade.module2 && (
          <View className="flex-1">
            <View
              className={`rounded-xl px-3 py-2.5 ${getGradeBgColor(grade.module2, isDark)}`}
            >
              <View className="mb-1 flex-row items-center gap-1.5">
                <Ionicons
                  name="document-text-outline"
                  size={12}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="label" className="text-[10px]">
                  Модуль 2
                </ThemedText>
              </View>
              <ThemedText
                variant="title"
                className={`text-lg font-bold ${getGradeColor(grade.module2, isDark)}`}
              >
                {grade.module2 || '—'}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Экзамен */}
        {grade.exam && (
          <View className="flex-1">
            <View
              className={`rounded-xl px-3 py-2.5 ${getGradeBgColor(grade.exam, isDark)}`}
            >
              <View className="mb-1 flex-row items-center gap-1.5">
                <Ionicons
                  name="school-outline"
                  size={12}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="label" className="text-[10px]">
                  Экзамен
                </ThemedText>
              </View>
              <ThemedText
                variant="title"
                className={`text-lg font-bold ${getGradeColor(grade.exam, isDark)}`}
              >
                {grade.exam || '—'}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between gap-3">
        {/* Итоговая оценка */}
        {grade.finalGrade && (
          <View className="flex-1">
            <View
              className={`rounded-xl border-2 px-3 py-2.5 ${getGradeBgColor(grade.finalGrade, isDark)} ${
                isDark ? 'border-blue-500' : 'border-blue-600'
              }`}
            >
              <View className="mb-1 flex-row items-center gap-1.5">
                <Ionicons
                  name="trophy-outline"
                  size={14}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
                <ThemedText variant="label" className="text-xs font-semibold">
                  Итоговая
                </ThemedText>
              </View>
              <ThemedText
                variant="title"
                className={`text-xl font-bold ${getGradeColor(grade.finalGrade, isDark)}`}
              >
                {grade.finalGrade || '—'}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Посещаемость */}
        <View className="flex-1">
          <View
            className={`rounded-xl px-3 py-2.5 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <View className="mb-1 flex-row items-center gap-1.5">
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <ThemedText variant="label" className="text-xs">
                Посещаемость
              </ThemedText>
            </View>
            <ThemedText
              variant="title"
              className={`text-xl font-bold ${getAttendanceColor(grade.attendance, isDark)}`}
            >
              {grade.attendance}
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedCard>
  );
};

