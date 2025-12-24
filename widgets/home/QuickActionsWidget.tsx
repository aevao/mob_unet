import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { isSectionVisible } from '../../shared/lib/roleUtils';
import type { HomeStackParamList } from '../../app/navigation/types';

type QuickActionsNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface QuickAction {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof HomeStackParamList;
  roles?: string[];
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Новости',
    icon: 'newspaper-outline',
    route: 'News',
  },
  {
    title: 'Справки',
    icon: 'receipt-outline',
    route: 'Certificates',
  },
  {
    title: 'Документы',
    icon: 'document-text-outline',
    route: 'Documents',
  },
];

export const QuickActionsWidget = () => {
  const navigation = useNavigation<QuickActionsNavigationProp>();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const visibleActions = QUICK_ACTIONS.filter((action) => {
    if (action.roles) {
      return isSectionVisible(user?.role, action.roles);
    }
    return true;
  });

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <ThemedText variant="title" className="mb-3 text-lg font-bold">
        Быстрые действия
      </ThemedText>
      <View className="flex-row flex-wrap gap-2">
        {visibleActions.map((action) => (
          <Pressable
            key={action.route}
            onPress={() => navigation.navigate(action.route)}
            className="flex-1 min-w-[30%]"
          >
            <ThemedCard className="items-center p-4">
              <View
                className={`mb-2 h-12 w-12 items-center justify-center rounded-xl ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
              >
                <Ionicons
                  name={action.icon}
                  size={24}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <ThemedText variant="body" className="text-center text-xs font-semibold">
                {action.title}
              </ThemedText>
            </ThemedCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

