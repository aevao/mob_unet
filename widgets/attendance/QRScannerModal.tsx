import { useState, useEffect, useRef } from 'react';
import { Modal, View, Pressable, Alert, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';

export interface ScanData {
  qrCode: string;
  campus: string;
  corpus: string;
  room: string;
  latitude: number;
  longitude: number;
  photo: {
    uri: string;
    type: string;
    name: string;
  };
}

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (scanData: ScanData) => void;
}

const { width, height } = Dimensions.get('window');

export const QRScannerModal = ({ visible, onClose, onScan }: QRScannerModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setIsProcessing(false);
    }
  }, [visible]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      // Парсим QR-код (предполагаем JSON формат)
      let qrData: any;
      try {
        qrData = JSON.parse(data);
      } catch {
        // Если не JSON, используем как строку
        qrData = { qrCode: data };
      }

      // Получаем геолокацию
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        Alert.alert(
          'Доступ к геолокации',
          'Для отметки необходим доступ к геолокации. Пожалуйста, разрешите доступ в настройках приложения.',
        );
        setIsProcessing(false);
        setScanned(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Формируем данные для отправки без фото
      const scanData: ScanData = {
        qrCode: data,
        campus: qrData.campus || qrData.campus_name || '',
        corpus: qrData.corpus || qrData.corpus_name || '',
        room: qrData.room || qrData.room_name || '',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo: {
          uri: '', // Фото не требуется при начале работы
          type: 'image/jpeg',
          name: '',
        },
      };

      // Закрываем модальное окно перед вызовом onScan
      onClose();
      onScan(scanData);
    } catch (error: any) {
      console.error('Error processing scan:', error);
      Alert.alert(
        'Ошибка',
        error.message || 'Не удалось обработать QR-код. Попробуйте снова.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsProcessing(false);
              setScanned(false);
            },
          },
        ],
      );
    }
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
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned || isProcessing ? undefined : handleBarCodeScanned}
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
            {isProcessing ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#FFFFFF" />
                <ThemedText variant="body" className="mt-2 text-center text-base font-semibold text-white">
                  Обработка...
                </ThemedText>
              </View>
            ) : (
              <ThemedText variant="body" className="text-center text-base font-semibold text-white">
                Наведите камеру на QR-код
              </ThemedText>
            )}
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

