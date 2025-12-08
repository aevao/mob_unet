import { Pressable, View } from 'react-native';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { DocumentType } from '../../entities/document/model/types';

interface DocumentTabsProps {
  activeTab: DocumentType;
  onTabChange: (tab: DocumentType) => void;
}

const tabs: { key: DocumentType; label: string }[] = [
  { key: 'inbox', label: 'Входящие' },
  { key: 'outbox', label: 'Исходящие' },
  { key: 'history', label: 'История' },
];

export const DocumentTabs = ({ activeTab, onTabChange }: DocumentTabsProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View
      className={`mb-4 flex-row rounded-2xl border p-1 ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            className={`flex-1 rounded-xl py-2.5 ${
              isActive
                ? isDark
                  ? 'bg-blue-600'
                  : 'bg-blue-600'
                : 'bg-transparent'
            }`}
          >
            <ThemedText
              variant="body"
              className={`text-center text-sm font-semibold ${
                isActive
                  ? 'text-white'
                  : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
};

