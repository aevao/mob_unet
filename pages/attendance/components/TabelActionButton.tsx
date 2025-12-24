import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

interface TabelActionButtonProps {
  isTodayCompleted: boolean;
  hasActiveTabel: boolean;
  isFinishing: boolean;
  onMarkPress: () => void;
  onFinishPress: () => void;
}

export const TabelActionButton = ({
  isTodayCompleted,
  hasActiveTabel,
  isFinishing,
  onMarkPress,
  onFinishPress,
}: TabelActionButtonProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (isTodayCompleted) {
    return (
      <Pressable
        disabled={true}
        className={`mb-4 flex-row items-center justify-center rounded-xl border p-4 opacity-50 ${
          isDark
            ? 'bg-gray-800/20 border-gray-600/50'
            : 'bg-gray-100 border-gray-300'
        }`}
      >
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={isDark ? '#10B981' : '#059669'}
        />
        <ThemedText
          variant="body"
          className={`ml-2 text-base font-semibold ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}
        >
          Завершен
        </ThemedText>
      </Pressable>
    );
  }

  if (hasActiveTabel) {
    return (
      <Pressable
        onPress={onFinishPress}
        disabled={isFinishing}
        className={`mb-4 flex-row items-center justify-center rounded-xl border p-4 ${
          isDark
            ? 'bg-green-900/20 border-green-500/50'
            : 'bg-green-50 border-green-300'
        } ${isFinishing ? 'opacity-50' : ''}`}
      >
        {isFinishing ? (
          <ActivityIndicator color={isDark ? '#10B981' : '#059669'} />
        ) : (
          <>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={isDark ? '#10B981' : '#059669'}
            />
            <ThemedText
              variant="body"
              className={`ml-2 text-base font-semibold ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}
            >
              Завершить
            </ThemedText>
          </>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onMarkPress}
      className={`mb-4 flex-row items-center justify-center rounded-xl border p-4 ${
        isDark
          ? 'bg-blue-900/20 border-blue-500/50'
          : 'bg-blue-50 border-blue-300'
      }`}
    >
      <Ionicons
        name="qr-code-outline"
        size={24}
        color={isDark ? '#60A5FA' : '#2563EB'}
      />
      <ThemedText
        variant="body"
        className={`ml-2 text-base font-semibold ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}
      >
        Отметиться
      </ThemedText>
    </Pressable>
  );
};

