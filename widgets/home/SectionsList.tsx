import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionCard } from '../../shared/ui/SectionCard';
import type { HomeStackParamList } from '../../app/navigation/types';

type SectionsListNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const SectionsList = () => {
  const navigation = useNavigation<SectionsListNavigationProp>();

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
        <SectionCard
          title="Документооборот"
          icon="document-text-outline"
          description="Электронный документооборот (заявления, рапорта)"
          onPress={() => {
            navigation.navigate('Documents');
          }}
        />
        <SectionCard
          title="Регистрация на дисциплины"
          icon="book-outline"
          description="Выбор дисциплин и потоков"
          onPress={() => {
            navigation.navigate('Registration');
          }}
        />

        <SectionCard
          title="Новости"
          icon="newspaper-outline"
          description="Актуальные новости университета"
          onPress={() => {
            navigation.navigate('News');
          }}
        />

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

