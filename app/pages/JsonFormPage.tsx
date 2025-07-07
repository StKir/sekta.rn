import { Alert } from 'react-native';
import React from 'react';
import jsonData from 'apptests/asd.json';
import { useNavigation } from '@react-navigation/native';

import { addAnswersToFormData, transformJsonToFormData } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';

const JsonFormPage = () => {
  const formData = transformJsonToFormData(jsonData);
  const navigation = useNavigation();

  const handleFormComplete = (answers: FormAnswers) => {
    const resultWithAnswers = addAnswersToFormData(formData, answers);

    Alert.alert('Тест завершен!', `Получены ответы на ${Object.keys(answers).length} вопросов`, [
      {
        text: 'Показать результат в консоли',
        onPress: () => {
          console.log('=== ИСХОДНЫЙ JSON ===');
          console.log(JSON.stringify(jsonData, null, 2));

          console.log('\n=== РЕЗУЛЬТАТ С ОТВЕТАМИ ===');
          console.log(JSON.stringify(resultWithAnswers, null, 2));

          console.log('\n=== ТОЛЬКО ОТВЕТЫ ===');
          console.log(answers);

          Alert.alert(
            'Результат сохранен',
            'Проверьте консоль разработчика для просмотра JSON с ответами',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]
          );
        },
      },
      {
        text: 'Показать краткий результат',
        onPress: () => {
          const answersList = Object.entries(answers)
            .map(([questionId, answer]) => `ID ${questionId}: ${answer}`)
            .join('\n');

          Alert.alert('Ответы пользователя', answersList, [{ text: 'OK' }]);
        },
      },
      { text: 'Закрыть' },
    ]);
  };

  return <DynamicForm formData={formData} onComplete={handleFormComplete} />;
};

export default JsonFormPage;
