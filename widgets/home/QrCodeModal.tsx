import { Modal, Pressable, View } from 'react-native';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';

interface QrCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QrCodeModal = ({ visible, onClose }: QrCodeModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <ThemedCard className="w-full p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <ThemedText variant="body" className="font-semibold">
              QR-code цифрового документа
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <ThemedText variant="muted" className="text-lg">
                ✕
              </ThemedText>
            </Pressable>
          </View>

          <View className="mt-3 items-center justify-center rounded-2xl bg-white p-6">
            <View className="h-40 w-40 items-center justify-center rounded-2xl border border-[#4f46e5] bg-white">
              <ThemedText variant="body" className="text-center text-xs text-[#4f46e5]">
                Здесь будет QR-код
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      </View>
    </Modal>
  );
};

