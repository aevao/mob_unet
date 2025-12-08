import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppFlatList } from '../../shared/ui/AppFlatList';
import { ThemedText } from '../../shared/ui/ThemedText';

type GradeItem = {
  id: string;
  subject: string;
  teacher: string;
  grade: string;
  attendance: string;
};

const MOCK_GRADES: GradeItem[] = [
  {
    id: '1',
    subject: 'Математический анализ',
    teacher: 'Иванов И.И.',
    grade: '4.5',
    attendance: '90%',
  },
  {
    id: '2',
    subject: 'Программирование',
    teacher: 'Петров П.П.',
    grade: '5.0',
    attendance: '100%',
  },
  {
    id: '3',
    subject: 'Физика',
    teacher: 'Сидорова А.А.',
    grade: '4.0',
    attendance: '80%',
  },
];

export const GradesScreen = () => {
  return (
    <ScreenContainer>
      <View className="flex-1 px-4 py-3">
        <ThemedText variant="title" className="mb-3 text-xl font-semibold">
          Успеваемость
        </ThemedText>
        <AppFlatList
        data={MOCK_GRADES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-xl bg-white p-3 shadow-sm">
            <ThemedText variant="body" className="text-base font-semibold">
              {item.subject}
            </ThemedText>
            <ThemedText variant="muted" className="mt-1 text-xs">
              Преподаватель: {item.teacher}
            </ThemedText>
            <View className="mt-2 flex-row justify-between">
              <ThemedText variant="body" className="text-sm">
                Средний балл: {item.grade}
              </ThemedText>
              <ThemedText variant="muted" className="text-sm">
                Посещаемость: {item.attendance}
              </ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <ThemedText variant="muted" className="mt-4 text-center text-sm">
            Пока нет данных об успеваемости.
          </ThemedText>
        }
      />
      </View>
    </ScreenContainer>
  );
};


