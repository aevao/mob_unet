import { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, ImageStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../entities/theme/model/themeStore';

interface OptimizedImageProps {
  uri: string | null | undefined;
  defaultUri?: string;
  style?: StyleProp<ImageStyle>;
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  showLoadingIndicator?: boolean;
}

export const OptimizedImage = ({
  uri,
  defaultUri = 'https://uadmin.kstu.kg/media/avatars/default.jpg',
  style,
  className,
  resizeMode = 'cover',
  fallbackIcon = 'person',
  showLoadingIndicator = true,
}: OptimizedImageProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(uri || null);

  // Обновляем URI при изменении пропса
  useEffect(() => {
    if (uri !== currentUri) {
      setCurrentUri(uri || null);
      setIsLoading(true);
      setHasError(false);
    }
  }, [uri]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    // Если основное изображение не загрузилось, пробуем загрузить дефолтное
    if (currentUri !== defaultUri) {
      setCurrentUri(defaultUri);
      setHasError(false);
      setIsLoading(true);
    }
  };

  // Если нет URI или ошибка после всех попыток
  if (!currentUri || (hasError && currentUri === defaultUri)) {
    return (
      <View
        className={className}
        style={[
          style,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
          },
        ]}
      >
        <Ionicons
          name={fallbackIcon}
          size={typeof style === 'object' && 'width' in style && typeof style.width === 'number'
            ? style.width / 2
            : 32}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>
    );
  }

  return (
    <View style={style} className={className}>
      {isLoading && showLoadingIndicator && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            zIndex: 1,
          }}
        >
          <ActivityIndicator size="small" color={isDark ? '#60A5FA' : '#2563EB'} />
        </View>
      )}
      <Image
        source={{ uri: currentUri }}
        style={style}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
    </View>
  );
};

