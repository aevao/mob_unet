import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { SectionCard } from '../../shared/ui/SectionCard';
import type { HomeStackParamList } from '../../app/navigation/types';

type PersonalCardNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const PersonalCardScreen = () => {
  const navigation = useNavigation<PersonalCardNavigationProp>();

  const handlePersonalDataPress = () => {
    navigation.navigate('PersonalData');
  };

  const handleScientificActivityPress = () => {
    navigation.navigate('ScientificActivity');
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4 p-4">
          <ThemedText variant="title" className="mb-3 text-lg font-bold">
            Разделы
          </ThemedText>

          <View className="gap-1">
            {/* Персональные данные */}
            <SectionCard
              title="Персональные данные"
              icon="person-outline"
              description="Просмотр и редактирование личной информации"
              onPress={handlePersonalDataPress}
            />

            {/* Научная деятельность */}
            <SectionCard
              title="Научная деятельность"
              icon="school-outline"
              description="Публикации, исследования и научные достижения"
              onPress={handleScientificActivityPress}
            />
          </View>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

