import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionTile } from '../../shared/ui/SectionTile';
import { isSectionVisible, type RoleType } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';
import type { HomeStackParamList } from '../../app/navigation/types';

type SectionsGridNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface Section {
  title: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  description: string;
  route: keyof HomeStackParamList;
  roles?: RoleType[];
  color?: string;
}

const SECTIONS: Section[] = [
  
  {
    title: 'Регистрация',
    icon: 'book-outline',
    description: 'Выбор дисциплин',
    route: 'Registration',
    roles: ['student'],
    color: '#60A5FA', // Мягкий синий
  },
 
  {
    title: 'Новости',
    icon: 'newspaper-outline',
    description: 'Актуальные новости',
    route: 'News',
    color: '#60A5FA', // Мягкий синий
  },
  {
    title: 'Справки',
    icon: 'receipt-outline',
    description: 'Заказ справок',
    route: 'Certificates',
    color: '#60A5FA', // Мягкий синий
  },


  {
    title: 'Личная карточка',
    icon: 'person-circle-outline',
    description: 'Персональные данные',
    route: 'PersonalCard',
    color: '#60A5FA', // Мягкий синий
  },
  {
    title: 'Учет времени',
    icon: 'calendar-outline',
    description: 'Отметка посещаемости',
    route: 'Tab',
    color: '#60A5FA', // Мягкий синий
  },
  {
    title: 'Журнал',
    icon: 'book-outline',
    description: 'Посещаемость студентов',
    route: 'ElectronicJournal',
    color: '#60A5FA', // Мягкий синий
    roles: ['employee'],
  },
  {
    title: 'Документооборот',
    icon: 'document-text-outline',
    description: 'Электронный документооборот',
    route: 'Documents',
    color: '#60A5FA', // Мягкий синий
  },
  {
    title: 'Ведомость',
    icon: 'list-outline',
    description: 'Выставление оценок',
    route: 'Vedomost',
    roles: ['employee'],
    color: '#60A5FA', // Мягкий синий
  },
];

export const SectionsGrid = () => {
  const navigation = useNavigation<SectionsGridNavigationProp>();
  const { user } = useAuthStore();

  const visibleSections = SECTIONS.filter((section) => {
    if (section.roles) {
      return isSectionVisible(user?.role, section.roles);
    }
    return true;
  });

  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {visibleSections.map((section, index) => (
          <View key={section.route} className='w-[48%]'>
            <SectionTile
              title={section.title}
              icon={section.icon}
              description={section.description}
              color={section.color}
              onPress={() => {
                navigation.navigate(section.route as any);
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

