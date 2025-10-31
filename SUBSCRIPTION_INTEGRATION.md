# Интеграция системы подписок

## Обзор

Интеграция включает в себя:

- API клиент для работы с подписками
- Paywall компонент с 3 тарифами
- Баннер подписки
- Регистрация в DynamicForm
- Логика входа на HelloScreen

## Компоненты

### 1. API Клиент (`/app/shared/api/subscriptionApi.ts`)

```typescript
import { subscriptionApi } from '@/shared/api/subscriptionApi';

// Регистрация
await subscriptionApi.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'Имя Фамилия',
  birthDate: '1990-01-01',
  gender: 'male',
});

// Вход
await subscriptionApi.login({
  email: 'user@example.com',
  password: 'password123',
});

// Проверка доступа
const access = await subscriptionApi.checkAccess();

// Активация подписки
await subscriptionApi.activateSubscription({
  duration: '1month',
  paymentId: 'payment_123',
});
```

### 2. Хук для подписок (`/app/shared/hooks/useSubscription.ts`)

```typescript
import { useSubscription } from '@/shared/hooks/useSubscription';

const MyComponent = () => {
  const { register, login, checkAccess, activateSubscription, isLoading } = useSubscription();

  const handleRegister = async () => {
    const success = await register({
      email: 'user@example.com',
      password: 'password123',
      name: 'Имя',
      birthDate: '1990-01-01',
      gender: 'male'
    });

    if (success) {
      // Регистрация успешна
    }
  };

  return (
    // Ваш компонент
  );
};
```

### 3. Paywall компонент

```typescript
import { Paywall } from '@/shared/ui';

const MyPage = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const { activateSubscription, isLoading } = useSubscription();

  const handleSelectTariff = async (tariffId: string) => {
    const success = await activateSubscription(
      tariffId as '1month' | '3months' | '1year',
      `payment_${Date.now()}`
    );

    if (success) {
      setShowPaywall(false);
    }
  };

  return (
    <View>
      {showPaywall && (
        <Paywall
          onSelectTariff={handleSelectTariff}
          onClose={() => setShowPaywall(false)}
          isLoading={isLoading}
        />
      )}
    </View>
  );
};
```

### 4. Баннер подписки

```typescript
import { SubscriptionBanner } from '@/shared/ui';

const MyPage = () => {
  return (
    <SubscriptionBanner
      onPress={() => {
        // Открыть Paywall
        setShowPaywall(true);
      }}
      title='Разблокируйте все возможности'
      subtitle='Получите персонального AI-ассистента'
    />
  );
};
```

### 5. Интеграция с DynamicForm

```typescript
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';

const MyPage = () => {
  const handleRegistrationComplete = (userData: any) => {
    console.log('Пользователь зарегистрирован:', userData);
  };

  return (
    <DynamicForm
      formData={formData}
      enableRegistration={true}
      onComplete={handleFormComplete}
      onRegistrationComplete={handleRegistrationComplete}
    />
  );
};
```

### 6. Логика входа на HelloScreen

HelloScreen теперь поддерживает:

- Переключение между регистрацией и входом
- Форму входа с email и паролем
- Интеграцию с API

## Тарифы

### 1 месяц - 299₽

- Неограниченный доступ к AI
- Персональные рекомендации
- Анализ настроения

### 3 месяца - 699₽ (скидка 22%)

- Все функции PRO
- Экономия 22%
- Приоритетная поддержка

### 1 год - 1999₽ (скидка 44%)

- Все функции PRO
- Экономия 44%
- VIP поддержка
- Ранний доступ к новым функциям

## Примеры использования

### 1. Страница с баннером

```typescript
// /app/pages/ProfilePage.tsx
<SubscriptionBanner
  onPress={() => {
    // Открыть Paywall
    console.log('Открыть Paywall');
  }}
  title='Разблокируйте PRO функции'
  subtitle='Получите персонального AI-ассистента'
/>
```

### 2. Полная интеграция

```typescript
// /app/pages/SubscriptionExamplePage.tsx
const SubscriptionExamplePage = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const { activateSubscription, isLoading } = useSubscription();

  const handleSelectTariff = async (tariffId: string) => {
    const success = await activateSubscription(
      tariffId as '1month' | '3months' | '1year',
      `payment_${Date.now()}`
    );

    if (success) {
      setShowPaywall(false);
    }
  };

  return (
    <SafeAreaView>
      <SubscriptionBanner onPress={() => setShowPaywall(true)} />

      {showPaywall && (
        <Paywall
          onSelectTariff={handleSelectTariff}
          onClose={() => setShowPaywall(false)}
          isLoading={isLoading}
        />
      )}
    </SafeAreaView>
  );
};
```

## API Endpoints

- `POST /register` - Регистрация пользователя
- `POST /login` - Вход в систему
- `GET /user/me` - Получение данных пользователя
- `POST /subscription/check-access` - Проверка доступа к PRO функциям
- `POST /subscription/activate` - Активация подписки

## Настройка

1. API URL уже настроен в `/app/env.ts`:

   ```typescript
   export const API_URL = 'https://d5dvnkk82lmmsbbr7ob1.4b4k4pg5.apigw.yandexcloud.net';
   ```

2. Все компоненты экспортированы в `/app/shared/ui/index.ts`

3. Хук доступен в `/app/shared/hooks/useSubscription.ts`

## Тестирование

Для тестирования используйте пример страницы:

```typescript
import SubscriptionExamplePage from '@/pages/SubscriptionExamplePage';
```

Эта страница демонстрирует все возможности интеграции подписок.
