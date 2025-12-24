import { useState, useEffect, useRef } from 'react';
import { Modal, View, Pressable, Alert, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { postTabel } from '../../entities/attendance/api/attendanceApi';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const { width, height } = Dimensions.get('window');

export const QRScannerModal = ({ visible, onClose, onSuccess, onError }: QRScannerModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  // Используем ref для синхронной защиты от повторных вызовов
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  }, [visible]);

  /**
   * Парсит URL QR-кода формата http://qr.kstu.kg/<cumpus>/<korpus>/<audit>/
   * и извлекает части пути
   */
  const parseQRUrl = (url: string): { campus: string; corpus: string; room: string } => {
    try {
      // Убираем протокол и домен, оставляем только путь
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter((part) => part.length > 0);

      // Формат: /<cumpus>/<korpus>/<audit>/
      const campus = pathParts[0] || '';
      const corpus = pathParts[1] || '';
      const room = pathParts[2] || '';



      return { campus, corpus, room };
    } catch (error) {
      console.error('Error parsing QR URL:', error);
      return { campus: '', corpus: '', room: '' };
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Синхронная защита от повторных вызовов через ref
    if (isProcessingRef.current) {

      return;
    }

    // Устанавливаем флаг синхронно
    isProcessingRef.current = true;
    setScanned(true);
    setIsProcessing(true);

    try {
      // Проверяем, что QR-код является валидным URL от qr.kstu.kg
      if (!data.startsWith('http://qr.kstu.kg/') && !data.startsWith('https://qr.kstu.kg/')) {
        Alert.alert(
          'Неверный QR-код',
          'Этот QR-код не является валидным кодом для отметки посещаемости. Пожалуйста, отсканируйте QR-код с официального сайта.',
          [
            {
              text: 'OK',
              onPress: () => {
                isProcessingRef.current = false;
                setIsProcessing(false);
                setScanned(false);
                onError?.('Неверный QR-код');
              },
            },
          ],
        );
        return;
      }

      let campus = '';
      let corpus = '';
      let room = '';

      // Парсим URL (уже проверили, что это валидный URL от qr.kstu.kg)
      if (data.startsWith('http://') || data.startsWith('https://')) {
        const parsed = parseQRUrl(data);
        campus = parsed.campus;
        corpus = parsed.corpus;
        room = parsed.room;
      } else {
        // Пытаемся парсить как JSON
        try {
          const qrData = JSON.parse(data);

          campus = qrData.campus || qrData.campus_name || '';
          corpus = qrData.corpus || qrData.corpus_name || '';
          room = qrData.room || qrData.room_name || '';
        } catch {
          // Если не JSON и не URL, используем как строку
      
        }
      }

      // Получаем геолокацию
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        Alert.alert(
          'Доступ к геолокации',
          'Для отметки необходим доступ к геолокации. Пожалуйста, разрешите доступ в настройках приложения.',
        );
        isProcessingRef.current = false;
        setIsProcessing(false);
        setScanned(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

     

      // Формируем FormData для отправки
      const formData = new FormData();
      const auditorium = `${campus}/${corpus}/${room}`;
      formData.append('auditorium', auditorium);
      const geoloc_info = `${location.coords.latitude}, ${location.coords.longitude}`;
      formData.append('geo', geoloc_info);

      // Выполняем запрос на отметку
      await postTabel(formData);

      // Закрываем модальное окно
      onClose();
      isProcessingRef.current = false;
      setIsProcessing(false);
      setScanned(false);

      // Вызываем колбэк успеха
      Alert.alert('Успешно', 'Вы успешно отметились!', [
        {
          text: 'OK',
          onPress: () => {
            onSuccess?.();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error processing scan:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Не удалось отметиться';
      
      isProcessingRef.current = false;
      setIsProcessing(false);
      setScanned(false);
      
      Alert.alert('Ошибка', errorMessage, [
        {
          text: 'OK',
          onPress: () => {
            onError?.(errorMessage);
          },
        },
      ]);
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
      <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
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

