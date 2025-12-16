import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';

export const ScientificActivityScreen = () => {
  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Научная деятельность
          </ThemedText>
          <ThemedText variant="body" className="text-base">
            Раздел в разработке
          </ThemedText>
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

