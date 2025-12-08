import { useEffect } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { CertificateCard } from '../../widgets/certificate/CertificateCard';
import { CertificateSkeleton } from '../../widgets/certificate/CertificateSkeleton';
import { useCertificateStore } from '../../entities/certificate/model/certificateStore';
import type { Certificate } from '../../entities/certificate/model/types';

export const CertificatesScreen = () => {
  const { certificates, isLoading, error, fetchCertificates } = useCertificateStore();

  useEffect(() => {
    void fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCertificatePress = (certificate: Certificate) => {
    // TODO: В будущем здесь будет запрос на получение конкретной справки
    console.log('Certificate pressed:', certificate);
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Справки
          </ThemedText>

          {isLoading ? (
            <CertificateSkeleton />
          ) : error ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center text-red-400">
                {error}
              </ThemedText>
            </View>
          ) : certificates.length === 0 ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center">
                Справок пока нет
              </ThemedText>
            </View>
          ) : (
            <View>
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onPress={handleCertificatePress}
                />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};
