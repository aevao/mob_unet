import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GradesStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  ScheduleStackParamList,
  TasksStackParamList,
} from './types';
import { HomeScreen } from '../../pages/home/HomeScreen';
import { GradesScreen } from '../../pages/grades/GradesScreen';
import { ScheduleScreen } from '../../pages/schedule/ScheduleScreen';
import { ProfileScreen } from '../../pages/profile/ProfileScreen';
import { TasksScreen } from '../../pages/tasks/TasksScreen';
import { TaskDetailScreen } from '../../pages/tasks/TaskDetailScreen';
import { DocumentsScreen } from '../../pages/documents/DocumentsScreen';
import { DocumentDetailScreen } from '../../pages/documents/DocumentDetailScreen';
import { ApplicationsScreen } from '../../pages/applications/ApplicationsScreen';
import { NewsScreen } from '../../pages/news/NewsScreen';
import { CertificatesScreen } from '../../pages/certificates/CertificatesScreen';
import { CertificateDetailScreen } from '../../pages/certificates/CertificateDetailScreen';
import { RegistrationScreen } from '../../pages/registration/RegistrationScreen';
import { PersonalCardScreen } from '../../pages/personalCard/PersonalCardScreen';
import { PersonalDataScreen } from '../../pages/personalCard/PersonalDataScreen';
import { ScientificActivityScreen } from '../../pages/personalCard/ScientificActivityScreen';
import { TabScreen } from '../../pages/attendance/TabScreen';
import { StudentTicketScreen } from '../../pages/studentTicket/StudentTicketScreen';
import { EmployeeCardScreen } from '../../pages/employeeCard/EmployeeCardScreen';
import { VedomostScreen } from '../../pages/vedomost/VedomostScreen';
import { ElectronicJournalScreen } from '../../pages/electronicJournal/ElectronicJournalScreen';
import { TopBar } from '../../shared/ui/TopBar';
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { QRScannerModal } from '../../widgets/attendance/QRScannerModal';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchMyTabelLast } from '../../entities/attendance/api/attendanceApi';
import { useTabelStore } from '../../entities/attendance/model/tabelStore';
import { Alert } from 'react-native';

type TabNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const GradesStack = createNativeStackNavigator<GradesStackParamList>();
const ScheduleStack = createNativeStackNavigator<ScheduleStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();

// Компонент кнопки QR для реактивности к изменениям состояния
const QRButton = ({
  isMarked,
  isDark,
  onPress,
}: {
  isMarked: boolean;
  isDark: boolean;
  onPress: () => void;
}) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={onPress}
        disabled={isMarked}
        className={`h-14 w-14 items-center justify-center rounded-full ${
          isDark ? 'bg-blue-900/30' : 'bg-blue-50'
        } ${isMarked ? 'opacity-60' : ''}`}
      >
        <Ionicons 
          name={isMarked ? 'checkmark-circle' : 'qr-code-outline'} 
          size={32} 
          color={isDark ? '#60A5FA' : '#3B82F6'} 
        />
      </Pressable>
    </View>
  );
};

const HomeStackNavigator = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  return (
    <HomeStack.Navigator
      screenOptions={{
        header: () => <TopBar />,
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Главная' }}
      />
      <HomeStack.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ title: 'Документооборот' }}
      />
      <HomeStack.Screen
        name="DocumentDetail"
        component={DocumentDetailScreen}
        options={{ title: 'Детали документа' }}
      />
      {/* Регистрация на дисциплины - только для студентов */}
      {isSectionVisible(userRole, ['student']) && (
        <HomeStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: 'Регистрация на дисциплины' }}
        />
      )}
      <HomeStack.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{ title: 'Заявления' }}
      />
      <HomeStack.Screen
        name="News"
        component={NewsScreen}
        options={{ title: 'Новости' }}
      />
      <HomeStack.Screen
        name="Certificates"
        component={CertificatesScreen}
        options={{ title: 'Справки' }}
      />
      <HomeStack.Screen
        name="CertificateDetail"
        component={CertificateDetailScreen}
        options={{ title: 'Детали справки' }}
      />
      <HomeStack.Screen
        name="PersonalCard"
        component={PersonalCardScreen}
        options={{ title: 'Личная карточка' }}
      />
      <HomeStack.Screen
        name="PersonalData"
        component={PersonalDataScreen}
        options={{ title: 'Персональные данные' }}
      />
      <HomeStack.Screen
        name="ScientificActivity"
        component={ScientificActivityScreen}
        options={{ title: 'Научная деятельность' }}
      />
      <HomeStack.Screen
        name="Tab"
        component={TabScreen}
        options={{ title: 'Табель' }}
      />
      <HomeStack.Screen
        name="Vedomost"
        component={VedomostScreen}
        options={{ title: 'Ведомость' }}
      />
      <HomeStack.Screen
        name="ElectronicJournal"
        component={ElectronicJournalScreen}
        options={{ title: 'Электронный журнал' }}
      />
      {/* Студенческий билет - только для студентов */}
      {isSectionVisible(userRole, ['student']) && (
        <HomeStack.Screen
          name="StudentTicket"
          component={StudentTicketScreen}
          options={{ title: 'Студенческий билет' }}
        />
      )}
      {/* Карточка сотрудника - только для сотрудников */}
      {isSectionVisible(userRole, ['employee']) && (
        <HomeStack.Screen
          name="EmployeeCard"
          component={EmployeeCardScreen}
          options={{ title: 'Карточка сотрудника' }}
        />
      )}
    </HomeStack.Navigator>
  );
};

const GradesStackNavigator = () => (
  <GradesStack.Navigator
    screenOptions={{
      header: () => <TopBar />,
    }}
  >
    <GradesStack.Screen
      name="Grades"
      component={GradesScreen}
      options={{ title: 'Оценки' }}
    />
  </GradesStack.Navigator>
);

const ScheduleStackNavigator = () => (
  <ScheduleStack.Navigator
    screenOptions={{
      header: () => <TopBar />,
    }}
  >
    <ScheduleStack.Screen
      name="Schedule"
      component={ScheduleScreen}
      options={{ title: 'Расписание' }}
    />
  </ScheduleStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      header: () => <TopBar />,
    }}
  >
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Профиль' }}
    />
  </ProfileStack.Navigator>
);

const TasksStackNavigator = () => (
  <TasksStack.Navigator
    screenOptions={{
      header: () => <TopBar />,
    }}
  >
    <TasksStack.Screen
      name="Tasks"
      component={TasksScreen}
      options={{ title: 'Задачи' }}
    />
    <TasksStack.Screen
      name="TaskDetail"
      component={TaskDetailScreen}
      options={{ title: 'Детали задачи' }}
    />
  </TasksStack.Navigator>
);

export const MainTabNavigator = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const userRole = user?.role;
  const navigation = useNavigation<TabNavigationProp>();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [lastTabelRecord, setLastTabelRecord] = useState<any>(null);
  const { refreshTabel } = useTabelStore();

  // Загружаем последнюю запись табеля для проверки статуса
  useEffect(() => {
    const loadLastTabel = async () => {
      try {
        const lastRecord = await fetchMyTabelLast();
        setLastTabelRecord(lastRecord);
      } catch (error) {
        console.error('Error loading last tabel:', error);
        setLastTabelRecord(null);
      }
    };
    void loadLastTabel();
  }, []);

  const handleQRSuccess = useCallback(() => {
    // Обновляем данные после успешной отметки
    const loadLastTabel = async () => {
      try {
        const lastRecord = await fetchMyTabelLast();
        setLastTabelRecord(lastRecord);
      } catch (error) {
        console.error('Error loading last tabel:', error);
      }
    };
    void loadLastTabel();
    
    // Триггерим обновление виджета через store
    refreshTabel();
    
    console.log('handleQRSuccess called, setting isMarked to true');
    // Устанавливаем состояние успешной отметки
    setIsMarked(true);
    
    // Навигация на экран табеля для обновления данных
    try {
      const parent = navigation.getParent();
      if (parent) {
        (parent as any).navigate('HomeTab', { screen: 'Tab' });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
    
    // Сбрасываем состояние через 3 секунды, чтобы можно было отметить снова
    setTimeout(() => {
      console.log('Resetting isMarked to false');
      setIsMarked(false);
    }, 3000);
  }, [navigation, refreshTabel]);

  const handleQRButtonPress = useCallback(() => {
    if (isMarked) {
      return;
    }

    // Проверяем, завершен ли рабочий день
    if (lastTabelRecord?.status_info === 'Завершен') {
      Alert.alert(
        'Рабочий день завершен',
        'На сегодня вы уже завершили рабочий день. Отметка недоступна.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowQRScanner(true);
  }, [isMarked, lastTabelRecord]);

  // Мемоизируем options для QRTab с зависимостями от isMarked и isDark
  const qrTabOptions = useMemo(
    () => ({
      title: '',
      tabBarButton: (props: any) => (
        <QRButton
          key={`qr-button-${isMarked}`}
          isMarked={isMarked}
          isDark={isDark}
          onPress={handleQRButtonPress}
        />
      ),
    }),
    [isMarked, isDark, handleQRButtonPress],
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

            if (route.name === 'HomeTab') {
              iconName = 'home-outline';
            } else if (route.name === 'GradesTab') {
              iconName = 'school-outline';
            } else if (route.name === 'ScheduleTab') {
              iconName = 'calendar-outline';
            } else if (route.name === 'TasksTab') {
              iconName = 'checkmark-done-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = 'person-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{ title: 'Главная' }}
        />
        {/* Оценки - только для студентов */}
        {isSectionVisible(userRole, ['student']) && (
          <Tab.Screen
            name="GradesTab"
            component={GradesStackNavigator}
            options={{ title: 'Оценки' }}
          />
        )}
         {isSectionVisible(userRole, ['employee']) && (
          <Tab.Screen
            name="TasksTab"
            component={TasksStackNavigator}
            options={{ title: 'Задачи' }}
          />
        )}
        
        {/* Центральная кнопка QR code как пустой экран */}
        <Tab.Screen
          name="QRTab"
          component={View}
          options={qrTabOptions}
        />

        {isSectionVisible(userRole, ['all']) && (
          <Tab.Screen
            name="ScheduleTab"
            component={ScheduleStackNavigator}
            options={{ title: 'Расписание' }}
          />
        )}
       
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{ title: 'Профиль' }}
        />
      </Tab.Navigator>

      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onSuccess={handleQRSuccess}
      />
    </>
  );
};

