import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { DayOfWeek } from '../../entities/schedule/model/types';
import { DAY_LABELS, DAY_KEYS } from '../../entities/schedule/model/types';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
}

export const DaySelector = ({ selectedDay, onSelectDay }: DaySelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleSelectDay = (day: DayOfWeek) => {
    onSelectDay(day);
    setIsModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className={`mb-4 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
          isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}
      >
        <ThemedText variant="body" className="text-base font-semibold">
          {DAY_LABELS[selectedDay]}
        </ThemedText>
        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6 "
          onPress={() => setIsModalVisible(false)}
        >
          <View
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            <ThemedCard className="w-full p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText variant="title" className="text-lg font-bold">
                  Выберите день
                </ThemedText>
                <Pressable onPress={() => setIsModalVisible(false)} hitSlop={8}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </Pressable>
              </View>

              <View className="gap-2 w-[320px]">
                {DAY_KEYS.map((day) => {
                  const isSelected = day === selectedDay;
                  return (
                    <Pressable
                      key={day}
                      onPress={() => handleSelectDay(day)}
                      className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
                        isSelected
                          ? isDark
                            ? 'border-blue-600 bg-blue-600/20'
                            : 'border-blue-600 bg-blue-50'
                          : isDark
                            ? 'border-gray-700 bg-gray-800'
                            : 'border-gray-200 bg-white'
                      }`}
                    >
                      <ThemedText
                        variant="body"
                        className={`text-base font-medium ${
                          isSelected && !isDark ? 'text-blue-600' : ''
                        }`}
                      >
                        {DAY_LABELS[day]}
                      </ThemedText>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={isDark ? '#60A5FA' : '#2563EB'}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ThemedCard>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

