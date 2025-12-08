import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { DocumentCard } from '../../widgets/document/DocumentCard';
import { DocumentSkeleton } from '../../widgets/document/DocumentSkeleton';
import { DocumentTabs } from '../../widgets/document/DocumentTabs';
import { CreateDocumentModal } from '../../widgets/document/CreateDocumentModal';
import { useDocumentStore } from '../../entities/document/model/documentStore';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { Document, DocumentType } from '../../entities/document/model/types';
import type { HomeStackParamList } from '../../app/navigation/types';

type DocumentsScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Documents'>;

export const DocumentsScreen = () => {
  const navigation = useNavigation<DocumentsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<DocumentType>('inbox');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const {
    inboxDocuments,
    outboxDocuments,
    historyDocuments,
    isLoading,
    error,
    fetchDocuments,
  } = useDocumentStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    void fetchDocuments(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (tab: DocumentType) => {
    setActiveTab(tab);
  };

  const getCurrentDocuments = (): Document[] => {
    switch (activeTab) {
      case 'inbox':
        return inboxDocuments;
      case 'outbox':
        return outboxDocuments;
      case 'history':
        return historyDocuments;
      default:
        return [];
    }
  };

  const getCurrentLoading = (): boolean => {
    switch (activeTab) {
      case 'inbox':
        return isLoading.inbox;
      case 'outbox':
        return isLoading.outbox;
      case 'history':
        return isLoading.history;
      default:
        return false;
    }
  };

  const getCurrentError = (): string | null => {
    switch (activeTab) {
      case 'inbox':
        return error.inbox;
      case 'outbox':
        return error.outbox;
      case 'history':
        return error.history;
      default:
        return null;
    }
  };

  const handleDocumentPress = (document: Document) => {
    navigation.navigate('DocumentDetail', { documentId: document.id });
  };

  const handleCreateSuccess = () => {
    // Обновить список документов после создания
    void fetchDocuments(activeTab);
  };

  const currentDocuments = getCurrentDocuments();
  const currentLoading = getCurrentLoading();
  const currentError = getCurrentError();

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View className="mb-4 flex-row items-center justify-between">
            <ThemedText variant="title" className="text-xl font-bold">
              Документооборот
            </ThemedText>
            <Pressable
              onPress={() => setIsCreateModalVisible(true)}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDark ? 'bg-blue-600' : 'bg-blue-600'
              }`}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <DocumentTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {currentLoading ? (
            <DocumentSkeleton />
          ) : currentError ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center text-red-400">
                {currentError}
              </ThemedText>
            </View>
          ) : currentDocuments?.length === 0 ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center">
                Документов пока нет
              </ThemedText>
            </View>
          ) : (
            <View>
              {currentDocuments?.reverse().map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onPress={handleDocumentPress}
                />
              ))}
            </View>
          )}
        </View>
      </AppScrollView>

      <CreateDocumentModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </ScreenContainer>
  );
};
