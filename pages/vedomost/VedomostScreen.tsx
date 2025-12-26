import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';

export const VedomostScreen = () => {
  return (
    <ScreenContainer>
      <AppScrollView showsVerticalScrollIndicator={false}>
        <View>
          <ThemedCard className="p-6">
            <ThemedText variant="title" className="mb-4 text-center text-xl font-bold">
              Ведомость
            </ThemedText>
            <ThemedText variant="body" className="text-center text-base opacity-70">
              Выставление оценок
            </ThemedText>
            <ThemedText variant="muted" className="mt-2 text-center text-sm opacity-50">
              Раздел в разработке
            </ThemedText>
          </ThemedCard>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

