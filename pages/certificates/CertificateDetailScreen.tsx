import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Linking, Pressable, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchCertificateDetail } from '../../entities/certificate/api/certificateApi';
import type { CertificateDetail } from '../../entities/certificate/model/types';
import type { HomeStackParamList } from '../../app/navigation/types';

type CertificateDetailScreenRouteProp = RouteProp<HomeStackParamList, 'CertificateDetail'>;

export const CertificateDetailScreen = () => {
  const route = useRoute<CertificateDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const referenceId = route.params?.referenceId;
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (referenceId) {
      void loadCertificate();
    }
  }, [referenceId]);

  const loadCertificate = async () => {
    if (!referenceId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCertificateDetail(referenceId);
      setCertificate(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Не удалось загрузить справку';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    if (certificate?.file) {
      try {
        await Linking.openURL(certificate.file);
      } catch (err) {
        console.error('Failed to open PDF:', err);
      }
    }
  };

  const handleDownloadPdf = async () => {
    if (!certificate?.file) return;

    setIsDownloading(true);
    try {
      const fileUri = `${FileSystem.documentDirectory}${certificate.service_name.replace(/\s+/g, '_')}.pdf`;

      const downloadResult = await FileSystem.downloadAsync(certificate.file, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        // Если Sharing недоступен, открываем файл
        await Linking.openURL(downloadResult.uri);
      }
    } catch (err) {
      console.error('Failed to download PDF:', err);
      setError('Не удалось скачать файл');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
          <ThemedText variant="muted" className="mt-4">
            Загрузка справки...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !certificate) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={isDark ? '#EF4444' : '#DC2626'}
          />
          <ThemedText variant="muted" className="mt-4 text-center text-red-400">
            {error || 'Справка не найдена'}
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1 p-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Info */}
        <ThemedCard className="mb-4 p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <View className="mb-3 flex-row items-center gap-3">

                <ThemedText variant="title" className={`mb-1 text-lg font-bold`} >
                  {certificate.service_name}
                </ThemedText>
              </View>

              {certificate.number_reference && (
                <ThemedText variant="muted" className="text-sm">
                  № {certificate.number_reference}
                </ThemedText>
              )}
            </View>
          </View>

          <View className="mb-3 flex-row items-center">
            <Ionicons
              name="time-outline"
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="muted" className="ml-2 text-sm">
              {certificate.created_at}
            </ThemedText>
          </View>

          {certificate.organ && (
            <View className="mb-3 flex-row items-center">
              <Ionicons
                name="business-outline"
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <ThemedText variant="muted" className="ml-2 text-sm">
                {certificate.organ}
              </ThemedText>
            </View>
          )}

          {certificate.user_fullname && (
            <View className="flex-row items-center">
              <Ionicons
                name="person-outline"
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <ThemedText variant="muted" className="ml-2 text-sm">
                {certificate.user_fullname}
              </ThemedText>
            </View>
          )}
        </ThemedCard>

        {/* PDF Viewer */}
        {certificate.file && (
          <ThemedCard className="mb-4 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <ThemedText variant="title" className="text-base font-bold">
                Документ PDF
              </ThemedText>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleOpenPdf}
                  disabled={isDownloading}
                  className={`flex-row items-center rounded-lg px-3 py-2 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                    } ${isDownloading ? 'opacity-50' : ''}`}
                >
                  {isDownloading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={16}
                        color={isDark ? '#60A5FA' : '#2563EB'}
                      />
                      <ThemedText className={`ml-2 text-sm font-semibold ${isDark ? 'text-[#60A5FA]' : 'text-[#2563EB]'}`}>
                        Скачать
                      </ThemedText>
                    </>
                  )}
                </Pressable>

              </View>
            </View>

            <View
              className={`overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              style={{ height: 500 }}
            >
              <WebView
                source={{ uri: certificate.file }}
                style={{ backgroundColor: 'transparent' }}
                startInLoadingState
                renderLoading={() => (
                  <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
                  </View>
                )}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('WebView error: ', nativeEvent);
                }}
              />
            </View>
          </ThemedCard>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

