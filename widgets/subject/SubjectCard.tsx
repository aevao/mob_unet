import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { Subject } from '../../entities/subject/model/types';
import { StreamSelectionModal } from './StreamSelectionModal';
import { useState } from 'react';

interface SubjectCardProps {
  subject: Subject;
  onSelectStream?: (subject: Subject) => void;
}

export const SubjectCard = ({ subject, onSelectStream }: SubjectCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const hasStreams = subject.lecture || subject.practice || subject.lab;

  return (
    <ThemedCard className={`mb-2 p-3 ${!subject.active ? 'opacity-60' : ''}`}>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        className="mb-2 flex-row items-center"
      >
        <View
          className={`mr-2 h-8 w-8 items-center justify-center rounded-lg ${
            isDark ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}
        >
          <Ionicons
            name="school-outline"
            size={16}
            color={isDark ? '#60A5FA' : '#2563EB'}
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <ThemedText variant="label" className="text-[10px] uppercase">
              Дисциплина:
            </ThemedText>
            {subject.active && (
              <View className={`rounded-full px-1.5 py-0.5 ${isDark ? 'bg-blue-600/20' : 'bg-blue-500/20'}`}>
                <ThemedText variant="muted" className="text-[9px] font-semibold text-blue-600">
                  Активна
                </ThemedText>
              </View>
            )}
            {!subject.active && (
              <View className={`rounded-full px-1.5 py-0.5 ${isDark ? 'bg-gray-600/20' : 'bg-gray-500/20'}`}>
                <ThemedText variant="muted" className="text-[9px] font-semibold text-gray-500">
                  Неактивна
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText variant="body" className="text-sm font-semibold">
            {subject.name_subject}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}
          className={`ml-2 h-8 w-8 items-center justify-center rounded-lg ${
             isDark
                ? 'bg-blue-900/30'
                : 'bg-blue-50'
          }`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={ isDark ? '#60A5FA' : '#2563EB'}
          />
        </Pressable>
      </Pressable>

      <View className="mb-1.5 flex-row items-center">
        <Ionicons
          name="clipboard-outline"
          size={14}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
        <ThemedText variant="body" className="ml-1.5 text-xs">
          Форма контроля/ <ThemedText variant="body" className="font-semibold">{subject.control_form}</ThemedText>
        </ThemedText>
      </View>

      <View className={`my-2 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

      {subject.lecture && (
        <View className="mb-2">
          <View className="mb-1 flex-row items-center">
            <Ionicons
              name="book-outline"
              size={14}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="body" className="ml-1.5 text-xs">
              Лекционный:
            </ThemedText>
            <ThemedText variant="muted" className="ml-1 text-xs">
              {subject.lecture.number}
            </ThemedText>
            {subject.lecture.teacher_name && (
              <>
                <ThemedText variant="muted" className="mx-1 text-xs">•</ThemedText>
                <ThemedText variant="muted" className="text-xs">
                  {subject.lecture.teacher_name}
                </ThemedText>
              </>
            )}
          </View>
        </View>
      )}

      {subject.practice && (
        <View className="mb-2">
          <View className="mb-1 flex-row items-center">
            <Ionicons
              name="construct-outline"
              size={14}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="body" className="ml-1.5 text-xs">
              Практический:
            </ThemedText>
            <ThemedText variant="muted" className="ml-1 text-xs">
              {subject.practice.number}
            </ThemedText>
            {subject.practice.teacher_name && (
              <>
                <ThemedText variant="muted" className="mx-1 text-xs">•</ThemedText>
                <ThemedText variant="muted" className="text-xs">
                  {subject.practice.teacher_name}
                </ThemedText>
              </>
            )}
          </View>
        </View>
      )}

      {subject.lab && (
        <View className="mb-2">
          <View className="mb-1 flex-row items-center">
            <Ionicons
              name="flask-outline"
              size={14}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="body" className="ml-1.5 text-xs">
              Лабораторный:
            </ThemedText>
            <ThemedText variant="muted" className="ml-1 text-xs">
              {subject.lab.number}
            </ThemedText>
            {subject.lab.teacher_name && (
              <>
                <ThemedText variant="muted" className="mx-1 text-xs">•</ThemedText>
                <ThemedText variant="muted" className="text-xs">
                  {subject.lab.teacher_name}
                </ThemedText>
              </>
            )}
          </View>
        </View>
      )}

      {!hasStreams && (
        <View className="mb-2">
          <ThemedText variant="muted" className="text-center text-xs">
            Потоки не назначены
          </ThemedText>
        </View>
      )}

      <StreamSelectionModal
        visible={modalVisible}
        subjectId={subject.id}
        subjectName={subject.name_subject}
        onClose={() => setModalVisible(false)}
        onSelectStream={(stream) => {
          onSelectStream?.(subject);
          setModalVisible(false);
        }}
      />
    </ThemedCard>
  );
};

