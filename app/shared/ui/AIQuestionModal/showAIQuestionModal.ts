import React from 'react';

import AIQuestionModal from './AIQuestionModal';

import { BottomSheetManager } from '@/shared/ui/BottomSheet';

export const showAIQuestionModal = (): Promise<string> => {
  // Создаем промис, который будет отклонен, если боттомшит закроется без выбора
  return new Promise<string>((resolve, reject) => {
    // Показываем боттомшит с модальным окном
    BottomSheetManager.showWithPromise<string>(
      React.createElement(AIQuestionModal, {
        onComplete: (question: string) => {
          resolve(question);
        },
        onCancel: () => {
          reject(new Error('Модальное окно закрыто'));
        },
      }),
      {
        snapPoints: ['85%', '100%'],
        detached: false,
      }
    ).catch((error) => {
      // Перехватываем ошибку от BottomSheetManager и отклоняем наш промис
      reject(error || new Error('Модальное окно закрыто'));
    });
  });
};
