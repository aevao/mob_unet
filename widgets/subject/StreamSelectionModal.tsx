import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { AppButton } from '../../shared/ui/AppButton';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchSubjectStreams } from '../../entities/subject/api/streamApi';
import type { Stream } from '../../entities/subject/model/streamTypes';
import { StreamSelect } from './StreamSelect';

interface StreamSelectionModalProps {
  visible: boolean;
  subjectId: number;
  subjectName: string;
  onClose: () => void;
  onSelectStream?: (stream: Stream) => void;
}

export const StreamSelectionModal = ({
  visible,
  subjectId,
  subjectName,
  onClose,
  onSelectStream,
}: StreamSelectionModalProps) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStreams, setSelectedStreams] = useState<{
    lecture?: Stream;
    practice?: Stream;
    lab?: Stream;
  }>({});
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (visible && subjectId) {
      void loadStreams();
    } else {
      setStreams([]);
      setSelectedStreams({});
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, subjectId]);

  const loadStreams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSubjectStreams(subjectId);
      setStreams(data);
      // Предустановить уже зарегистрированные потоки
      const registered: { lecture?: Stream; practice?: Stream; lab?: Stream } = {};
      data.forEach((stream) => {
        if (stream.is_registered) {
          if (stream.stream_type === 'Лекционный') {
            registered.lecture = stream;
          } else if (stream.stream_type === 'Практический') {
            registered.practice = stream;
          } else if (stream.stream_type === 'Лабораторный') {
            registered.lab = stream;
          }
        }
      });
      setSelectedStreams(registered);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Не удалось загрузить потоки';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStream = (stream: Stream) => {
    const newSelected = { ...selectedStreams };
    if (stream.stream_type === 'Лекционный') {
      newSelected.lecture = stream;
    } else if (stream.stream_type === 'Практический') {
      newSelected.practice = stream;
    } else if (stream.stream_type === 'Лабораторный') {
      newSelected.lab = stream;
    }
    setSelectedStreams(newSelected);
  };

  const handleConfirm = () => {
    // TODO: Отправить выбранные потоки на сервер

    const firstSelected = selectedStreams.lecture || selectedStreams.practice || selectedStreams.lab;
    if (firstSelected) {
      onSelectStream?.(firstSelected);
    }
    onClose();
  };

  const lectureStreams = streams.filter((s) => s.stream_type === 'Лекционный');
  const practiceStreams = streams.filter((s) => s.stream_type === 'Практический');
  const labStreams = streams.filter((s) => s.stream_type === 'Лабораторный');

  const hasRequiredSelections =
    (lectureStreams.length === 0 || selectedStreams.lecture) &&
    (practiceStreams.length === 0 || selectedStreams.practice) &&
    (labStreams.length === 0 || selectedStreams.lab);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-4"
        onPress={onClose}
      >
        <View
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
        >
          <ThemedCard className="max-w-md w-[350]  rounded-3xl p-5">
            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-1">
                <ThemedText variant="title" className="text-xl font-bold">
                  Выбор потоков
                </ThemedText>
                <ThemedText variant="muted" className="mt-1 text-sm">
                  {subjectName}
                </ThemedText>
              </View>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
              </Pressable>
            </View>

            {isLoading ? (
              <View className="py-12">
                <ThemedText variant="muted" className="text-center">
                  Загрузка потоков...
                </ThemedText>
              </View>
            ) : error ? (
              <View className="py-12">
                <View className="mb-3 items-center">
                  <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color={isDark ? '#EF4444' : '#DC2626'}
                  />
                </View>
                <ThemedText variant="muted" className="text-center text-red-400">
                  {error}
                </ThemedText>
              </View>
            ) : streams.length === 0 ? (
              <View className="py-12">
                <View className="mb-3 items-center">
                  <Ionicons
                    name="information-circle-outline"
                    size={48}
                    color={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
                <ThemedText variant="muted" className="text-center">
                  Потоки не найдены
                </ThemedText>
                <ThemedText variant="muted" className="mt-2 text-center text-xs">
                  Для этой дисциплины пока нет доступных потоков
                </ThemedText>
              </View>
            ) : (
              <View>
                <StreamSelect
                  label="Лекционный поток"
                  streams={lectureStreams}
                  selectedStream={selectedStreams.lecture}
                  onSelect={(stream) => handleSelectStream(stream)}
                  placeholder="Выберите лекционный поток"
                />

                <StreamSelect
                  label="Практический поток"
                  streams={practiceStreams}
                  selectedStream={selectedStreams.practice}
                  onSelect={(stream) => handleSelectStream(stream)}
                  placeholder="Выберите практический поток"
                />

                <StreamSelect
                  label="Лабораторный поток"
                  streams={labStreams}
                  selectedStream={selectedStreams.lab}
                  onSelect={(stream) => handleSelectStream(stream)}
                  placeholder="Выберите лабораторный поток"
                />
                {!isLoading && !error && streams.length > 0 && (
                  <View className="mt-6">
                    <AppButton
                      title="Подтвердить выбор"
                      onPress={handleConfirm}
                      disabled={!hasRequiredSelections}
                    />
                  </View>
                )}
              </View>
            )}

          </ThemedCard>
        </View>
      </Pressable>
    </Modal>
  );
};
