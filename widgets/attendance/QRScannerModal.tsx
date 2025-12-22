import { useState, useEffect } from 'react';
import { Modal, View, Pressable, Alert, StyleSheet, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (qrCode: string) => void;
}

const { width, height } = Dimensions.get('window');

export const QRScannerModal = ({ visible, onClose, onScan }: QRScannerModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    onScan(data);
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Доступ к камере',
        'Для сканирования QR-кода необходим доступ к камере. Пожалуйста, разрешите доступ в настройках приложения.',
        [{ text: 'OK' }],
      );
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)' },
          ]}
        >
          <View
            style={[
              styles.contentContainer,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            ]}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <ThemedText variant="title" className="text-xl font-bold">
                Доступ к камере
              </ThemedText>
              <Pressable onPress={onClose}>
                <Ionicons
                  name="close"
                  size={28}
                  color={isDark ? '#F9FAFB' : '#111827'}
                />
              </Pressable>
            </View>

            <ThemedText variant="body" className="mb-6 text-base">
              Для сканирования QR-кода необходим доступ к камере устройства.
            </ThemedText>

            <Pressable
              onPress={handleRequestPermission}
              className={`rounded-xl p-4 ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <ThemedText variant="body" className="text-center text-base font-semibold text-white">
                Разрешить доступ
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)' },
        ]}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            enableTorch={false}
          />

          {/* Overlay с рамкой для сканирования */}
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Кнопка закрытия */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={40} color="#FFFFFF" />
          </Pressable>

          {/* Инструкция */}
          <View style={styles.instructionContainer}>
            <ThemedText variant="body" className="text-center text-base font-semibold text-white">
              Наведите камеру на QR-код
            </ThemedText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});

