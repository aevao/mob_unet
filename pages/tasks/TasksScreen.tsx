import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';

export const TasksScreen = () => {
  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Задачи
          </ThemedText>

          <View className="py-8">
            <ThemedText variant="muted" className="text-center">
              Раздел в разработке
            </ThemedText>
          </View>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

