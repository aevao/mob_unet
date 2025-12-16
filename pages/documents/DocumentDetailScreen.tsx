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
import type { DocumentDetail, ApplicationMember } from '../../entities/document/model/detailTypes';
import type { HomeStackParamList } from '../../app/navigation/types';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';

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
  const [expandedMembers, setExpandedMembers] = useState<Set<number>>(new Set());

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

        {/* Participants Section */}
        {document.applicationmember && document.applicationmember.length > 0 && (
          <ThemedCard className="mb-4 p-4">
            <ThemedText variant="title" className="mb-3 text-base font-bold">
              Участники согласования ({document.applicationmember.length})
            </ThemedText>

            <View>
              {document.applicationmember
                .sort((a, b) => a.member_queue - b.member_queue)
                .map((member) => {
                  const hasDetails = member.member_refusal || member.repeat_comment || member.date_check_member;
                  const isExpanded = expandedMembers.has(member.id);

                  const toggleExpand = () => {
                    if (hasDetails) {
                      setExpandedMembers((prev) => {
                        const next = new Set(prev);
                        if (next.has(member.id)) {
                          next.delete(member.id);
                        } else {
                          next.add(member.id);
                        }
                        return next;
                      });
                    }
                  };

                  return (
                    <Pressable
                      key={member.id}
                      onPress={toggleExpand}
                      className={`mb-2 rounded-2xl border px-3 py-2 ${
                        isDark
                          ? member.turn
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-gray-700 bg-gray-800/30'
                          : member.turn
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <View className="flex-row items-center">
                       

                        {/* Avatar */}
                        <View className="mr-2">
                          <OptimizedImage
                            uri={member.image}
                            style={{ width: 36, height: 36, borderRadius: 18 }}
                            resizeMode="cover"
                            fallbackIcon="person"
                            showLoadingIndicator={false}
                          />
                          {member.is_online && (
                            <View
                              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: '#10B981',
                                borderWidth: 2,
                                borderColor: isDark ? '#1F2937' : '#FFFFFF',
                              }}
                            />
                          )}
                        </View>

                        {/* Info */}
                        <View className="flex-1">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <ThemedText variant="title" className="text-xs font-semibold" numberOfLines={1}>
                                {member.name}
                              </ThemedText>
                              <ThemedText variant="muted" className="text-xs" numberOfLines={1}>
                                {member.position}
                              </ThemedText>
                            </View>
                            {member.turn && (
                              <View
                                className={`ml-2 rounded-full px-1.5 py-0.5 ${
                                  isDark ? 'bg-blue-600/30' : 'bg-blue-100'
                                }`}
                              >
                                <ThemedText
                                  variant="label"
                                  className={`text-[10px] ${isDark ? 'text-blue-400' : 'text-blue-700'}`}
                                >
                                  Очередь
                                </ThemedText>
                              </View>
                            )}
                          </View>

                          <View className="mt-1 flex-row items-center">
                            <ThemedText
                              variant="muted"
                              className={`text-[10px] ${
                                member.status === 'Одобрено'
                                  ? isDark
                                    ? 'text-green-400'
                                    : 'text-green-600'
                                  : member.status === 'Отклонено'
                                    ? isDark
                                      ? 'text-red-400'
                                      : 'text-red-600'
                                    : ''
                              }`}
                            >
                              {member.status}
                            </ThemedText>
                            {member.name_approval && (
                              <>
                                <ThemedText variant="muted" className="mx-1 text-[10px]">
                                  •
                                </ThemedText>
                                <ThemedText variant="muted" className="text-[10px]">
                                  {member.name_approval}
                                </ThemedText>
                              </>
                            )}
                            {hasDetails && (
                              <Ionicons
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                size={12}
                                color={isDark ? '#9CA3AF' : '#6B7280'}
                                style={{ marginLeft: 'auto' }}
                              />
                            )}
                          </View>
                        </View>
                      </View>

                      {/* Expanded Details */}
                      {isExpanded && hasDetails && (
                        <View className="mt-2 border-t pt-2" style={{ borderTopColor: isDark ? '#374151' : '#E5E7EB' }}>
                          {member.date_check_member && (
                            <View className="mb-1 flex-row items-center">
                              <Ionicons
                                name="time-outline"
                                size={10}
                                color={isDark ? '#9CA3AF' : '#6B7280'}
                              />
                              <ThemedText variant="muted" className="ml-1 text-[10px]">
                                {member.date_check_member}
                              </ThemedText>
                            </View>
                          )}
                          {member.member_refusal && (
                            <View
                              className={`mb-1 rounded p-1.5 ${
                                isDark ? 'bg-red-900/20' : 'bg-red-50'
                              }`}
                            >
                              <ThemedText
                                variant="muted"
                                className={`text-[10px] ${isDark ? 'text-red-400' : 'text-red-600'}`}
                              >
                                Отказ: {member.member_refusal}
                              </ThemedText>
                            </View>
                          )}
                          {member.repeat_comment && (
                            <View
                              className={`rounded p-1.5 ${
                                isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'
                              }`}
                            >
                              <ThemedText
                                variant="muted"
                                className={`text-[10px] ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}
                              >
                                Комментарий: {member.repeat_comment}
                              </ThemedText>
                            </View>
                          )}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
            </View>
          </ThemedCard>
        )}

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

