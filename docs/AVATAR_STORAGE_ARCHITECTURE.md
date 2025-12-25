# Архитектура хранения аватарки пользователя

## Проблема

При первой авторизации сервер возвращает JWT access token, в payload которого есть поле `imeag` (URL или base64 с аватаркой пользователя). После сохранения токенов пользователь заходит в систему автоматически, но запрос профиля не выполняется, из-за чего аватарка пропадает после перезапуска приложения.

## Решение

### 1. Декодирование JWT токена

Используется библиотека `jwt-decode` для извлечения данных из access token:

```typescript
// shared/lib/decodeUserFromToken.ts
import { jwtDecode } from 'jwt-decode';

const payload = jwtDecode<TokenPayload>(token);
const avatarData = payload.user_data?.imeag; // Извлекаем поле imeag
```

### 2. Определение типа данных аватарки

Создана утилита `avatarStorage.ts` для определения типа данных:

- **URL**: Проверяется через `new URL(str)` - если успешно, значит это URL
- **Base64 с префиксом**: Паттерн `/^data:image\/(jpeg|jpg|png|gif|webp);base64,/i`
- **Base64 без префикса**: Проверка на base64 алфавит и длину строки

### 3. Сохранение аватарки

#### Для URL:
```typescript
// Просто сохраняем URL в AsyncStorage
await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, avatarUrl);
```

#### Для Base64:
```typescript
// Сохраняем как файл в FileSystem
const fileUri = `${FileSystem.documentDirectory}avatar_${Date.now()}.jpg`;
await FileSystem.writeAsStringAsync(fileUri, base64Data, {
  encoding: FileSystem.EncodingType.Base64,
});
// Сохраняем путь к файлу в AsyncStorage
await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, fileUri);
```

### 4. Восстановление при старте приложения

При инициализации (`initialize`):

1. Декодируем access token из AsyncStorage
2. Извлекаем `imeag` из payload
3. Если `imeag` есть в токене - сохраняем его (может быть URL или base64)
4. Если `imeag` нет - используем сохраненную ранее аватарку из локального хранилища

```typescript
const decodedUser = buildUser(accessToken);

let finalStoredAvatarUrl: string | null = null;

if (decodedUser?.avatarUrl) {
  // Сохраняем аватарку из токена
  finalStoredAvatarUrl = await saveAvatar(decodedUser.avatarUrl);
} else {
  // Используем сохраненную ранее
  finalStoredAvatarUrl = await getStoredAvatar();
}
```

### 5. Обновление токена (refresh)

При обновлении access token через `setTokens`:

1. Декодируем новый токен
2. Если в новом токене есть `imeag` - сохраняем его (обновляем аватарку)
3. Если в новом токене нет `imeag` - сохраняем текущую сохраненную аватарку

**Важно**: Аватарка не теряется при refresh, так как мы всегда проверяем сохраненную аватарку, если в токене её нет.

### 6. Приоритет аватарки

В компонентах используется следующая логика приоритета:

```typescript
// shared/lib/getUserAvatar.ts
// Приоритет: ticketPhoto > currentAvatarUrl > storedAvatarUrl
```

1. **ticketPhoto** - фото из студенческого билета (если есть)
2. **currentAvatarUrl** - аватарка из текущего токена
3. **storedAvatarUrl** - сохраненная аватарка из локального хранилища

## Файловая структура

```
shared/lib/
  ├── avatarStorage.ts          # Утилиты для сохранения/восстановления аватарки
  ├── decodeUserFromToken.ts     # Декодирование JWT токена
  └── getUserAvatar.ts           # Получение аватарки с приоритетом

entities/session/model/
  └── authStore.ts               # Store с логикой сохранения аватарки
```

## Примеры использования

### Сохранение аватарки из токена

```typescript
// После успешной авторизации
const user = buildUser(accessToken);
const savedAvatarUrl = await saveAvatar(user?.avatarUrl || null);
```

### Получение аватарки в компоненте

```typescript
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';

const avatarUrl = getUserAvatarSync(
  user?.avatarUrl,      // Из токена
  ticket?.photo,        // Из студенческого билета
  storedAvatarUrl       // Из локального хранилища
);
```

### Очистка аватарки при выходе

```typescript
// При logout
await clearStoredAvatar(); // Удаляет файлы и данные из AsyncStorage
```

## Преимущества решения

1. ✅ **Не требует запроса профиля** - данные берутся из JWT токена
2. ✅ **Работает с URL и base64** - автоматически определяет тип
3. ✅ **Сохраняется между перезапусками** - данные в локальном хранилище
4. ✅ **Не теряется при refresh** - проверяет сохраненную аватарку
5. ✅ **Оптимизировано** - base64 сохраняется как файл, URL как строка
6. ✅ **Очистка старых файлов** - автоматически удаляет предыдущие файлы аватарки

## Обработка ошибок

Все операции обернуты в try-catch:

- При ошибке сохранения base64 как файл - сохраняется в AsyncStorage
- При ошибке чтения файла - возвращается null
- При ошибке удаления старого файла - игнорируется (не критично)

