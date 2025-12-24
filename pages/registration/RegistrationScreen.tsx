import { useEffect } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SubjectCard } from '../../widgets/subject/SubjectCard';
import { SubjectSkeleton } from '../../widgets/subject/SubjectSkeleton';
import { useSubjectStore } from '../../entities/subject/model/subjectStore';
import type { Subject } from '../../entities/subject/model/types';

export const RegistrationScreen = () => {
  const { subjects, isLoading, error, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    void fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectStream = (subject: Subject) => {
    // TODO: Реализовать выбор потока
    
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText variant="title" className="mb-3 text-xl font-bold">
            Регистрация на дисциплины
          </ThemedText>

          {isLoading ? (
            <SubjectSkeleton />
          ) : error ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center text-red-400">
                {error}
              </ThemedText>
            </View>
          ) : subjects.length === 0 ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center">
                Нет доступных дисциплин
              </ThemedText>
            </View>
          ) : (
            <View>
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onSelectStream={handleSelectStream}
                />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

