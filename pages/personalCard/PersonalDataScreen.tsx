import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionCard } from '../../shared/ui/SectionCard';
import type { Ionicons } from '@expo/vector-icons';

interface PersonalDataItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description?: string;
}

const personalDataItems: PersonalDataItem[] = [
  {
    id: 'military',
    title: 'Воинский учет',
    icon: 'shield-outline',
    description: 'Информация о воинском учете и военной службе',
  },
  {
    id: 'diplomatic',
    title: 'Дипломатический ранг',
    icon: 'ribbon-outline',
    description: 'Дипломатические звания и ранги',
  },
  {
    id: 'medical',
    title: 'Медосмотр',
    icon: 'medical-outline',
    description: 'Медицинские осмотры и справки о здоровье',
  },
  {
    id: 'residence',
    title: 'Место жительства',
    icon: 'location-outline',
    description: 'Адрес регистрации и фактического проживания',
  },
  {
    id: 'awards',
    title: 'Награды',
    icon: 'trophy-outline',
    description: 'Награды, поощрения и достижения',
  },
  {
    id: 'education',
    title: 'Образование',
    icon: 'school-outline',
    description: 'Образовательные учреждения и дипломы',
  },
  {
    id: 'vacation',
    title: 'Отпуск',
    icon: 'calendar-outline',
    description: 'График отпусков и заявки на отпуск',
  },
  {
    id: 'abroad',
    title: 'Прибывание за границей',
    icon: 'airplane-outline',
    description: 'Командировки и поездки за границу',
  },
  {
    id: 'marital',
    title: 'Семейное положение',
    icon: 'heart-outline',
    description: 'Семейный статус и информация о семье',
  },
  {
    id: 'work',
    title: 'Трудовая деятельность',
    icon: 'briefcase-outline',
    description: 'Трудовой стаж и история работы',
  },
  {
    id: 'staffing',
    title: 'Штатное расписание',
    icon: 'document-text-outline',
    description: 'Должность и штатная единица',
  },
  {
    id: 'qualification',
    title: 'Повышение квалификации',
    icon: 'trending-up-outline',
    description: 'Курсы повышения квалификации и переподготовка',
  },
  {
    id: 'languages',
    title: 'Знание языков',
    icon: 'chatbubbles-outline',
    description: 'Изучаемые и известные иностранные языки',
  },
  {
    id: 'personal',
    title: 'Персональные данные',
    icon: 'person-outline',
    description: 'Основная личная информация',
  },
];

export const PersonalDataScreen = () => {
  const handleItemPress = (item: PersonalDataItem) => {
    // TODO: Навигация к конкретному разделу
    console.log(`Открыть: ${item.title}`);
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4 p-1">
          <ThemedText variant="title" className="mb-3 text-lg font-bold">
            Разделы
          </ThemedText>

          <View className="gap-1">
            {personalDataItems.map((item) => (
              <SectionCard
                key={item.id}
                title={item.title}
                icon={item.icon}
                description={item.description}
                onPress={() => handleItemPress(item)}
              />
            ))}
          </View>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

