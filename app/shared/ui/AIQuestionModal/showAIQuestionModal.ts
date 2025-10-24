import React from 'react';

import AIQuestionModal from './AIQuestionModal';

import { BottomSheetManager } from '@/shared/ui/BottomSheet';

export const showAIQuestionModal = (): Promise<string> => {
  return BottomSheetManager.showWithPromise<string>(
    React.createElement(AIQuestionModal, {
      onComplete: (question: string) => {
        BottomSheetManager.resolvePromise(question);
      },
      onCancel: () => {
        BottomSheetManager.rejectPromise(null);
      },
    }),
    {
      snapPoints: ['85%', '100%'],
      detached: false,
    }
  );
};
