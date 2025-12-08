import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Linking, Pressable, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchDocumentDetail } from '../../entities/document/api/documentDetailApi';
import type { DocumentDetail } from '../../entities/document/model/detailTypes';
import type { HomeStackParamList } from '../../app/navigation/types';

type DocumentDetailScreenRouteProp = RouteProp<HomeStackParamList, 'DocumentDetail'>;

export const DocumentDetailScreen = () => {
  const route = useRoute<DocumentDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const documentId = route.params?.documentId;
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentId) {
      void loadDocument();
    }
  }, [documentId]);

  const loadDocument = async () => {
    if (!documentId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDocumentDetail(documentId);
      setDocument(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Не удалось загрузить документ';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    if (document?.file) {
      try {
        await Linking.openURL(document.file);
      } catch (err) {
        console.error('Failed to open PDF:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Завершена') {
      return isDark ? 'text-green-400' : 'text-green-600';
    }
    if (status.includes('ожидания')) {
      return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
    return isDark ? 'text-blue-400' : 'text-blue-600';
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
          <ThemedText variant="muted" className="mt-4">
            Загрузка документа...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !document) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={isDark ? '#EF4444' : '#DC2626'}
          />
          <ThemedText variant="muted" className="mt-4 text-center text-red-400">
            {error || 'Документ не найден'}
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
              <View className="flex-row items-center gap-3 mb-3">
                <Pressable
                onPress={() => navigation.goBack()}
                className={` flex-row items-center self-start rounded-xl px-4 py-2.5 ${isDark ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={isDark ? '#E5E7EB' : '#374151'}
                />

              </Pressable>
              <ThemedText variant="title" className="mb-1 text-lg font-bold">
                {document.type_doc}
              </ThemedText>
              </View>

              
              <ThemedText variant="muted" className="text-sm">
                {document.number}
              </ThemedText>
            </View>
            <View
              className={`rounded-full px-3 py-1 ${document.very_urgent
                  ? isDark
                    ? 'bg-red-600/20'
                    : 'bg-red-50'
                  : 'bg-transparent'
                }`}
            >
              <ThemedText
                variant="muted"
                className={`text-xs font-semibold ${document.very_urgent
                    ? isDark
                      ? 'text-red-400'
                      : 'text-red-600'
                    : ''
                  }`}
              >
                {document.very_urgent ? 'Весьма срочно' : ''}
              </ThemedText>
            </View>
          </View>

          <View className="mb-3 flex-row items-center">
            <Ionicons
              name="time-outline"
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText variant="muted" className="ml-2 text-sm">
              {document.date_zayavki}
            </ThemedText>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name={getStatusColor(document.status).includes('green') ? 'checkmark-circle' : 'time-outline'}
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText
              variant="muted"
              className={`ml-2 text-sm ${getStatusColor(document.status)}`}
            >
              {document.status}
            </ThemedText>
          </View>
        </ThemedCard>

        {/* Document Info */}
        <ThemedCard className="mb-4 p-4">
          <ThemedText variant="title" className="mb-3 text-base font-bold">
            Информация о документе
          </ThemedText>

          <View className="mb-3">
            <ThemedText variant="label" className="mb-1 text-xs">
              Тема:
            </ThemedText>
            <ThemedText variant="body" className="text-sm">
              {document.type}
            </ThemedText>
          </View>

          {document.text && (
            <View className="mb-3">
              <ThemedText variant="label" className="mb-1 text-xs">
                Содержание:
              </ThemedText>
              <ThemedText variant="body" className="text-sm leading-5">
                {document.text}
              </ThemedText>
            </View>
          )}

          {document.employee && (
            <View className="mb-3">
              <ThemedText variant="label" className="mb-1 text-xs">
                Автор:
              </ThemedText>
              <ThemedText variant="body" className="text-sm">
                {document.employee.first_name} {document.employee.surname}
              </ThemedText>
              {document.employee.position && (
                <ThemedText variant="muted" className="mt-0.5 text-xs">
                  {document.employee.position}
                </ThemedText>
              )}
            </View>
          )}

          {document.agreement && (
            <View className="mb-3">
              <ThemedText variant="label" className="mb-1 text-xs">
                Согласование:
              </ThemedText>
              <ThemedText variant="body" className="text-sm">
                {document.agreement}
              </ThemedText>
            </View>
          )}
        </ThemedCard>

        {/* PDF Viewer */}
        {document.file && (
          <ThemedCard className="mb-4 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <ThemedText variant="title" className="text-base font-bold">
                Документ PDF
              </ThemedText>
              <Pressable
                onPress={handleOpenPdf}
                className={`flex-row items-center rounded-lg px-3 py-2 ${isDark ? 'bg-blue-600' : 'bg-blue-600'
                  }`}
              >
                <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                <ThemedText className="ml-2 text-sm font-semibold text-white">
                  Открыть
                </ThemedText>
              </Pressable>
            </View>

            <View
              className={`overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              style={{ height: 500 }}
            >
              <WebView
                source={{ uri: document.file }}
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

