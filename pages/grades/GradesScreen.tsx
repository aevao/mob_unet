import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { GradeCard } from '../../widgets/grades/GradeCard';
import { GradeSkeleton } from '../../widgets/grades/GradeSkeleton';
import type { GradeItem } from '../../widgets/grades/GradeCard';

const MOCK_GRADES: GradeItem[] = [
  {
    id: '1',
    subject: 'Математический анализ',
    teacher: 'Иванов И.И.',
    module1: '4.5',
    module2: '4.0',
    exam: '5.0',
    finalGrade: '4.5',
    attendance: '90%',
  },
  {
    id: '2',
    subject: 'Программирование',
    teacher: 'Петров П.П.',
    module1: '5.0',
    module2: '5.0',
    exam: '5.0',
    finalGrade: '5.0',
    attendance: '100%',
  },
  {
    id: '3',
    subject: 'Физика',
    teacher: 'Сидорова А.А.',
    module1: '4.0',
    module2: '3.5',
    exam: '4.5',
    finalGrade: '4.0',
    attendance: '80%',
  },
  {
    id: '4',
    subject: 'Английский язык',
    teacher: 'Козлова М.В.',
    module1: '3.5',
    module2: '3.0',
    exam: null,
    finalGrade: null,
    attendance: '75%',
  },
];

export const GradesScreen = () => {
  const isLoading = false; // TODO: Заменить на реальное состояние загрузки

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Успеваемость
          </ThemedText>

          {isLoading ? (
            <GradeSkeleton />
          ) : MOCK_GRADES.length === 0 ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center">
                Пока нет данных об успеваемости
              </ThemedText>
            </View>
          ) : (
            <View>
              {MOCK_GRADES.map((grade) => (
                <GradeCard key={grade.id} grade={grade} />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};
