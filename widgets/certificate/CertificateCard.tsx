import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { Certificate } from '../../entities/certificate/model/types';

interface CertificateCardProps {
  certificate: Certificate;
  onPress?: (certificate: Certificate) => void;
}

export const CertificateCard = ({ certificate, onPress }: CertificateCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Pressable onPress={() => onPress?.(certificate)}>
      <ThemedCard className="mb-3 p-4">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1">
            <View className="mb-2 flex-row items-center gap-2">
              <View
                className={`h-10 w-10 items-center justify-center rounded-xl ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
              >
                <Ionicons
                  name="receipt-outline"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <View className="flex-1">
                <ThemedText variant="title" className="text-base font-bold">
                  {certificate.service_name}
                </ThemedText>
                {!certificate.relevant && (
                  <View
                    className={`mt-1 self-start rounded-full px-2 py-0.5 ${
                      isDark ? 'bg-gray-600/20' : 'bg-gray-500/20'
                    }`}
                  >
                    <ThemedText variant="muted" className="text-[10px] font-semibold text-gray-500">
                      Неактуально
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {certificate.description && (
              <ThemedText variant="body" className="mb-2 text-sm leading-5">
                {certificate.description}
              </ThemedText>
            )}

            <View className="mt-2 gap-1.5">
              {certificate.division_name && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="business-outline"
                    size={14}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText variant="muted" className="ml-1.5 text-xs">
                    {certificate.division_name}
                  </ThemedText>
                </View>
              )}

              {certificate.signer_name && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText variant="muted" className="ml-1.5 text-xs">
                    Подписывает: {certificate.signer_name}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </ThemedCard>
    </Pressable>
  );
};

