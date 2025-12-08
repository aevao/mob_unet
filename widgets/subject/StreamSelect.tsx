import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { Stream } from '../../entities/subject/model/streamTypes';

interface StreamSelectProps {
  label: string;
  streams: Stream[];
  selectedStream: Stream | undefined;
  onSelect: (stream: Stream) => void;
  placeholder?: string;
}

export const StreamSelect = ({
  label,
  streams,
  selectedStream,
  onSelect,
  placeholder = 'Выберите поток',
}: StreamSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (streams.length === 0) {
    return (
      <View className="mb-3">
        <ThemedText variant="label" className="mb-2 text-xs">
          {label}
        </ThemedText>
        <View
          className={`rounded-xl border px-4 py-3 ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <ThemedText variant="muted" className="text-sm">
            Нет доступных потоков
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-3">
      <ThemedText variant="label" className="mb-2 text-xs">
        {label}
      </ThemedText>
      <Pressable
        onPress={() => setIsOpen(true)}
        className={`rounded-xl border px-4 py-3 ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <View className="flex-row items-center justify-between">
          {selectedStream ? (
            <View className="flex-1">
              <ThemedText variant="body" className="text-sm font-semibold">
                Поток {selectedStream.number}
              </ThemedText>
              <ThemedText variant="muted" className="mt-0.5 text-xs">
                {selectedStream.teacher_name}
              </ThemedText>
            </View>
          ) : (
            <ThemedText variant="muted" className="text-sm">
              {placeholder}
            </ThemedText>
          )}
          <Ionicons
            name="chevron-down"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-4"
          onPress={() => setIsOpen(false)}
        >
          <View
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            <ThemedCard className="max-w-md p-4 w-[350]">
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText variant="title" className="text-base font-bold">
                  {label}
                </ThemedText>
                <Pressable onPress={() => setIsOpen(false)} hitSlop={8}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </Pressable>
              </View>

              <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
                {streams.map((stream) => {
                  const isFull = stream.students_count >= stream.capacity;
                  const isSelected = selectedStream?.id === stream.id;
                  const occupancy = Math.round((stream.students_count / stream.capacity) * 100);

                  return (
                    <Pressable
                      key={stream.id}
                      onPress={() => {
                        if (!isFull || stream.is_registered) {
                          onSelect(stream);
                          setIsOpen(false);
                        }
                      }}
                      disabled={isFull && !stream.is_registered}
                      className={`mb-2 rounded-xl border p-3 ${
                        isSelected
                          ? isDark
                            ? 'border-blue-600 bg-blue-600/20'
                            : 'border-blue-600 bg-blue-50'
                          : isDark
                            ? 'border-gray-700 bg-gray-800'
                            : 'border-gray-200 bg-white'
                      } ${isFull && !stream.is_registered ? 'opacity-50' : ''}`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <View className="mb-1 flex-row items-center gap-2">
                            <ThemedText variant="body" className="text-sm font-semibold">
                              Поток {stream.number}
                            </ThemedText>
                            {stream.is_registered && (
                              <View
                                className={`rounded-full px-1.5 py-0.5 ${
                                  isDark ? 'bg-green-600/20' : 'bg-green-500/20'
                                }`}
                              >
                                <ThemedText
                                  variant="muted"
                                  className="text-[10px] font-semibold text-green-600"
                                >
                                  Зарегистрирован
                                </ThemedText>
                              </View>
                            )}
                            {isFull && !stream.is_registered && (
                              <View
                                className={`rounded-full px-1.5 py-0.5 ${
                                  isDark ? 'bg-red-600/20' : 'bg-red-500/20'
                                }`}
                              >
                                <ThemedText
                                  variant="muted"
                                  className="text-[10px] font-semibold text-red-600"
                                >
                                  Заполнен
                                </ThemedText>
                              </View>
                            )}
                          </View>

                          <ThemedText variant="muted" className="mb-1 text-xs">
                            {stream.teacher_name}
                          </ThemedText>

                          <View className="flex-row items-center gap-3">
                            <View className="flex-row items-center gap-1">
                              <Ionicons
                                name="people-outline"
                                size={12}
                                color={isDark ? '#9CA3AF' : '#6B7280'}
                              />
                              <ThemedText variant="muted" className="text-xs">
                                {stream.students_count}/{stream.capacity} ({occupancy}%)
                              </ThemedText>
                            </View>
                            {stream.schedules.length > 0 && (
                              <View className="flex-row items-center gap-1">
                                <Ionicons
                                  name="time-outline"
                                  size={12}
                                  color={isDark ? '#9CA3AF' : '#6B7280'}
                                />
                                <ThemedText variant="muted" className="text-xs">
                                  {stream.schedules.length} занятий
                                </ThemedText>
                              </View>
                            )}
                          </View>
                        </View>

                        {isSelected && (
                          <View
                            className={`ml-2 h-6 w-6 items-center justify-center rounded-full ${
                              isDark ? 'bg-blue-600' : 'bg-blue-600'
                            }`}
                          >
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </ThemedCard>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

