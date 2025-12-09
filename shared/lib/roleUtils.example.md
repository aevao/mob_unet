# Руководство по использованию системы ролей

## Обзор

Система ролей позволяет управлять видимостью разделов в зависимости от роли пользователя:
- `student` - студент (userType: 'S')
- `employee` - сотрудник (userType: 'E')
- `teacher` - преподаватель (userType: 'T')
- `all` - для всех ролей

## Основная функция: `isSectionVisible`

```typescript
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';

const { user } = useAuthStore();
const userRole = user?.role;

// Проверка видимости для студентов
if (isSectionVisible(userRole, ['student'])) {
  // Показать раздел
}

// Проверка видимости для сотрудников
if (isSectionVisible(userRole, ['employee'])) {
  // Показать раздел
}

// Проверка видимости для всех
if (isSectionVisible(userRole, ['all'])) {
  // Показать раздел
}

// Проверка видимости для нескольких ролей
if (isSectionVisible(userRole, ['student', 'teacher'])) {
  // Показать раздел для студентов и преподавателей
}
```

## Примеры использования

### 1. Добавление нового раздела в SectionsList

```typescript
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';

export const SectionsList = () => {
  const { user } = useAuthStore();
  
  return (
    <View>
      {/* Раздел для всех */}
      <SectionCard
        title="Общий раздел"
        icon="document-outline"
        onPress={() => navigation.navigate('General')}
      />

      {/* Раздел только для студентов */}
      {isSectionVisible(user?.role, ['student']) && (
        <SectionCard
          title="Студенческий раздел"
          icon="school-outline"
          onPress={() => navigation.navigate('StudentSection')}
        />
      )}

      {/* Раздел только для сотрудников */}
      {isSectionVisible(user?.role, ['employee']) && (
        <SectionCard
          title="Раздел сотрудников"
          icon="briefcase-outline"
          onPress={() => navigation.navigate('EmployeeSection')}
        />
      )}

      {/* Раздел для студентов и сотрудников */}
      {isSectionVisible(user?.role, ['student', 'employee']) && (
        <SectionCard
          title="Общий раздел"
          icon="people-outline"
          onPress={() => navigation.navigate('CommonSection')}
        />
      )}
    </View>
  );
};
```

### 2. Скрытие табов в навигации

```typescript
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';

export const MainTabNavigator = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      
      {/* Таб только для студентов */}
      {isSectionVisible(userRole, ['student']) && (
        <Tab.Screen name="StudentTab" component={StudentScreen} />
      )}
      
      {/* Таб только для сотрудников */}
      {isSectionVisible(userRole, ['employee']) && (
        <Tab.Screen name="EmployeeTab" component={EmployeeScreen} />
      )}
    </Tab.Navigator>
  );
};
```

### 3. Условное отображение компонентов

```typescript
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';

export const MyScreen = () => {
  const { user } = useAuthStore();

  return (
    <View>
      {/* Компонент для всех */}
      <CommonComponent />

      {/* Компонент только для студентов */}
      {isSectionVisible(user?.role, ['student']) && (
        <StudentComponent />
      )}

      {/* Компонент только для сотрудников */}
      {isSectionVisible(user?.role, ['employee']) && (
        <EmployeeComponent />
      )}
    </View>
  );
};
```

### 4. Условная навигация в Stack Navigator

```typescript
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { useAuthStore } from '../../entities/session/model/authStore';

const MyStackNavigator = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      
      {/* Экран только для студентов */}
      {isSectionVisible(userRole, ['student']) && (
        <Stack.Screen 
          name="StudentScreen" 
          component={StudentScreen} 
        />
      )}
      
      {/* Экран только для сотрудников */}
      {isSectionVisible(userRole, ['employee']) && (
        <Stack.Screen 
          name="EmployeeScreen" 
          component={EmployeeScreen} 
        />
      )}
    </Stack.Navigator>
  );
};
```

## Важные замечания

1. **Всегда проверяйте роль перед рендерингом** - это предотвращает ошибки навигации
2. **Используйте `['all']` для разделов, доступных всем** - это явно показывает намерение
3. **Роль определяется из токена** - `userType: 'S'` = student, `userType: 'E'` = employee
4. **Если пользователь не авторизован** - `isSectionVisible` вернет `false`

## Текущие настройки

- **Скрыто для сотрудников:**
  - Таб "Оценки" (GradesTab)
  - Таб "Расписание" (ScheduleTab)
  - Раздел "Регистрация на дисциплины"
  - Студенческий билет (StudentTicketCard)

- **Доступно для всех:**
  - Раздел "Документооборот"
  - Раздел "Новости"
  - Раздел "Справки"
  - Таб "Главная"
  - Таб "Профиль"

