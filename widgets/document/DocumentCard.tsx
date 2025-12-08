import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { Document } from '../../entities/document/model/types';

interface DocumentCardProps {
  document: Document;
  onPress?: (document: Document) => void;
}

export const DocumentCard = ({ document, onPress }: DocumentCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const getStatusColor = (status: string) => {
    if (status === 'Завершена') {
      return isDark ? 'text-green-400' : 'text-green-600';
    }
    return isDark ? 'text-blue-400' : 'text-blue-600';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Завершена') {
      return 'checkmark-circle';
    }
    return 'time-outline';
  };

  return (
    <Pressable onPress={() => onPress?.(document)}>
      <ThemedCard className="mb-3 p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="mb-2 flex-row items-center gap-2">
              <View
                className={`h-10 w-10 items-center justify-center rounded-xl ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-base font-bold">
                  {document.type_doc}
                </ThemedText>
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  {document.number}
                </ThemedText>
              </View>
            </View>

            <ThemedText variant="body" className="mb-2 text-sm leading-5">
              {document.type}
            </ThemedText>

            <View className="mt-2 flex-row items-center gap-4">
              <View className="flex-row items-center">
                <Ionicons
                  name={getStatusIcon(document.status)}
                  size={14}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText
                  variant="muted"
                  className={`ml-1.5 text-xs ${getStatusColor(document.status)}`}
                >
                  {document.status}
                </ThemedText>
              </View>

              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="muted" className="ml-1.5 text-xs">
                  {document.date_zayavki}
                </ThemedText>
              </View>
            </View>

            {document.employee && (
              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="person-outline"
                  size={14}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText variant="muted" className="ml-1.5 text-xs">
                  {document.employee.first_name} {document.employee.surname}
                </ThemedText>
              </View>
            )}

            {!document.is_watched && (
              <View className="mt-2">
                <View
                  className={`self-start rounded-full px-2 py-0.5 ${
                    isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}
                >
                  <ThemedText
                    variant="muted"
                    className={`text-[10px] font-semibold ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    Новое
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </ThemedCard>
    </Pressable>
  );
};

