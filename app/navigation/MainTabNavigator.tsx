import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  GradesStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  ScheduleStackParamList,
} from './types';
import { HomeScreen } from '../../pages/home/HomeScreen';
import { GradesScreen } from '../../pages/grades/GradesScreen';
import { ScheduleScreen } from '../../pages/schedule/ScheduleScreen';
import { ProfileScreen } from '../../pages/profile/ProfileScreen';
import { DocumentsScreen } from '../../pages/documents/DocumentsScreen';
import { ApplicationsScreen } from '../../pages/applications/ApplicationsScreen';
import { NewsScreen } from '../../pages/news/NewsScreen';
import { CertificatesScreen } from '../../pages/certificates/CertificatesScreen';
import { RegistrationScreen } from '../../pages/registration/RegistrationScreen';
import { TopBar } from '../../shared/ui/TopBar';

const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const GradesStack = createNativeStackNavigator<GradesStackParamList>();
const ScheduleStack = createNativeStackNavigator<ScheduleStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const HomeStackNavigator = () => (
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
      name="Registration"
      component={RegistrationScreen}
      options={{ title: 'Регистрация на дисциплины' }}
    />
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
  </HomeStack.Navigator>
);

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

export const MainTabNavigator = () => (
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
    <Tab.Screen
      name="GradesTab"
      component={GradesStackNavigator}
      options={{ title: 'Оценки' }}
    />
    <Tab.Screen
      name="ScheduleTab"
      component={ScheduleStackNavigator}
      options={{ title: 'Расписание' }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackNavigator}
      options={{ title: 'Профиль' }}
    />
  </Tab.Navigator>
);

