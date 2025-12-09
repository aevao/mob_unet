import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionCard } from '../../shared/ui/SectionCard';
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';
import type { HomeStackParamList } from '../../app/navigation/types';

type SectionsListNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const SectionsList = () => {
  const navigation = useNavigation<SectionsListNavigationProp>();
  const { user } = useAuthStore();

  // Функция для переключения между табами
  const navigateToTab = (tabName: 'GradesTab' | 'ScheduleTab') => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(tabName);
    }
  };

  return (
    <View className="mb-4">
      <ThemedText variant="title" className="mb-3 text-lg font-bold">
        Разделы
      </ThemedText>

      <View className="gap-1">
        {/* Документооборот - для всех */}
        <SectionCard
          title="Документооборот"
          icon="document-text-outline"
          description="Электронный документооборот (заявления, рапорта)"
          onPress={() => {
            navigation.navigate('Documents');
          }}
        />

        {/* Регистрация на дисциплины - только для студентов */}
        {isSectionVisible(user?.role, ['student']) && (
          <SectionCard
            title="Регистрация на дисциплины"
            icon="book-outline"
            description="Выбор дисциплин и потоков"
            onPress={() => {
              navigation.navigate('Registration');
            }}
          />
        )}

        {/* Новости - для всех */}
        <SectionCard
          title="Новости"
          icon="newspaper-outline"
          description="Актуальные новости университета"
          onPress={() => {
            navigation.navigate('News');
          }}
        />

        {/* Справки - для всех */}
        <SectionCard
          title="Справки"
          icon="receipt-outline"
          description="Заказ и получение справок"
          onPress={() => {
            navigation.navigate('Certificates');
          }}
        />
      </View>
    </View>
  );
};

