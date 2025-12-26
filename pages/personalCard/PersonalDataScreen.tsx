import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionCard } from '../../shared/ui/SectionCard';
import type { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList } from '../../app/navigation/types';
import { OfficialRankModal } from '../../widgets/personalCard/OfficialRankModal';
import { MedicalExaminationModal } from '../../widgets/personalCard/MedicalExaminationModal';
import { AwardModal } from '../../widgets/personalCard/AwardModal';
import { TrainingModal } from '../../widgets/personalCard/TrainingModal';

type PersonalDataNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface PersonalDataItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description?: string;
  isModal?: boolean;
}

const personalDataItems: PersonalDataItem[] = [
  {
    id: 'military',
    title: 'Воинский учет',
    icon: 'shield-outline',
    description: 'Информация о воинском учете и военной службе',
  },
  {
    id: 'residence',
    title: 'Место жительства',
    icon: 'location-outline',
    description: 'Адрес регистрации и фактического проживания',
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
    id: 'languages',
    title: 'Знание языков',
    icon: 'chatbubbles-outline',
    description: 'Изучаемые и известные иностранные языки',
  },
  {
    id: 'diplomatic',
    title: 'Дипломатический ранг',
    icon: 'ribbon-outline',
    description: 'Дипломатические звания и ранги',
    isModal: true,
  },
  {
    id: 'medical',
    title: 'Медосмотр',
    icon: 'medical-outline',
    description: 'Медицинские осмотры и справки о здоровье',
    isModal: true,
  },
  {
    id: 'awards',
    title: 'Награды',
    icon: 'trophy-outline',
    description: 'Награды, поощрения и достижения',
    isModal: true,
  },
  {
    id: 'qualification',
    title: 'Повышение квалификации',
    icon: 'trending-up-outline',
    description: 'Курсы повышения квалификации и переподготовка',
    isModal: true,
  },
];

export const PersonalDataScreen = () => {
  const navigation = useNavigation<PersonalDataNavigationProp>();
  const [officialRankVisible, setOfficialRankVisible] = useState(false);
  const [medicalExaminationVisible, setMedicalExaminationVisible] = useState(false);
  const [awardVisible, setAwardVisible] = useState(false);
  const [trainingVisible, setTrainingVisible] = useState(false);

  const handleItemPress = (item: PersonalDataItem) => {
    if (item.isModal) {
      switch (item.id) {
        case 'diplomatic':
          setOfficialRankVisible(true);
          break;
        case 'medical':
          setMedicalExaminationVisible(true);
          break;
        case 'awards':
          setAwardVisible(true);
          break;
        case 'qualification':
          setTrainingVisible(true);
          break;
      }
    } else {
      switch (item.id) {
        case 'military':
          navigation.navigate('MilitaryRegistration');
          break;
        case 'residence':
          navigation.navigate('ResidencePlace');
          break;
        case 'education':
          navigation.navigate('Education');
          break;
        case 'vacation':
          navigation.navigate('Vacation');
          break;
        case 'abroad':
          navigation.navigate('AbroadStay');
          break;
        case 'marital':
          navigation.navigate('Family');
          break;
        case 'work':
          navigation.navigate('Employment');
          break;
        case 'languages':
          navigation.navigate('Language');
          break;
      }
    }
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

      <OfficialRankModal
        visible={officialRankVisible}
        onClose={() => setOfficialRankVisible(false)}
      />
      <MedicalExaminationModal
        visible={medicalExaminationVisible}
        onClose={() => setMedicalExaminationVisible(false)}
      />
      <AwardModal
        visible={awardVisible}
        onClose={() => setAwardVisible(false)}
      />
      <TrainingModal
        visible={trainingVisible}
        onClose={() => setTrainingVisible(false)}
      />
    </ScreenContainer>
  );
};

