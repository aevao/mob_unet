import { Pressable, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OptimizedImage } from '../../../shared/ui/OptimizedImage';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

interface AvatarEditorProps {
  avatarUrl: string | null;
  onPress: () => void;
  isUploading?: boolean;
}

export const AvatarEditor = ({ avatarUrl, onPress, isUploading = false }: AvatarEditorProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      disabled={isUploading}
      className="active:opacity-80"
    >
      <View
        className={`relative h-24 w-24 overflow-hidden rounded-full border-4 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <OptimizedImage
          uri={avatarUrl}
          style={{ width: 96, height: 96 }}
          resizeMode="cover"
          fallbackIcon="person"
          showLoadingIndicator={false}
        />
        
        {/* Overlay для редактирования */}
        <View
          className={`absolute inset-0 items-center justify-center ${
            isDark ? 'bg-black/50' : 'bg-black/40'
          }`}
        >
          
        </View>
      </View>
    </Pressable>
  );
};

