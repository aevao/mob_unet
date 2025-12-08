import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';

export const ApplicationsScreen = () => {
  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText variant="title" className="mb-4 text-2xl font-bold">
            Заявления
          </ThemedText>

          <ThemedCard className="p-4">
            <ThemedText variant="body" className="text-center">
              Здесь будет список заявлений
            </ThemedText>
          </ThemedCard>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

