import { View } from 'react-native';
import { ThemedText } from '../../shared/ui/ThemedText';

interface WelcomeHeaderProps {
  fullName: string;
}

export const WelcomeHeader = ({ fullName }: WelcomeHeaderProps) => {
  return (
    <View className="mb-4">
      <ThemedText variant="title" className="text-2xl font-bold">
        Добро пожаловать!
      </ThemedText>
      <ThemedText variant="muted" className="mt-1 text-sm">
        {fullName}
      </ThemedText>
    </View>
  );
};

