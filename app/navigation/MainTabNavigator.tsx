import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
import { TopBar } from '../../shared/ui/TopBar';
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';

const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const GradesStack = createNativeStackNavigator<GradesStackParamList>();
const ScheduleStack = createNativeStackNavigator<ScheduleStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();

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
  const userRole = user?.role;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
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
      {/* Расписание - только для студентов */}
      {isSectionVisible(userRole, ['all']) && (
        <Tab.Screen
          name="ScheduleTab"
          component={ScheduleStackNavigator}
          options={{ title: 'Расписание' }}
        />
      )}
      {/* Задачи - только для сотрудников */}
      {isSectionVisible(userRole, ['employee']) && (
        <Tab.Screen
          name="TasksTab"
          component={TasksStackNavigator}
          options={{ title: 'Задачи' }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

