# DateInput Component

Компонент для выбора даты и времени с использованием react-native-date-picker.

## Возможности

- Выбор даты (тип 'date')
- Выбор времени (тип 'time')
- Поддержка русского языка
- Интеграция с системой тем
- Поддержка ошибок валидации
- Кастомизируемые стили

## Использование

### Базовое использование

```tsx
import { DateInput } from '@/shared/ui';

const MyComponent = () => {
  const [date, setDate] = useState<Date>();

  return <DateInput label='Выберите дату' value={date} onChange={setDate} type='date' />;
};
```

### Выбор времени

```tsx
<DateInput label='Выберите время' value={time} onChange={setTime} type='time' />
```

### С обработкой ошибок

```tsx
<DateInput
  label='Дата рождения'
  value={birthDate}
  onChange={setBirthDate}
  error='Поле обязательно для заполнения'
  type='date'
/>
```

## Пропсы

| Проп          | Тип                    | По умолчанию      | Описание                        |
| ------------- | ---------------------- | ----------------- | ------------------------------- |
| `label`       | `string`               | -                 | Текст метки над полем           |
| `error`       | `string`               | -                 | Текст ошибки валидации          |
| `value`       | `Date`                 | -                 | Выбранное значение              |
| `onChange`    | `(date: Date) => void` | -                 | Callback при изменении значения |
| `type`        | `'date' \| 'time'`     | `'date'`          | Тип выбора                      |
| `placeholder` | `string`               | `'Выберите дату'` | Placeholder текст               |
| `style`       | `any`                  | -                 | Дополнительные стили            |

## Интеграция с DynamicForm

Компонент автоматически поддерживается в DynamicForm для типов `'date'` и `'time'`:

```json
{
  "type": "date",
  "question": "Когда у вас день рождения?",
  "name": "birthday"
}
```

```json
{
  "type": "time",
  "question": "Во сколько вы просыпаетесь?",
  "name": "wakeUpTime"
}
```

## Структура файлов

```
DateInput/
├── DateInput.tsx      # Основной компонент
├── constants.ts       # Константы
├── types.ts          # Типы
├── styles.ts         # Стили
├── index.ts          # Экспорт
└── README.md         # Документация
```
